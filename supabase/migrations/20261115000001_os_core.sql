-- LORVEX AI OS — core (module-agnostic). The CRM is the first module built on top of it.
-- Future agents (orchestrator, lead, SEO, concept, sales, QA, …) plug in here without
-- changing CRM tables: each agent is registered with its own permissions, communicates via
-- events, and asks for human approval for anything outside its automatic permissions.

-- Registry of agents and what each one may do on its own.
create table agents (
  id           text primary key,                 -- 'website', 'lead-agent', 'seo-agent', 'orchestrator' …
  name         text not null,
  module       text not null,                    -- 'crm', 'seo', 'marketing', 'delivery' …
  enabled      boolean not null default false,   -- off until Robert enables it
  -- actions this agent may perform WITHOUT approval, e.g. {'lead.create','audit.run'}
  auto_permissions     text[] not null default '{}',
  -- actions that always need Robert's approval, e.g. {'outreach.send','deploy.production'}
  approval_permissions text[] not null default '{}',
  created_at   timestamptz not null default now()
);

insert into agents (id, name, module, enabled, auto_permissions, approval_permissions) values
  ('website', 'Website (inbound forms)', 'crm', true, '{lead.create,consent.create,audit.run}', '{}'),
  ('robert',  'Robert (human owner)',    'core', true, '{*}', '{}');

-- Event bus / outbox. Producers append, consumers (agents, notifications, dashboard) read
-- and mark processed. Append-only for payload; only processing columns may change.
create table events (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  type          text not null,                   -- 'lead.created', 'website_check.completed', 'approval.granted' …
  source_agent  text not null references agents(id),
  subject_type  text,                            -- 'lead', 'concept', 'article' …
  subject_id    text,
  payload       jsonb not null default '{}',
  processed_at  timestamptz,
  processed_by  text,
  error         text
);
create index events_unprocessed_idx on events (type, created_at) where processed_at is null;
create index events_subject_idx on events (subject_type, subject_id);

create or replace function events_protect_payload() returns trigger language plpgsql set search_path = '' as $$
begin
  if new.type is distinct from old.type or new.payload is distinct from old.payload
     or new.source_agent is distinct from old.source_agent or new.created_at is distinct from old.created_at
     or new.subject_type is distinct from old.subject_type or new.subject_id is distinct from old.subject_id then
    raise exception 'events are immutable (only processing fields may change)';
  end if;
  return new;
end $$;
create trigger events_immutable before update on events for each row execute function events_protect_payload();

-- Human-in-the-loop: anything an agent may not do on its own becomes an approval request.
create type approval_status as enum ('pending', 'approved', 'rejected', 'expired');
create table approvals (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  requested_by  text not null references agents(id),
  action        text not null,                   -- 'outreach.send', 'deploy.production', 'spend' …
  subject_type  text,
  subject_id    text,
  summary       text not null,                   -- what Robert sees
  payload       jsonb not null default '{}',     -- exactly what will be executed
  cost_eur      numeric,                         -- any spend must be visible up front
  status        approval_status not null default 'pending',
  decided_at    timestamptz,
  decided_by    text,
  expires_at    timestamptz
);
create index approvals_pending_idx on approvals (status, created_at) where status = 'pending';

alter table agents enable row level security;
alter table events enable row level security;
alter table approvals enable row level security;
revoke all on agents, events, approvals from anon, authenticated;
revoke delete, truncate on events, approvals from service_role;
