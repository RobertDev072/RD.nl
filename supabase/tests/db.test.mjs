// Database tests in an in-process Postgres (PGlite) with Supabase-like roles.
// Run: npx -y -p @electric-sql/pglite@0.3 node supabase/tests/db.test.mjs
// Database tests in an in-process Postgres (PGlite) with Supabase-like roles.
// Run: npx -y -p @electric-sql/pglite@0.3 node supabase/tests/db.test.mjs
import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
const db = new PGlite();
const sql = fs.readFileSync(new URL('../migrations/20261115000000_crm.sql', import.meta.url), 'utf8');
await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
  grant usage on schema public to anon, authenticated, service_role;
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant all on functions to anon, authenticated, service_role;`);
await db.exec(sql); await db.exec(fs.readFileSync(new URL('../migrations/20261115000001_os_core.sql', import.meta.url),'utf8'));
const t = async (name, q, expectFail) => {
  try { const r = await db.query(q); console.log(expectFail ? 'FAIL(should error)' : 'ok   ', name, r.rows?.[0] ? JSON.stringify(r.rows[0]) : ''); }
  catch (e) { console.log(expectFail ? 'ok   ' : 'FAIL ', name, '→', e.message.split('\n')[0]); }
};
await t('lead without contact', `insert into leads(source,domain) values('discovery','a.nl') returning id`);
await t('contact data without consent rejected', `insert into leads(source,domain,contact_email) values('website_check','b.nl','x@b.nl')`, true);
await t('consent + lead', `with c as (insert into consents(purpose,consent_text,channel) values('p','t','{email}') returning id) insert into leads(source,domain,contact_email,consent_id) select 'website_check','c.nl','x@c.nl',id from c returning domain`);
await t('duplicate domain rejected', `insert into leads(source,domain) values('discovery','a.nl')`, true);
await t('audit_log insert', `insert into audit_log(actor,action) values('robert','approve') returning id`);
await t('audit_log update blocked', `update audit_log set actor='x'`, true);
await t('audit_log delete blocked', `delete from audit_log`, true);
await t('audit_log truncate blocked', `truncate audit_log`, true);
await db.exec('set role service_role');
await t('service_role: audit insert', `insert into audit_log(actor,action) values('agent','x') returning id`);
await t('service_role: audit update denied', `update audit_log set actor='x'`, true);
await t('service_role: audit delete denied', `delete from audit_log`, true);
await t('service_role: consent delete denied', `delete from consents`, true);
for (let i = 1; i <= 4; i++) await t(`rate_limit_hit #${i} (max 3)`, `select rate_limit_hit('k',3,60) as limited`);
await db.exec('reset role; set role anon');
await t('anon: read leads denied', `select * from leads`, true);
await t('anon: rate_limit_hit denied', `select rate_limit_hit('k',3,60)`, true);
await db.exec('reset role; set role service_role');
await t('event append', `insert into events(type,source_agent,subject_type,subject_id,payload) values('lead.created','website','lead','1','{"a":1}') returning id`);
await t('event mark processed', `update events set processed_at=now(), processed_by='orchestrator' where id=1 returning processed_by`);
await t('event payload edit blocked', `update events set payload='{}' where id=1`, true);
await t('event delete denied', `delete from events`, true);
await t('event from unknown agent rejected', `insert into events(type,source_agent) values('x','ghost')`, true);
await t('approval request', `insert into approvals(requested_by,action,summary) values('website','outreach.send','test') returning status`);
await db.exec('reset role'); await db.exec(fs.readFileSync(new URL('../migrations/20261115000002_save_inbound_lead.sql', import.meta.url),'utf8'));
await db.exec('reset role; set role service_role');
const call = (d,e) => `select save_inbound_lead('${d}','https://${d}','Biz','Naam','${e}','','{}'::jsonb,50,'tekst','{email}',null,'ua') as r`;
await t('save new lead (atomic)', call('new.nl','a@new.nl'));
await t('save repeat keeps first contact', call('new.nl','b@new.nl'));
await t('first contact kept', `select contact_email from leads where domain='new.nl'`);
await t('event + activities written', `select (select count(*) from events where subject_type='lead') ev, (select count(*) from activities) act, (select count(*) from consents where lead_id is null) orphans`);
await db.exec('reset role'); await db.exec(`insert into suppression_list(domain,reason) values('optout.nl','test')`); await db.exec('set role service_role');
await t('suppressed domain stores nothing', call('optout.nl','x@optout.nl'));
await t('no row for suppressed', `select count(*) from leads where domain='optout.nl'`);
await db.exec('reset role; set role anon');
await t('anon cannot call save_inbound_lead', call('evil.nl','x@evil.nl'), true);
await db.exec('reset role'); await db.exec(fs.readFileSync(new URL('../migrations/20261115000003_contact_retention_rights.sql', import.meta.url),'utf8'));
await db.exec('set role service_role');
const cr = (e, m) => `select save_contact_request('Jan','${e}','','Bakkerij','https://bakker.nl','bakker.nl','{Website}','Graag offerte','notice','mkt',${m},null,'ua') r`;
await t('contact request (no marketing)', cr('jan@bakker.nl', false));
await t('contact request (with marketing)', cr('piet@bakker.nl', true));
await t('marketing consent separate', `select purpose, count(*) from consents where purpose in ('contact_request_reply','marketing_updates') group by purpose order by 1`);
await t('service_role cannot purge', `select purge_expired_data()`, true);
await t('service_role cannot gdpr_export', `select gdpr_export('jan@bakker.nl')`, true);
await db.exec('reset role');
await db.exec(`update leads set status='won' where contact_email='piet@bakker.nl'`);
await t('purge now: nothing removed', `select purge_expired_data() r`);
await t('purge in 13 months: old non-customers removed', `select purge_expired_data(now() + interval '13 months') r`);
await t('customer (won) kept', `select count(*) from leads where status='won'`);
await t('consent proofs kept (detached)', `select count(*) from consents where lead_id is null`);
await t('purge in 37 months: detached proofs removed', `select purge_expired_data(now() + interval '37 months') r`);
await t('gdpr_export', `select jsonb_array_length(gdpr_export('piet@bakker.nl')->'leads') n`);
await t('gdpr_withdraw_marketing', `select gdpr_withdraw_marketing('piet@bakker.nl') n`);
await t('gdpr_erase', `select gdpr_erase('piet@bakker.nl') r`);
await t('erased + suppressed', `select (select count(*) from leads where contact_email='piet@bakker.nl') leads, (select count(*) from suppression_list where email='piet@bakker.nl') supp`);
await t('retention logged in audit_log', `select count(*) from audit_log where actor='retention-job'`);
