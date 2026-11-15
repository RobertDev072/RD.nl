import 'server-only';
import { createHash } from 'node:crypto';

// Minimal server-side client for the Supabase REST API (PostgREST). No SDK dependency.
// Uses the service role key, which must only ever exist as a server env var
// (SUPABASE_URL, SUPABASE_SECRET_KEY) — never NEXT_PUBLIC_*.

const URL_ = process.env.SUPABASE_URL?.replace(/\/$/, '');
// New-format secret key (sb_secret_…) preferred; legacy service_role JWT still accepted.
// Preview/development use the separate TEST project key; production never reads it.
const isProd = process.env.VERCEL_ENV === 'production';
const KEY = (!isProd && process.env.SUPABASE_SECRET_KEY_TEST) || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
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
  const text = await res.text(); // return=minimal / 204 responses have an empty body
  return (text ? JSON.parse(text) : undefined) as T;
}

export function hashIp(ip: string | null): string | null {
  const salt = process.env.IP_HASH_SALT;
  if (!ip || !salt || salt.length < 16) return null; // no weak default: without a proper salt we store nothing
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
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

// Saves an inbound lead atomically (consent + lead + activity + event in one database
// transaction, see save_inbound_lead()). The suppression list is re-checked inside it.
export async function saveInboundLead(l: InboundLead): Promise<{ status: 'created' | 'updated' | 'suppressed'; lead_id?: string }> {
  return rest('rpc/save_inbound_lead', {
    method: 'POST',
    body: JSON.stringify({
      p_domain: l.domain,
      p_website: l.website,
      p_business_name: l.businessName || '',
      p_contact_name: l.contactName,
      p_email: l.email,
      p_phone: l.phone || '',
      p_audit: l.audit,
      p_score: l.score,
      p_consent_text: l.consentText,
      p_channels: l.channels,
      p_ip_hash: hashIp(l.ip),
      p_user_agent: l.userAgent || ''
    })
  });
}

export type ContactRequest = {
  name: string; email: string; phone?: string; company?: string; website?: string; domain?: string;
  services: string[]; message: string; noticeText: string; marketingText: string; marketing: boolean;
  ip: string | null; userAgent: string | null;
};

// Saves a contact-form request atomically (see save_contact_request()).
export async function saveContactRequest(c: ContactRequest): Promise<{ status: 'created'; lead_id: string }> {
  return rest('rpc/save_contact_request', {
    method: 'POST',
    body: JSON.stringify({
      p_name: c.name, p_email: c.email, p_phone: c.phone || '', p_company: c.company || '',
      p_website: c.website || '', p_domain: c.domain || '', p_services: c.services, p_message: c.message,
      p_notice_text: c.noticeText, p_marketing_text: c.marketingText, p_marketing: c.marketing,
      p_ip_hash: hashIp(c.ip), p_user_agent: c.userAgent || ''
    })
  });
}
