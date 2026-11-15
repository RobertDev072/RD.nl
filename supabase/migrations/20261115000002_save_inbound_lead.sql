-- Atomic inbound-lead save: consent + lead + activity + event in ONE transaction.
-- Either everything is stored or nothing is (no orphan consents, no half-written leads).
-- Also re-checks the suppression list inside the transaction.

create or replace function save_inbound_lead(
  p_domain        text,
  p_website       text,
  p_business_name text,
  p_contact_name  text,
  p_email         text,
  p_phone         text,
  p_audit         jsonb,
  p_score         numeric,
  p_consent_text  text,
  p_channels      text[],
  p_ip_hash       text,
  p_user_agent    text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_consent_id uuid;
  v_lead_id    uuid;
  v_existing   record;
  v_repeat     boolean := false;
begin
  if p_domain is null or p_email is null or p_contact_name is null or p_consent_text is null then
    raise exception 'missing required fields';
  end if;

  -- Respect opt-outs: store nothing for suppressed domains or e-mail addresses.
  if exists (
    select 1 from suppression_list
    where domain = p_domain or (email is not null and lower(email) = lower(p_email))
  ) then
    return jsonb_build_object('status', 'suppressed');
  end if;

  insert into consents (purpose, consent_text, channel, ip_hash, user_agent)
  values ('website_check_followup', p_consent_text, p_channels, p_ip_hash, left(p_user_agent, 300))
  returning id into v_consent_id;

  select id, contact_email into v_existing from leads where domain = p_domain for update;

  if found then
    v_lead_id := v_existing.id;
    v_repeat := true;
    if v_existing.contact_email is null then
      update leads set audit = p_audit, score = p_score, contact_name = p_contact_name,
        contact_email = p_email, contact_phone = nullif(p_phone, ''), consent_id = v_consent_id
      where id = v_lead_id;
    else
      -- Never overwrite the first person's contact data.
      update leads set audit = p_audit, score = p_score where id = v_lead_id;
      insert into activities (lead_id, actor, type, data)
      values (v_lead_id, 'website', 'additional_contact_request',
        jsonb_build_object('consent_id', v_consent_id, 'name', p_contact_name, 'email', p_email, 'phone', nullif(p_phone, '')));
    end if;
  else
    insert into leads (source, status, domain, website, business_name, contact_name, contact_email,
                       contact_phone, consent_id, audit, score)
    values ('website_check', 'new', p_domain, p_website, nullif(p_business_name, ''), p_contact_name, p_email,
            nullif(p_phone, ''), v_consent_id, p_audit, p_score)
    returning id into v_lead_id;
  end if;

  update consents set lead_id = v_lead_id where id = v_consent_id;

  insert into activities (lead_id, actor, type, data)
  values (v_lead_id, 'website', 'website_check_request', jsonb_build_object('score', p_score));

  insert into events (type, source_agent, subject_type, subject_id, payload)
  values (case when v_repeat then 'lead.request_repeated' else 'lead.created' end, 'website', 'lead', v_lead_id::text,
          jsonb_build_object('source', 'website_check', 'score', p_score, 'domain', p_domain));

  return jsonb_build_object('status', case when v_repeat then 'updated' else 'created' end, 'lead_id', v_lead_id);
end $$;

revoke all on function save_inbound_lead(text, text, text, text, text, text, jsonb, numeric, text, text[], text, text)
  from public, anon, authenticated;
grant execute on function save_inbound_lead(text, text, text, text, text, text, jsonb, numeric, text, text[], text, text)
  to service_role;
