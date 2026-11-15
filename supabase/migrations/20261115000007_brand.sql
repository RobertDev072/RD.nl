-- Branding extracted from the business's own public homepage, used only on its private concept page.
alter table leads add column if not exists brand jsonb;

create or replace function set_lead_brand(p_id uuid, p_brand jsonb) returns void
language sql security definer set search_path = public as $$
  update leads set brand = p_brand where id = p_id;
$$;
revoke all on function set_lead_brand(uuid, jsonb) from public, anon, authenticated;
grant execute on function set_lead_brand(uuid, jsonb) to service_role;

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
  return jsonb_build_object('name', r.business_name, 'category', r.category, 'city', r.city, 'address', r.address,
                            'website', r.website, 'domain', r.domain, 'findings', r.audit->'findings',
                            'site_score', r.audit->'score', 'brand', r.brand);
end $$;
