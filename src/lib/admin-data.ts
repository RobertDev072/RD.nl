import 'server-only';
import { rest } from './crm';

export type Lead = {
  id: string; created_at: string; source: string; status: string; business_name: string | null; website: string | null;
  domain: string | null; category: string | null; city: string | null; address: string | null; postcode: string | null;
  legal_form: string | null; business_phone: string | null; contact_name: string | null; contact_email: string | null;
  contact_phone: string | null; message: string | null; services_interest: string[]; score: number | null;
  score_reasons: string[] | null; audit: { score?: number; findings?: { id: string; ok: boolean; title: string; detail: string; weight: number }[] } | null;
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
  rest<Lead[]>(`leads?select=${cols}&business_phone=not.is.null&verification_status=eq.verified_active&status=in.(new,qualified,contacted)&order=score.desc.nullslast&limit=50`);
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

export type LeadDetail = Lead & {
  audit: (Lead['audit'] & { finalUrl?: string; loadMs?: number; pageKb?: number; platform?: string;
    findings?: { id: string; ok: boolean; title: string; detail: string; weight: number }[] }) | null;
  business_email: string | null;
  evidence: Record<string, unknown> | null; verified_at: string | null; brand: { logo?: string | null; images?: string[]; colors?: string[] } | null;
};

/** Today's ranking: every verified, still-open opportunity, best first. */
export const getRanking = () =>
  rest<Lead[]>(`leads?select=${cols}&source=eq.discovery&verification_status=eq.verified_active&status=in.(new,qualified,contacted)&order=score.desc.nullslast&limit=200`);

export async function getLead(id: string) {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  const r = await rest<LeadDetail[]>(`leads?select=${cols},business_email,evidence,verified_at,brand&id=eq.${id}`);
  return r[0] ?? null;
}

export const getActivities = (id: string) =>
  rest<{ created_at: string; actor: string; type: string; data: { note?: string } | null }[]>(
    `activities?select=created_at,actor,type,data&lead_id=eq.${id}&order=created_at.desc&limit=30`);

/** Text for a phone call or a letter. Built only from what the analysis actually found. */
export function pitchMessage(l: LeadDetail) {
  const problems = (l.audit?.findings ?? []).filter((f) => !f.ok).sort((a, b) => b.weight - a.weight).slice(0, 4);
  const lines = problems.map((f) => `• ${f.title}: ${f.detail}`).join('\n');
  return `Goedendag, mijn naam is Robert van Lorvex, een webbureau uit Alkmaar.

Ik heb de website van ${l.business_name}${l.domain ? ` (${l.domain})` : ''} bekeken en zag een paar dingen waardoor u klanten kunt mislopen:
${lines || '• De website kan moderner en sneller, vooral op de telefoon.'}

Ik heb een gratis voorbeeld gemaakt van hoe uw website eruit kan zien: modern, snel en met uw eigen logo, foto’s en teksten. Heeft u interesse om het te bekijken? Het is helemaal vrijblijvend.

Met vriendelijke groet,
Robert Rocha – Lorvex
lorvex.nl · 06 41227451`;
}

/** Mail to send yourself AFTER a phone call in which the business showed interest (not a cold mail). */
export function followUpMail(l: LeadDetail) {
  const subject = `Voorbeeld nieuwe website ${l.business_name ?? ''}`.trim();
  const body = `Beste ${l.business_name ?? ''},

Bedankt voor het prettige telefoongesprek van vandaag. Zoals beloofd stuur ik u het gratis voorbeeld van een nieuwe website, gemaakt met uw eigen logo, foto’s en teksten:
${l.slug ? `https://lorvex.nl/voor/${l.slug}` : '[link naar voorbeeld]'}

Het is helemaal vrijblijvend. Laat gerust weten wat u ervan vindt, dan bespreken we graag de mogelijkheden.

Met vriendelijke groet,
Robert Rocha – Lorvex
lorvex.nl · 06 41227451`;
  return { subject, body };
}
