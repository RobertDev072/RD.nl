import { NextResponse } from 'next/server';
import { crmConfigured, saveContactRequest } from '@/lib/crm';
import { clientIp, rateLimited } from '@/lib/rate-limit';
import { CONTACT_NOTICE_TEXT, MARKETING_CONSENT_TEXT } from '@/lib/consent';
import { services } from '@/lib/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'dub1';

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i;
const SERVICE_TITLES = new Set(services.map((s) => s.title));

export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  if (await rateLimited(`contact:${ip || 'unknown'}`, 5, 60 * 60_000)) {
    return NextResponse.json({ error: 'Te veel aanvragen. Probeer het later opnieuw of app Robert.' }, { status: 429 });
  }
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: 'Ongeldig verzoek.' }, { status: 400 }); }
  if (typeof b.company_website === 'string' && b.company_website) return NextResponse.json({ ok: true }); // honeypot

  const str = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);
  const name = str(b.name, 100), email = str(b.email, 200), phone = str(b.phone, 30);
  const company = str(b.company, 120), message = str(b.message, 4000);
  let website = str(b.website, 200), domain = '';
  if (website) {
    try {
      const u = new URL(/^https?:\/\//i.test(website) ? website : `https://${website}`);
      website = u.href; domain = u.hostname.replace(/^www\./, '').toLowerCase();
    } catch { website = ''; }
  }
  const picked = Array.isArray(b.services) ? b.services.filter((s): s is string => typeof s === 'string' && SERVICE_TITLES.has(s)) : [];

  if (!name) return NextResponse.json({ error: 'Vul je naam in.' }, { status: 400 });
  if (!EMAIL.test(email)) return NextResponse.json({ error: 'Vul een geldig e-mailadres in.' }, { status: 400 });
  if (!message) return NextResponse.json({ error: 'Vul je vraag in.' }, { status: 400 });
  if (!crmConfigured()) return NextResponse.json({ error: 'Versturen lukt nu niet. App of bel Robert gerust.' }, { status: 503 });

  try {
    await saveContactRequest({
      name, email, phone, company, website, domain, services: picked, message,
      noticeText: CONTACT_NOTICE_TEXT, marketingText: MARKETING_CONSENT_TEXT, marketing: b.marketing === true,
      ip, userAgent: req.headers.get('user-agent')
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('contact request failed', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'Versturen lukte niet. App of bel Robert gerust.' }, { status: 500 });
  }
}
