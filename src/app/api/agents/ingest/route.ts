import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { rest } from '@/lib/crm';
import { ingestOsmElements, type OsmElement } from '@/lib/lead-engine';

// Ingest for a local discovery agent (LOR-004). Overpass refuses requests from Vercel, so a local
// machine fetches OpenStreetMap data and posts the raw Overpass elements here.
// Own token, insert only via upsert_discovered_business (dedup + suppression in the database),
// rate limited via the event log, every call logged. No outreach, no deletes.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MAX_ELEMENTS = 400;
const MAX_CALLS_PER_HOUR = 30;

function authorised(req: Request) {
  const want = process.env.AGENT_INGEST_TOKEN;
  const got = req.headers.get('authorization')?.replace(/^Bearer /, '') ?? '';
  if (!want || want.length < 24 || got.length !== want.length) return false;
  return timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

const log = (payload: Record<string, unknown>) =>
  rest('events', { method: 'POST', prefer: 'return=minimal', body: JSON.stringify({ type: 'lead_engine.ingest', source_agent: 'lead-agent', payload }) });

export async function POST(req: Request) {
  if (!authorised(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const since = new Date(Date.now() - 3_600_000).toISOString();
  const recent = await rest<{ count: number }[]>(`events?select=count&type=eq.lead_engine.ingest&created_at=gte.${since}`);
  if ((recent[0]?.count ?? 0) >= MAX_CALLS_PER_HOUR) {
    return NextResponse.json({ error: 'rate_limited', retry_after_s: 3600 }, { status: 429, headers: { 'retry-after': '3600' } });
  }

  let body: { elements?: unknown; label?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }); }
  if (!Array.isArray(body.elements)) return NextResponse.json({ error: 'elements_required' }, { status: 400 });
  if (body.elements.length > MAX_ELEMENTS) return NextResponse.json({ error: 'too_many_elements', max: MAX_ELEMENTS }, { status: 413 });

  const label = typeof body.label === 'string' ? body.label.slice(0, 80) : null;
  const stats = await ingestOsmElements(body.elements as OsmElement[], 'osm');
  await log({ label, received: body.elements.length, ...stats }).catch(() => undefined);
  return NextResponse.json({ ok: true, label, received: body.elements.length, ...stats });
}
