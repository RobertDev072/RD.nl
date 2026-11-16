import { NextResponse } from 'next/server';
import { gscTelegram, previousGscReport, runGscAgent } from '@/lib/gsc-agent';
import { sendTelegram, telegramConfigured } from '@/lib/telegram';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET(req: Request) {
  if (!process.env.CRON_SECRET || req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  try {
    const prev = await previousGscReport().catch(() => null);
    const r = await runGscAgent();
    if (telegramConfigured()) await sendTelegram(gscTelegram(r, prev)).catch(() => false);
    return NextResponse.json({ ok: true, totals: r.totals, actions: r.actions.length });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : 'error' }, { status: 500 });
  }
}
