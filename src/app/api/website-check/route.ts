import { NextResponse } from 'next/server';
import { checkWebsite, CheckError } from '@/lib/website-check';
import { clientIp, rateLimited } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;
// GDPR: process requests in the EU (Frankfurt), close to the Supabase EU database.
export const preferredRegion = 'fra1';

export async function POST(req: Request) {
  const ip = clientIp(req.headers) || 'unknown';
  if (await rateLimited(`check:${ip}`, 8, 10 * 60_000)) {
    return NextResponse.json({ error: 'Je hebt veel checks gedaan. Probeer het over een paar minuten opnieuw.' }, { status: 429 });
  }
  let body: { url?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Ongeldig verzoek.' }, { status: 400 }); }
  if (typeof body.url !== 'string') return NextResponse.json({ error: 'Vul een webadres in.' }, { status: 400 });
  try {
    return NextResponse.json(await checkWebsite(body.url));
  } catch (e) {
    if (e instanceof CheckError) return NextResponse.json({ error: e.message, code: e.code }, { status: 422 });
    return NextResponse.json({ error: 'Er ging iets mis bij het controleren. Probeer het later opnieuw.' }, { status: 500 });
  }
}
