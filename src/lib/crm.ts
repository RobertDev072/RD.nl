import 'server-only';
import { createHash } from 'node:crypto';

// Minimal server-side client for the Supabase REST API (PostgREST). No SDK dependency.
// Uses the service role key, which must only ever exist as a server env var
// (SUPABASE_URL, SUPABASE_SECRET_KEY) — never NEXT_PUBLIC_*.

const URL_ = process.env.SUPABASE_URL?.replace(/\/$/, '');
// New-format secret key (sb_secret_…) preferred; legacy service_role JWT still accepted.
const KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
// sb_ keys are not JWTs: send them on the apikey header only (Supabase rejects them as Bearer).
const authHeaders = (): Record<string, string> =>
  KEY && KEY.startsWith('sb_') ? { apikey: KEY } : { apikey: KEY || '', authorization: `Bearer ${KEY}` };

export const crmConfigured = () => Boolean(URL_ && KEY);

async function rest<T>(path: string, init: RequestInit & { prefer?: string } = {}): Promise<T> {
  if (!URL_ || !KEY) throw new Error('CRM not configured');
  const res = await fetch(`${URL_}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...authHeaders(),
      'content-type': 'application/json',
      prefer: init.prefer ?? 'return=representation',
      ...(init.headers || {})
    },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error(`CRM ${init.method || 'GET'} ${path.split('?')[0]} failed: ${res.status}`);
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

export function hashIp(ip: string | null): string | null {
  const salt = process.env.IP_HASH_SALT;
  if (!ip || !salt || salt.length < 16) return null; // no weak default: without a proper salt we store nothing
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

export async function isSuppressed(domain: string, email?: string) {
  const ors = [`domain.eq.${encodeURIComponent(domain)}`];
  if (email) ors.push(`email.ilike.${encodeURIComponent(email)}`);
  const rows = await rest<unknown[]>(`suppression_list?select=id&or=(${ors.join(',')})&limit=1`);
  return rows.length > 0;
}

export type InboundLead = {
  domain: string;
  website: string;
  businessName?: string;
  contactName: string;
  email: string;
  phone?: string;
  audit: unknown;
  score: number;
  consentText: string;
  channels: string[];
  ip: string | null;
  userAgent: string | null;
};

// Inserts (or updates, per domain) an inbound lead together with its proof of consent.
export async function saveInboundLead(l: InboundLead): Promise<{ id: string }> {
  const [consent] = await rest<{ id: string }[]>('consents', {
    method: 'POST',
    body: JSON.stringify({
      purpose: 'website_check_followup',
      consent_text: l.consentText,
      channel: l.channels,
      ip_hash: hashIp(l.ip),
      user_agent: l.userAgent?.slice(0, 300) ?? null
    })
  });

  // One lead per domain. A second request for the same domain never overwrites the
  // first person's contact data: it is recorded as an activity linked to its own consent.
  const existing = await rest<{ id: string; contact_email: string | null }[]>(
    `leads?select=id,contact_email&domain=eq.${encodeURIComponent(l.domain)}&limit=1`
  );
  let lead: { id: string };
  if (existing.length) {
    lead = existing[0];
    await rest(`leads?id=eq.${lead.id}`, {
      method: 'PATCH',
      prefer: 'return=minimal',
      body: JSON.stringify(
        existing[0].contact_email
          ? { audit: l.audit, score: l.score }
          : { audit: l.audit, score: l.score, contact_name: l.contactName, contact_email: l.email, contact_phone: l.phone || null, consent_id: consent.id }
      )
    });
    if (existing[0].contact_email) {
      await rest('activities', {
        method: 'POST',
        prefer: 'return=minimal',
        body: JSON.stringify({ lead_id: lead.id, actor: 'website', type: 'additional_contact_request', data: { consent_id: consent.id, name: l.contactName, email: l.email, phone: l.phone || null } })
      });
    }
  } else {
    [lead] = await rest<{ id: string }[]>('leads', {
      method: 'POST',
      body: JSON.stringify({
        source: 'website_check',
        status: 'new',
        domain: l.domain,
        website: l.website,
        business_name: l.businessName || null,
        contact_name: l.contactName,
        contact_email: l.email,
        contact_phone: l.phone || null,
        consent_id: consent.id,
        audit: l.audit,
        score: l.score
      })
    });
  }

  // Publish on the AI OS event bus so future agents (orchestrator, concept, sales) can react.
  await rest('events', {
    method: 'POST',
    prefer: 'return=minimal',
    body: JSON.stringify({
      type: existing.length ? 'lead.request_repeated' : 'lead.created',
      source_agent: 'website',
      subject_type: 'lead',
      subject_id: lead.id,
      payload: { source: 'website_check', score: l.score, domain: l.domain }
    })
  });

  await rest(`consents?id=eq.${consent.id}`, { method: 'PATCH', prefer: 'return=minimal', body: JSON.stringify({ lead_id: lead.id }) });
  await rest('activities', {
    method: 'POST',
    prefer: 'return=minimal',
    body: JSON.stringify({ lead_id: lead.id, actor: 'website', type: 'website_check_request', data: { score: l.score } })
  });
  return lead;
}
