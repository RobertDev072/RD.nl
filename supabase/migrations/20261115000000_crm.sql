-- Lorvex CRM — initial schema.
-- Principles: only business data, explicit consent for any personal contact data,
-- suppression list for opt-outs, append-only audit log. RLS on: no anonymous access;
-- the website writes through server-side API routes using the service role key only.


-- Pipeline stages, in order.
create type lead_status as enum (
  'new',          -- discovered or submitted, not yet reviewed
  'qualified',    -- reviewed, worth pursuing
  'concept',      -- personalised concept being made / ready
  'contacted',    -- letter sent, or reply sent after an inbound request
  'responded',    -- lead reacted (QR scan + request, reply, call)
  'proposal',     -- quote sent
  'won',
  'lost',
  'disqualified'
);

create type lead_source as enum ('website_check', 'contact_form', 'letter_qr', 'referral', 'discovery', 'manual');

create table leads (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  source           lead_source not null,
  status           lead_status not null default 'new',
  -- business data
  business_name    text,
  website          text,
  domain           text,
  category         text,                 -- e.g. kapper, schoonheidssalon, restaurant
  city             text,
  address          text,
  legal_form       text,                 -- eenmanszaak, vof, bv … (from KvK, when known)
  kvk_number       text,
  -- personal contact data: ONLY when the person gave it to us with consent
  contact_name     text,
  contact_email    text,
  contact_phone    text,
  consent_id       uuid,                 -- set when contact data came with consent
  -- qualification
  score            numeric,
  audit            jsonb,                -- latest website audit result
  services_interest text[] not null default '{}',
  notes            text,
  next_action_at   timestamptz,
  value_eur        numeric,
  constraint contact_requires_consent check (
    (contact_email is null and contact_phone is null and contact_name is null) or consent_id is not null
  )
);
create unique index leads_domain_unique on leads (domain) where domain is not null;
create index leads_status_idx on leads (status);

-- Proof of consent (who, what, when, which text they agreed to).
create table consents (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  lead_id       uuid references leads(id) on delete cascade,
  purpose       text not null,           -- e.g. 'website_check_followup'
  consent_text  text not null,           -- exact wording shown to the person
  channel       text[] not null,         -- e.g. {email, phone, whatsapp}
  ip_hash       text,                    -- sha256 of IP + salt, never the raw IP
  user_agent    text,
  withdrawn_at  timestamptz
);
alter table leads add constraint leads_consent_fk foreign key (consent_id) references consents(id);

-- Never contact these again (opt-outs / objections). Checked before any outreach.
create table suppression_list (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  domain      text,
  email       text,
  phone       text,
  reason      text not null,
  constraint suppression_has_key check (domain is not null or email is not null or phone is not null)
);
create index suppression_domain_idx on suppression_list (domain);
create index suppression_email_idx on suppression_list (lower(email));

-- Everything that happens to a lead (by Robert or by an agent).
create table activities (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  lead_id     uuid not null references leads(id) on delete cascade,
  actor       text not null,             -- 'robert', 'website', 'lead-agent', 'sales-agent' …
  type        text not null,             -- 'created', 'status_change', 'note', 'letter_sent', 'qr_scan', 'message_sent' …
  data        jsonb not null default '{}'
);
create index activities_lead_idx on activities (lead_id, created_at desc);

-- Append-only log of agent actions and approvals.
create table audit_log (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  actor       text not null,
  action      text not null,
  target      text,
  approved_by text,                      -- null = automatic (only for allowed automatic actions)
  data        jsonb not null default '{}'
);

create or replace function touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger leads_touch before update on leads for each row execute function touch_updated_at();

create or replace function audit_log_no_change() returns trigger language plpgsql as $$
begin raise exception 'audit_log is append-only'; end $$;
create trigger audit_log_immutable before update or delete on audit_log for each row execute function audit_log_no_change();

-- Lock everything down: no policies = no access for anon/authenticated roles.
alter table leads enable row level security;
alter table consents enable row level security;
alter table suppression_list enable row level security;
alter table activities enable row level security;
alter table audit_log enable row level security;

-- ---------------------------------------------------------------------------
-- Hardening
-- ---------------------------------------------------------------------------

-- audit_log: also block TRUNCATE (row triggers do not fire on TRUNCATE), and remove
-- write privileges other than INSERT from every API role, including service_role.
create trigger audit_log_no_truncate before truncate on audit_log
  for each statement execute function audit_log_no_change();
revoke all on audit_log from anon, authenticated;
revoke update, delete, truncate on audit_log from service_role;
grant select, insert on audit_log to service_role;

-- consents are proof: they can be marked withdrawn, never edited or deleted via the API.
revoke all on consents from anon, authenticated;
revoke delete, truncate on consents from service_role;

revoke all on leads, activities, suppression_list from anon, authenticated;

-- Shared rate limiting across all serverless instances (fixed window, atomic).
create table rate_limits (
  key          text primary key,
  window_start timestamptz not null,
  hits         integer not null
);
alter table rate_limits enable row level security;
revoke all on rate_limits from anon, authenticated;

create or replace function rate_limit_hit(p_key text, p_max integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hits integer;
begin
  insert into rate_limits as r (key, window_start, hits)
  values (p_key, now(), 1)
  on conflict (key) do update set
    hits = case when r.window_start < now() - make_interval(secs => p_window_seconds) then 1 else r.hits + 1 end,
    window_start = case when r.window_start < now() - make_interval(secs => p_window_seconds) then now() else r.window_start end
  returning hits into v_hits;
  -- opportunistic cleanup of stale keys
  if random() < 0.01 then
    delete from rate_limits where window_start < now() - interval '1 day';
  end if;
  return v_hits > p_max; -- true = limited
end $$;
revoke all on function rate_limit_hit(text, integer, integer) from public, anon, authenticated;
grant execute on function rate_limit_hit(text, integer, integer) to service_role;
