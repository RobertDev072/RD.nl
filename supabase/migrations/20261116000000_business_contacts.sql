-- Business contact details for the daily Telegram report (decision Robert 16-11-2026):
-- store the published business phone for ALL discovered businesses (not only B.V./N.V.),
-- plus the business e-mail published on their own website. legal_form keeps marking B.V./N.V.
-- E-mail is for follow-up after contact only (no cold e-mail, art. 11.7 Tw).
-- Additive only: no drops, no deletes.

alter table leads add column if not exists business_email text;
alter table leads add column if not exists contact_checked_at timestamptz;

create or replace function upsert_discovered_business(
  p_osm_id text, p_name text, p_category text, p_website text, p_domain text,
  p_address text, p_postcode text, p_city text, p_source text, p_phone text default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_norm text := normalize_business_name(p_name);
  v_legal text := case when p_name ~* '\m(b\.?\s?v\.?|n\.?\s?v\.?)\s*$' then 'bv/nv' end;
  v_phone text := nullif(left(p_phone, 40), '');
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

-- Contact details found on the business's own website. Never overwrites a value already known.
create or replace function set_lead_contact(p_id uuid, p_phone text, p_email text) returns void
language plpgsql security definer set search_path = public as $$
begin
  update leads set
    business_phone = coalesce(business_phone, nullif(left(p_phone, 40), '')),
    business_email = coalesce(business_email, nullif(lower(left(p_email, 200)), '')),
    contact_checked_at = now()
  where id = p_id and source = 'discovery';
end $$;
revoke all on function set_lead_contact(uuid, text, text) from public, anon, authenticated;
grant execute on function set_lead_contact(uuid, text, text) to service_role;
