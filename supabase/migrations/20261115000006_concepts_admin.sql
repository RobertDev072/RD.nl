-- Concepts (lorvex.nl/voor/<slug>), letters, call list and admin status tracking.

alter table leads
  add column if not exists slug           text,
  add column if not exists business_phone text,      -- only stored for legal persons (B.V./N.V.)
  add column if not exists concept_views  integer not null default 0,
  add column if not exists letter_delivered_at timestamptz;
create unique index if not exists leads_slug_unique on leads (slug) where slug is not null;

create or replace function make_slug(p_name text, p_id uuid) returns text
language sql immutable set search_path = '' as $$
  select trim(both '-' from regexp_replace(lower(coalesce(p_name, 'bedrijf')), '[^a-z0-9]+', '-', 'g'))
         || '-' || left(replace(p_id::text, '-', ''), 6);
$$;

-- Qualified leads get a concept slug (also back-fills existing qualified rows).
create or replace function ensure_slug() returns trigger language plpgsql set search_path = public as $$
begin
  if new.status = 'qualified' and new.slug is null then new.slug := make_slug(new.business_name, new.id); end if;
  return new;
end $$;
create trigger leads_ensure_slug before insert or update on leads for each row execute function ensure_slug();
update leads set slug = make_slug(business_name, id) where status = 'qualified' and slug is null;

-- Public concept page: fetch minimal, non-personal business data + count the visit.
create or replace function concept_view(p_slug text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare r leads;
begin
  select * into r from leads where slug = p_slug and status not in ('lost', 'disqualified');
  if not found then return null; end if;
  update leads set concept_views = concept_views + 1 where id = r.id;
  if r.concept_views = 0 then
    insert into events (type, source_agent, subject_type, subject_id, payload)
    values ('concept.first_view', 'website', 'lead', r.id::text, jsonb_build_object('slug', p_slug));
  end if;
  return jsonb_build_object('name', r.business_name, 'category', r.category, 'city', r.city,
                            'website', r.website, 'domain', r.domain, 'findings', r.audit->'findings', 'site_score', r.audit->'score');
end $$;

-- "Yes, contact me" from the concept page: stores contact data WITH consent, marks lead responded.
create or replace function concept_request_contact(
  p_slug text, p_name text, p_email text, p_phone text, p_consent_text text, p_ip_hash text, p_user_agent text
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_lead uuid; v_consent uuid; v_has_contact boolean;
begin
  select id, contact_email is not null into v_lead, v_has_contact from leads where slug = p_slug for update;
  if not found then return jsonb_build_object('status', 'not_found'); end if;
  insert into consents (lead_id, purpose, consent_text, channel, ip_hash, user_agent)
  values (v_lead, 'concept_contact_request', p_consent_text,
          case when nullif(p_phone, '') is null then '{email}'::text[] else '{email,phone,whatsapp}'::text[] end,
          p_ip_hash, left(p_user_agent, 300))
  returning id into v_consent;
  if v_has_contact then
    insert into activities (lead_id, actor, type, data) values (v_lead, 'website', 'additional_contact_request',
      jsonb_build_object('consent_id', v_consent, 'name', p_name, 'email', p_email, 'phone', nullif(p_phone, '')));
  else
    update leads set contact_name = p_name, contact_email = p_email, contact_phone = nullif(p_phone, ''), consent_id = v_consent
    where id = v_lead;
  end if;
  update leads set status = 'responded' where id = v_lead;
  insert into activities (lead_id, actor, type, data) values (v_lead, 'website', 'concept_contact_request', '{}');
  insert into events (type, source_agent, subject_type, subject_id, payload)
  values ('lead.responded', 'website', 'lead', v_lead::text, jsonb_build_object('via', 'concept'));
  return jsonb_build_object('status', 'ok');
end $$;

-- "No thanks" from the concept page: never contact again (suppression) and close the lead.
create or replace function concept_opt_out(p_slug text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare r leads;
begin
  select * into r from leads where slug = p_slug;
  if not found then return jsonb_build_object('status', 'not_found'); end if;
  if r.domain is not null then
    insert into suppression_list (domain, reason) values (r.domain, 'opt-out via voorbeeldpagina');
  end if;
  update leads set status = 'lost', business_phone = null where id = r.id;
  insert into activities (lead_id, actor, type, data) values (r.id, 'website', 'opt_out', '{}');
  return jsonb_build_object('status', 'ok');
end $$;

-- Admin status changes (Robert): letter delivered, called, proposal, won, lost.
create or replace function admin_update_lead(p_id uuid, p_action text, p_note text default null) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_action = 'letter_delivered' then
    update leads set letter_delivered_at = now(), status = case when status = 'qualified' then 'contacted' else status end where id = p_id;
  elsif p_action in ('contacted', 'proposal', 'won', 'lost') then
    update leads set status = p_action::lead_status where id = p_id;
  elsif p_action <> 'note' then
    raise exception 'unknown action';
  end if;
  insert into activities (lead_id, actor, type, data) values (p_id, 'robert', p_action, jsonb_build_object('note', p_note));
  insert into audit_log (actor, action, target, data) values ('robert', 'lead.' || p_action, p_id::text, jsonb_build_object('note', p_note));
end $$;

do $$ declare f text; begin
  foreach f in array array['concept_view(text)', 'concept_request_contact(text,text,text,text,text,text,text)',
                           'concept_opt_out(text)', 'admin_update_lead(uuid,text,text)'] loop
    execute format('revoke all on function %s from public, anon, authenticated', f);
    execute format('grant execute on function %s to service_role', f);
  end loop;
end $$;

-- Discovery also stores the business phone, but ONLY for legal persons (B.V./N.V. in the name),
-- because only they may be called for sales without prior consent.
-- New 10-argument version (with p_phone). The old 9-argument version stays; the lead engine always
-- sends p_phone, so PostgREST resolves to this one. No destructive statements in this migration.
create or replace function upsert_discovered_business(
  p_osm_id text, p_name text, p_category text, p_website text, p_domain text,
  p_address text, p_postcode text, p_city text, p_source text, p_phone text default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_norm text := normalize_business_name(p_name);
  v_legal text := case when p_name ~* '\m(b\.?\s?v\.?|n\.?\s?v\.?)\s*$' then 'bv/nv' end;
  v_phone text := case when v_legal is not null then nullif(p_phone, '') end;
  v_id uuid; v_how text;
begin
  if p_domain is not null and exists (select 1 from suppression_list where domain = p_domain) then
    return jsonb_build_object('status', 'suppressed');
  end if;
  select id, 'osm' into v_id, v_how from leads where osm_id = p_osm_id limit 1;
  if v_id is null and p_domain is not null then
    select id, 'domain' into v_id, v_how from leads where domain = p_domain limit 1;
  end if;
  if v_id is null and v_norm is not null then
    select id, 'name' into v_id, v_how from leads
    where name_normalized % v_norm and similarity(name_normalized, v_norm) >= 0.7
      and ((p_postcode is not null and postcode = p_postcode) or (p_postcode is null and city = p_city))
    order by similarity(name_normalized, v_norm) desc limit 1;
  end if;
  if v_id is not null then
    update leads set
      sources = case when p_source = any (sources) then sources else sources || p_source end,
      osm_id = coalesce(osm_id, p_osm_id), website = coalesce(website, p_website), domain = coalesce(domain, p_domain),
      category = coalesce(category, p_category), address = coalesce(address, p_address),
      postcode = coalesce(postcode, p_postcode), city = coalesce(city, p_city),
      legal_form = coalesce(legal_form, v_legal), business_phone = coalesce(business_phone, v_phone)
    where id = v_id;
    return jsonb_build_object('status', 'existing', 'matched_on', v_how, 'id', v_id);
  end if;
  insert into leads (source, status, business_name, name_normalized, category, website, domain,
                     address, postcode, city, osm_id, verification_status, sources, legal_form, business_phone)
  values ('discovery', 'new', p_name, v_norm, p_category, p_website, p_domain,
          p_address, p_postcode, p_city, p_osm_id, 'pending', array[p_source], v_legal, v_phone)
  returning id into v_id;
  insert into events (type, source_agent, subject_type, subject_id, payload)
  values ('lead.discovered', 'lead-agent', 'lead', v_id::text, jsonb_build_object('category', p_category, 'source', p_source));
  return jsonb_build_object('status', 'new', 'id', v_id);
end $$;
revoke all on function upsert_discovered_business(text,text,text,text,text,text,text,text,text,text) from public, anon, authenticated;
grant execute on function upsert_discovered_business(text,text,text,text,text,text,text,text,text,text) to service_role;
