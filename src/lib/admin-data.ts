import 'server-only';
import { rest } from './crm';

export type Lead = {
  id: string; created_at: string; source: string; status: string; business_name: string | null; website: string | null;
  domain: string | null; category: string | null; city: string | null; address: string | null; postcode: string | null;
  legal_form: string | null; business_phone: string | null; contact_name: string | null; contact_email: string | null;
  contact_phone: string | null; message: string | null; services_interest: string[]; score: number | null;
  score_reasons: string[] | null; audit: { score?: number; findings?: { id: string; ok: boolean; title: string }[] } | null;
  slug: string | null; concept_views: number; letter_delivered_at: string | null; qualified_at: string | null;
  verification_status: string | null;
};

const cols = 'id,created_at,source,status,business_name,website,domain,category,city,address,postcode,legal_form,business_phone,' +
  'contact_name,contact_email,contact_phone,message,services_interest,score,score_reasons,audit,slug,concept_views,letter_delivered_at,qualified_at,verification_status';

export const getInbound = () =>
  rest<Lead[]>(`leads?select=${cols}&contact_email=not.is.null&status=not.in.(won,lost)&order=updated_at.desc&limit=100`);
export const getOpportunities = () =>
  rest<Lead[]>(`leads?select=${cols}&source=eq.discovery&status=in.(qualified,contacted)&order=qualified_at.desc&limit=100`);
export const getCallList = () =>
  rest<Lead[]>(`leads?select=${cols}&legal_form=eq.bv%2Fnv&business_phone=not.is.null&verification_status=eq.verified_active&status=in.(new,qualified,contacted)&order=score.desc.nullslast&limit=50`);
export const getLettersToDeliver = () =>
  rest<Lead[]>(`leads?select=${cols}&source=eq.discovery&status=eq.qualified&letter_delivered_at=is.null&order=postcode.asc.nullslast,address.asc&limit=60`);

export async function getStats() {
  const count = async (q: string) => {
    const r = await rest<{ count: number }[]>(`leads?select=count&${q}`);
    return r[0]?.count ?? 0;
  };
  const [discovered, verified, qualified, responded, won] = await Promise.all([
    count('source=eq.discovery'), count('verification_status=eq.verified_active'), count('qualified_at=not.is.null'),
    count('contact_email=not.is.null'), count('status=eq.won')
  ]);
  return { discovered, verified, qualified, responded, won };
}

export function waNumber(phone: string | null) {
  if (!phone) return null;
  let d = phone.replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('0')) d = '31' + d.slice(1);
  return d.length >= 10 ? d : null;
}

// WhatsApp reply ONLY for people who asked to be contacted (consent / own request).
export function whatsappReply(l: Lead) {
  const first = (l.contact_name || '').split(' ')[0] || 'daar';
  const about = l.source === 'contact_form'
    ? `je aanvraag via lorvex.nl${l.services_interest?.length ? ` over ${l.services_interest.join(', ').toLowerCase()}` : ''}`
    : l.slug ? `het voorbeeldontwerp voor ${l.business_name}` : `de website-check van ${l.domain ?? 'je website'}`;
  return `Hoi ${first}, met Robert van Lorvex. Bedankt voor ${about}! Ik heb er al naar gekeken en heb een paar concrete ideeën. ` +
    `Past het als ik je morgen even bel, of zal ik het hier uitleggen?`;
}
