-- 1) Contact form requests  2) separate marketing consent  3) retention  4) GDPR rights helpers.

-- Contact requests: the message and the requested service are stored on the lead.
alter table leads add column if not exists message text;

-- Consent proofs must outlive a deleted lead (retention: +24 months), so detach instead of cascade.
alter table consents drop constraint if exists consents_lead_id_fkey;
alter table consents add constraint consents_lead_id_fkey foreign key (lead_id) references leads(id) on delete set null;

-- Save a contact-form request atomically.
-- Legal basis for replying = the person's own request (art. 6(1)(b) AVG); recorded as purpose
-- 'contact_request_reply'. Marketing is a SEPARATE, optional consent ('marketing_updates').
create or replace function save_contact_request(
  p_name text, p_email text, p_phone text, p_company text, p_website text, p_domain text,
  p_services text[], p_message text, p_notice_text text, p_marketing_text text,
  p_marketing boolean, p_ip_hash text, p_user_agent text
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_basis uuid; v_lead uuid;
begin
  if p_name is null or p_email is null or p_message is null or p_notice_text is null then
    raise exception 'missing required fields';
  end if;
  -- A contact request is always answered (the person asked for it); the suppression list only
  -- blocks unsolicited contact, so it is not checked here.
  insert into consents (purpose, consent_text, channel, ip_hash, user_agent)
  values ('contact_request_reply', p_notice_text,
          case when nullif(p_phone, '') is null then '{email}'::text[] else '{email,phone,whatsapp}'::text[] end,
          p_ip_hash, left(p_user_agent, 300))
  returning id into v_basis;

  insert into leads (source, status, business_name, website, domain, contact_name, contact_email, contact_phone,
                     consent_id, services_interest, message)
  values ('contact_form', 'new', nullif(p_company, ''), nullif(p_website, ''),
          -- domain stays unique per lead; a second request from the same domain keeps its own row
          case when nullif(p_domain, '') is not null and not exists (select 1 from leads where domain = p_domain)
               then p_domain end,
          p_name, p_email, nullif(p_phone, ''), v_basis, coalesce(p_services, '{}'), left(p_message, 4000))
  returning id into v_lead;

  update consents set lead_id = v_lead where id = v_basis;

  if p_marketing then
    insert into consents (lead_id, purpose, consent_text, channel, ip_hash, user_agent)
    values (v_lead, 'marketing_updates', p_marketing_text, '{email}', p_ip_hash, left(p_user_agent, 300));
  end if;

  insert into activities (lead_id, actor, type, data)
  values (v_lead, 'website', 'contact_request', jsonb_build_object('services', p_services, 'marketing', p_marketing));
  insert into events (type, source_agent, subject_type, subject_id, payload)
  values ('lead.created', 'website', 'lead', v_lead::text,
          jsonb_build_object('source', 'contact_form', 'services', p_services));
  return jsonb_build_object('status', 'created', 'lead_id', v_lead);
end $$;
revoke all on function save_contact_request(text,text,text,text,text,text,text[],text,text,text,boolean,text,text) from public, anon, authenticated;
grant execute on function save_contact_request(text,text,text,text,text,text,text[],text,text,text,boolean,text,text) to service_role;

-- Retention (matches /privacy):
--  * leads that never became a customer (not won/proposal): deleted 12 months after last update,
--    together with their activities and events;
--  * consent proofs: kept 24 months after the lead is gone (or after withdrawal), then deleted;
--  * rate-limit keys: 1 day. Invoices are not stored in this database.
create or replace function purge_expired_data(p_now timestamptz default now())
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ids uuid[]; v_leads int; v_consents int; v_events int;
begin
  select coalesce(array_agg(id), '{}') into v_ids from leads
  where status not in ('won', 'proposal') and updated_at < p_now - interval '12 months';

  delete from events where subject_type = 'lead' and subject_id = any (select unnest(v_ids)::text);
  get diagnostics v_events = row_count;
  delete from activities where lead_id = any (v_ids);
  delete from leads where id = any (v_ids); -- consents are detached (lead_id set null), kept as proof
  get diagnostics v_leads = row_count;

  delete from consents
  where (lead_id is null and created_at < p_now - interval '36 months')
     or (withdrawn_at is not null and withdrawn_at < p_now - interval '24 months');
  get diagnostics v_consents = row_count;

  delete from rate_limits where window_start < p_now - interval '1 day';

  insert into audit_log (actor, action, data)
  values ('retention-job', 'purge_expired_data', jsonb_build_object('leads', v_leads, 'events', v_events, 'consents', v_consents));
  return jsonb_build_object('leads', v_leads, 'events', v_events, 'consents', v_consents);
end $$;
revoke all on function purge_expired_data(timestamptz) from public, anon, authenticated, service_role;

-- GDPR rights (run by Robert in the Supabase SQL editor after verifying the requester by e-mail).
-- Access: everything stored about an e-mail address.
create or replace function gdpr_export(p_email text) returns jsonb
language sql security definer set search_path = public as $$
  select jsonb_build_object(
    'leads', coalesce((select jsonb_agg(to_jsonb(l) - 'audit') from leads l where lower(contact_email) = lower(p_email)), '[]'),
    'consents', coalesce((select jsonb_agg(to_jsonb(c)) from consents c
                          join leads l on l.id = c.lead_id where lower(l.contact_email) = lower(p_email)), '[]'),
    'mentioned_in_activities', coalesce((select jsonb_agg(to_jsonb(a)) from activities a where lower(a.data->>'email') = lower(p_email)), '[]')
  );
$$;
revoke all on function gdpr_export(text) from public, anon, authenticated, service_role;

-- Erasure + objection: removes the person's data and adds them to the suppression list so they
-- are never contacted again (the suppression entry itself is the minimum needed to honour that).
create or replace function gdpr_erase(p_email text, p_reason text default 'verzoek betrokkene')
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ids uuid[]; v_consents uuid[]; v_n int;
begin
  select coalesce(array_agg(id), '{}') into v_ids from leads where lower(contact_email) = lower(p_email);
  delete from events where subject_type = 'lead' and subject_id = any (select unnest(v_ids)::text);
  delete from activities where lead_id = any (v_ids) or lower(data->>'email') = lower(p_email);
  select coalesce(array_agg(id), '{}') into v_consents from consents where lead_id = any (v_ids);
  delete from leads where id = any (v_ids);
  get diagnostics v_n = row_count;
  delete from consents where id = any (v_consents);
  insert into suppression_list (email, reason) values (lower(p_email), p_reason);
  insert into audit_log (actor, action, data) values ('robert', 'gdpr_erase', jsonb_build_object('leads_deleted', v_n));
  return jsonb_build_object('leads_deleted', v_n, 'suppressed', true);
end $$;
revoke all on function gdpr_erase(text, text) from public, anon, authenticated, service_role;

-- Withdraw marketing consent only (keeps the lead, stops marketing).
create or replace function gdpr_withdraw_marketing(p_email text) returns int
language sql security definer set search_path = public as $$
  with u as (
    update consents c set withdrawn_at = now()
    from leads l where l.id = c.lead_id and lower(l.contact_email) = lower(p_email)
      and c.purpose = 'marketing_updates' and c.withdrawn_at is null
    returning 1)
  select count(*)::int from u;
$$;
revoke all on function gdpr_withdraw_marketing(text) from public, anon, authenticated, service_role;
