-- Lead engine v1: discovery, deduplication, verification, scoring, daily selection.
-- Only public BUSINESS data is stored for discovered companies (no personal phone numbers,
-- no owner names). No outreach happens here.

create extension if not exists pg_trgm;

create type verification_status as enum (
  'pending', 'verified_active', 'uncertain', 'appears_inactive', 'duplicate', 'disqualified'
);

alter table leads
  add column if not exists osm_id              text,
  add column if not exists name_normalized     text,
  add column if not exists postcode            text,
  add column if not exists verification_status verification_status,
  add column if not exists verified_at         timestamptz,
  add column if not exists verify_attempts     integer not null default 0,
  add column if not exists evidence            jsonb,
  add column if not exists score_reasons       jsonb,
  add column if not exists sources             text[] not null default '{}',
  add column if not exists qualified_at        timestamptz;

create unique index if not exists leads_osm_unique on leads (osm_id) where osm_id is not null;
create index if not exists leads_name_trgm on leads using gin (name_normalized gin_trgm_ops);
create index if not exists leads_verification_idx on leads (verification_status, verified_at);

insert into agents (id, name, module, enabled, auto_permissions, approval_permissions) values
  ('lead-agent', 'Lead engine (discovery, verification, scoring)', 'acquisition', true,
   '{lead.discover,lead.verify,lead.score,lead.qualify}', '{outreach.send}')
on conflict (id) do nothing;

-- Normalise a business name for duplicate matching.
create or replace function normalize_business_name(p text) returns text
language sql immutable set search_path = '' as $$
  select nullif(trim(regexp_replace(
    regexp_replace(lower(coalesce(p, '')), '\m(b\.?v\.?|v\.?o\.?f\.?|holding|the|de|het)\M', ' ', 'g'),
    '[^a-z0-9]+', ' ', 'g')), '');
$$;

-- Insert a discovered business, or match it to an existing lead. Never creates a second
-- lead for the same business: matches on OSM id, website domain, or a very similar name in
-- the same postcode/city. Suppressed domains are skipped.
create or replace function upsert_discovered_business(
  p_osm_id text, p_name text, p_category text, p_website text, p_domain text,
  p_address text, p_postcode text, p_city text, p_source text
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_norm text := normalize_business_name(p_name);
  v_id uuid;
  v_how text;
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
      osm_id = coalesce(osm_id, p_osm_id),
      website = coalesce(website, p_website),
      domain = coalesce(domain, p_domain),
      category = coalesce(category, p_category),
      address = coalesce(address, p_address),
      postcode = coalesce(postcode, p_postcode),
      city = coalesce(city, p_city)
    where id = v_id;
    return jsonb_build_object('status', 'existing', 'matched_on', v_how, 'id', v_id);
  end if;

  insert into leads (source, status, business_name, name_normalized, category, website, domain,
                     address, postcode, city, osm_id, verification_status, sources)
  values ('discovery', 'new', p_name, v_norm, p_category, p_website, p_domain,
          p_address, p_postcode, p_city, p_osm_id, 'pending', array[p_source])
  returning id into v_id;

  insert into events (type, source_agent, subject_type, subject_id, payload)
  values ('lead.discovered', 'lead-agent', 'lead', v_id::text, jsonb_build_object('category', p_category, 'source', p_source));
  return jsonb_build_object('status', 'new', 'id', v_id);
end $$;

-- Store a verification + analysis result (evidence and explainable score reasons).
create or replace function record_lead_verification(
  p_id uuid, p_status verification_status, p_score numeric, p_audit jsonb, p_evidence jsonb, p_reasons jsonb
) returns void
language plpgsql security definer set search_path = public as $$
begin
  update leads set
    verification_status = p_status,
    verified_at = now(),
    verify_attempts = verify_attempts + 1,
    score = coalesce(p_score, score),
    audit = coalesce(p_audit, audit),
    evidence = p_evidence,
    score_reasons = p_reasons,
    status = case when p_status in ('appears_inactive', 'disqualified') then 'disqualified'::lead_status else status end
  where id = p_id;
  insert into activities (lead_id, actor, type, data)
  values (p_id, 'lead-agent', 'verification', jsonb_build_object('status', p_status, 'score', p_score));
end $$;

-- Mark the N best verified opportunities of the day as qualified (status 'qualified').
-- Only discovered companies that were never contacted and are verified active.
create or replace function select_daily_opportunities(p_limit int default 5, p_min_score numeric default 40)
returns setof leads
language plpgsql security definer set search_path = public as $$
declare r leads;
begin
  for r in
    select * from leads
    where source = 'discovery' and status = 'new' and verification_status = 'verified_active'
      and qualified_at is null and score >= p_min_score
      and (domain is null or not exists (select 1 from suppression_list s where s.domain = leads.domain))
    order by score desc, created_at
    limit p_limit
    for update skip locked
  loop
    update leads set status = 'qualified', qualified_at = now() where id = r.id returning * into r;
    insert into events (type, source_agent, subject_type, subject_id, payload)
    values ('opportunity.qualified', 'lead-agent', 'lead', r.id::text, jsonb_build_object('score', r.score, 'reasons', r.score_reasons));
    return next r;
  end loop;
end $$;

revoke all on function upsert_discovered_business(text,text,text,text,text,text,text,text,text) from public, anon, authenticated;
revoke all on function record_lead_verification(uuid,verification_status,numeric,jsonb,jsonb,jsonb) from public, anon, authenticated;
revoke all on function select_daily_opportunities(int,numeric) from public, anon, authenticated;
grant execute on function upsert_discovered_business(text,text,text,text,text,text,text,text,text) to service_role;
grant execute on function record_lead_verification(uuid,verification_status,numeric,jsonb,jsonb,jsonb) to service_role;
grant execute on function select_daily_opportunities(int,numeric) to service_role;
