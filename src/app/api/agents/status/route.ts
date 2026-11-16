import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { rest } from '@/lib/crm';

// Read-only status feed for the supervisor (Hermes). Own token, no personal data, no write access.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function authorised(req: Request) {
  const want = process.env.AGENT_STATUS_TOKEN;
  const got = req.headers.get('authorization')?.replace(/^Bearer /, '') ?? '';
  if (!want || want.length < 24 || got.length !== want.length) return false;
  return timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

type Ev = { created_at: string; type: string; source_agent: string | null; payload: Record<string, unknown> | null };

export async function GET(req: Request) {
  if (!authorised(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const count = async (q: string) => (await rest<{ count: number }[]>(`leads?select=count&${q}`))[0]?.count ?? 0;

  const [agents, events, discovered, active, uncertain, inactive, qualified, interested, lost, won, inboundOpen] = await Promise.all([
    rest<{ id: string; name: string; enabled: boolean }[]>('agents?select=id,name,enabled'),
    rest<Ev[]>(`events?select=created_at,type,source_agent,payload&type=in.(lead_engine.run,lead_engine.discovery,lead_engine.ingest,seo.gsc_report)&created_at=gte.${since}&order=created_at.desc&limit=60`),
    count('source=eq.discovery'), count('verification_status=eq.verified_active'), count('verification_status=eq.uncertain'),
    count('verification_status=eq.appears_inactive'), count('qualified_at=not.is.null'), count('status=eq.responded'),
    count('status=eq.lost'), count('status=eq.won'), count('contact_email=not.is.null&status=in.(new,responded)')
  ]);

  const lastOf = (type: string) => events.find((e) => e.type === type) ?? null;
  const problems: string[] = [];
  const run = lastOf('lead_engine.run');
  if (!run || Date.now() - new Date(run.created_at).getTime() > 26 * 3_600_000) problems.push('lead engine heeft >26 uur niet gedraaid');
  for (const k of ['discovery_error', 'verification_error', 'selection_error', 'brand_error']) {
    if (run?.payload?.[k]) problems.push(`lead engine ${k}: ${String(run.payload[k]).slice(0, 200)}`);
  }
  const gsc = lastOf('seo.gsc_report');
  if (!gsc || Date.now() - new Date(gsc.created_at).getTime() > 8 * 86_400_000) problems.push('Search Console-rapport ouder dan 8 dagen');

  return NextResponse.json({
    at: new Date().toISOString(),
    agents,
    last_runs: { lead_engine: run, discovery: lastOf('lead_engine.discovery'), ingest: lastOf('lead_engine.ingest'), gsc: gsc ? { created_at: gsc.created_at, totals: gsc.payload?.totals, actions: gsc.payload?.actions } : null },
    pipeline: { discovered, verified_active: active, uncertain, appears_inactive: inactive, qualified, interested, lost, won, inbound_open: inboundOpen },
    problems,
    budget: { ai_monthly_cap_eur: 29, ai_spent_eur: 0, note: 'Huidige agents gebruiken geen betaalde AI.' }
  });
}
