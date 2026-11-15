import { NextResponse } from 'next/server';
import { crmConfigured, hashIp, rest } from '@/lib/crm';
import { clientIp, rateLimited } from '@/lib/rate-limit';
import { CONCEPT_CONSENT_TEXT } from '@/lib/consent';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'dub1';

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i;

export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  if (await rateLimited(`concept:${ip || 'unknown'}`, 10, 60 * 60_000)) return NextResponse.json({ error: 'Te veel verzoeken.' }, { status: 429 });
  if (!crmConfigured()) return NextResponse.json({ error: 'Niet beschikbaar.' }, { status: 503 });
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: 'Ongeldig verzoek.' }, { status: 400 }); }
  const slug = String(b.slug || '');
  if (!/^[a-z0-9-]{3,120}$/.test(slug)) return NextResponse.json({ error: 'Onbekend ontwerp.' }, { status: 404 });
  if (typeof b.company_website === 'string' && b.company_website) return NextResponse.json({ ok: true });

  try {
    if (b.action === 'opt_out') {
      await rest('rpc/concept_opt_out', { method: 'POST', body: JSON.stringify({ p_slug: slug }) });
      return NextResponse.json({ ok: true });
    }
    const name = String(b.name || '').trim().slice(0, 100), email = String(b.email || '').trim().slice(0, 200);
    const phone = String(b.phone || '').trim().slice(0, 30);
    if (!name) return NextResponse.json({ error: 'Vul uw naam in.' }, { status: 400 });
    if (!EMAIL.test(email)) return NextResponse.json({ error: 'Vul een geldig e-mailadres in.' }, { status: 400 });
    const r = await rest<{ status: string }>('rpc/concept_request_contact', {
      method: 'POST',
      body: JSON.stringify({ p_slug: slug, p_name: name, p_email: email, p_phone: phone, p_consent_text: CONCEPT_CONSENT_TEXT,
        p_ip_hash: hashIp(ip), p_user_agent: req.headers.get('user-agent') || '' })
    });
    if (r.status !== 'ok') return NextResponse.json({ error: 'Onbekend ontwerp.' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('concept action failed', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'Er ging iets mis. Mail gerust naar rb085@icloud.com.' }, { status: 500 });
  }
}
