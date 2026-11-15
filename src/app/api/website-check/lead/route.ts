import { NextResponse } from 'next/server';
import { checkWebsite, CheckError, normaliseUrl } from '@/lib/website-check';
import { crmConfigured, isSuppressed, saveInboundLead } from '@/lib/crm';
import { clientIp, rateLimited } from '@/lib/rate-limit';
import { CONSENT_TEXT } from '@/lib/consent';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i;

export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  if (await rateLimited(`lead:${ip || 'unknown'}`, 5, 60 * 60_000)) {
    return NextResponse.json({ error: 'Te veel aanvragen. Probeer het later opnieuw.' }, { status: 429 });
  }
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: 'Ongeldig verzoek.' }, { status: 400 }); }

  // Honeypot: real visitors never fill this hidden field.
  if (typeof b.company_website === 'string' && b.company_website) return NextResponse.json({ ok: true });

  const name = String(b.name || '').trim().slice(0, 100);
  const email = String(b.email || '').trim().slice(0, 200);
  const phone = String(b.phone || '').trim().slice(0, 30);
  const business = String(b.business || '').trim().slice(0, 120);
  if (!name) return NextResponse.json({ error: 'Vul je naam in.' }, { status: 400 });
  if (!EMAIL.test(email)) return NextResponse.json({ error: 'Vul een geldig e-mailadres in.' }, { status: 400 });
  if (b.consent !== true) return NextResponse.json({ error: 'Geef toestemming om contact met je op te nemen.' }, { status: 400 });
  if (typeof b.url !== 'string') return NextResponse.json({ error: 'Vul een webadres in.' }, { status: 400 });

  if (!crmConfigured()) {
    return NextResponse.json({ error: 'Aanvragen zijn tijdelijk niet beschikbaar. App of bel Robert gerust.' }, { status: 503 });
  }

  try {
    const url = normaliseUrl(b.url);
    const result = await checkWebsite(url.href);
    if (await isSuppressed(result.domain, email)) return NextResponse.json({ ok: true }); // respect earlier opt-out silently
    await saveInboundLead({
      domain: result.domain,
      website: result.finalUrl,
      businessName: business,
      contactName: name,
      email,
      phone,
      audit: result,
      score: result.score,
      consentText: CONSENT_TEXT,
      channels: phone ? ['email', 'phone', 'whatsapp'] : ['email'],
      ip,
      userAgent: req.headers.get('user-agent')
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof CheckError) return NextResponse.json({ error: e.message }, { status: 422 });
    console.error('website-check lead failed', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'Opslaan lukte niet. App of bel Robert gerust.' }, { status: 500 });
  }
}
