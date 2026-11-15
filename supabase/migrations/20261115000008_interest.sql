-- Robert marks the outcome of a call/letter: interested → responded; not interested → lost + never contact again.
create or replace function admin_update_lead(p_id uuid, p_action text, p_note text default null) returns void
language plpgsql security definer set search_path = public as $$
declare v_domain text;
begin
  if p_action = 'letter_delivered' then
    update leads set letter_delivered_at = now(), status = case when status = 'qualified' then 'contacted' else status end where id = p_id;
  elsif p_action = 'interested' then
    update leads set status = 'responded' where id = p_id;
  elsif p_action = 'not_interested' then
    update leads set status = 'lost', business_phone = null where id = p_id returning domain into v_domain;
    if v_domain is not null then
      insert into suppression_list (domain, reason) select v_domain, 'geen interesse (gemarkeerd door Robert)'
      where not exists (select 1 from suppression_list where domain = v_domain);
    end if;
  elsif p_action in ('contacted', 'proposal', 'won', 'lost') then
    update leads set status = p_action::lead_status where id = p_id;
  elsif p_action <> 'note' then
    raise exception 'unknown action';
  end if;
  insert into activities (lead_id, actor, type, data) values (p_id, 'robert', p_action, jsonb_build_object('note', p_note));
  insert into audit_log (actor, action, target, data) values ('robert', 'lead.' || p_action, p_id::text, jsonb_build_object('note', p_note));
end $$;
