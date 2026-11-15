import { NextResponse } from 'next/server';
import { crmConfigured } from '@/lib/crm';
import { discover, logRun, selectDaily, verifyAndAnalyse } from '@/lib/lead-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export const preferredRegion = 'dub1';

// Called daily by Vercel Cron (vercel.json). Vercel sends "Authorization: Bearer $CRON_SECRET".
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (!crmConfigured()) return NextResponse.json({ error: 'crm not configured' }, { status: 503 });

  const report: Record<string, unknown> = { at: new Date().toISOString() };
  try {
    // One small category group per day (rotation), so every group is refreshed every 4 days.
    const g = Number(new URL(req.url).searchParams.get('group'));
    report.discovery = await discover(Number.isInteger(g) && g >= 0 && g < 4 && new URL(req.url).searchParams.has('group') ? g : undefined);
    await logRun('lead_engine.discovery', report.discovery);
  } catch (e) {
    report.discovery_error = e instanceof Error ? e.message : 'error';
  }
  try { report.verification = await verifyAndAnalyse(20); } catch (e) { report.verification_error = e instanceof Error ? e.message : 'error'; }
  try { report.qualified = await selectDaily(5); } catch (e) { report.selection_error = e instanceof Error ? e.message : 'error'; }
  try { await logRun('lead_engine.run', report); } catch { /* best effort */ }
  return NextResponse.json(report);
}
