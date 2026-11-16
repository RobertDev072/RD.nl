import 'server-only';
import { createSign } from 'node:crypto';
import { rest } from './crm';

// Search Console agent: reads lorvex.nl search data (read-only service account) and turns it into concrete SEO actions.
// Deterministic, no AI cost. Report is stored as an event and shown in /admin.

const SITE = 'sc-domain:lorvex.nl';
type Row = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };

async function token(): Promise<string> {
  const raw = process.env.GSC_SERVICE_ACCOUNT;
  if (!raw) throw new Error('GSC_SERVICE_ACCOUNT missing');
  const sa = JSON.parse(raw) as { client_email: string; private_key: string };
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({
    iss: sa.client_email, scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 })}`;
  const sig = createSign('RSA-SHA256').update(unsigned).sign(sa.private_key, 'base64url');
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${sig}` })
  });
  if (!r.ok) throw new Error(`google auth ${r.status}`);
  return ((await r.json()) as { access_token: string }).access_token;
}

async function query(tok: string, dimensions: string[], days = 28): Promise<Row[]> {
  const end = new Date(Date.now() - 2 * 86_400_000), start = new Date(end.getTime() - days * 86_400_000);
  const d = (x: Date) => x.toISOString().slice(0, 10);
  const r = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`, {
    method: 'POST', headers: { authorization: `Bearer ${tok}`, 'content-type': 'application/json' },
    body: JSON.stringify({ startDate: d(start), endDate: d(end), dimensions, rowLimit: 250 })
  });
  if (!r.ok) throw new Error(`gsc ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return ((await r.json()) as { rows?: Row[] }).rows ?? [];
}

export type GscReport = {
  at: string; period_days: number;
  totals: { clicks: number; impressions: number; ctr: number; position: number };
  top_queries: { query: string; clicks: number; impressions: number; position: number }[];
  top_pages: { page: string; clicks: number; impressions: number; position: number }[];
  actions: { type: string; target: string; why: string; todo: string }[];
};

export async function runGscAgent(): Promise<GscReport> {
  const tok = await token();
  const [queries, pages] = await Promise.all([query(tok, ['query']), query(tok, ['page'])]);
  const sum = (k: 'clicks' | 'impressions') => pages.reduce((s, r) => s + r[k], 0);
  const clicks = sum('clicks'), impressions = sum('impressions');
  const position = impressions ? pages.reduce((s, r) => s + r.position * r.impressions, 0) / impressions : 0;
  const r1 = (n: number) => Math.round(n * 10) / 10;

  const actions: GscReport['actions'] = [];
  const brand = /lorvex/i;
  // 1. Almost on page 1: position 8–20 with real impressions → strengthen that page.
  for (const q of queries.filter((q) => !brand.test(q.keys[0]) && q.position >= 8 && q.position <= 20 && q.impressions >= 3).slice(0, 5)) {
    actions.push({ type: 'bijna_pagina_1', target: q.keys[0], why: `Positie ${r1(q.position)} met ${q.impressions} vertoningen`,
      todo: `Gebruik "${q.keys[0]}" in titel, H1 en tekst van de best passende pagina, en link er intern naartoe.` });
  }
  // 2. Seen but not clicked: impressions without clicks on page 1 → title/description weak.
  for (const p of pages.filter((p) => p.impressions >= 10 && p.ctr < 0.02 && p.position <= 10).slice(0, 3)) {
    actions.push({ type: 'lage_ctr', target: p.keys[0], why: `${p.impressions} vertoningen, CTR ${r1(p.ctr * 100)}%`,
      todo: 'Herschrijf de titel en meta-omschrijving: concreet voordeel + plaats (Alkmaar) + oproep tot actie.' });
  }
  // 3. Non-brand demand we don't serve yet.
  const nonBrand = queries.filter((q) => !brand.test(q.keys[0]));
  if (nonBrand.length === 0) {
    actions.push({ type: 'geen_zoekverkeer', target: 'website laten maken alkmaar', why: 'Alle vertoningen komen van zoekopdrachten op de naam "lorvex"',
      todo: 'Lokale landingspagina\'s maken (bijv. /website-laten-maken-alkmaar) en reviews op Google Business verzamelen.' });
  }

  const report: GscReport = {
    at: new Date().toISOString(), period_days: 28,
    totals: { clicks, impressions, ctr: impressions ? r1((clicks / impressions) * 100) : 0, position: r1(position) },
    top_queries: queries.slice(0, 15).map((q) => ({ query: q.keys[0], clicks: q.clicks, impressions: q.impressions, position: r1(q.position) })),
    top_pages: pages.slice(0, 10).map((p) => ({ page: p.keys[0], clicks: p.clicks, impressions: p.impressions, position: r1(p.position) })),
    actions
  };
  await rest('events', { method: 'POST', prefer: 'return=minimal', body: JSON.stringify({ type: 'seo.gsc_report', source_agent: 'gsc-agent', payload: report }) });
  return report;
}

export async function latestGscReport() {
  const r = await rest<{ payload: GscReport }[]>('events?select=payload&type=eq.seo.gsc_report&order=created_at.desc&limit=1');
  return r[0]?.payload ?? null;
}

/** Telegram text for the weekly Search Console report, compared with the previous report. */
export function gscTelegram(r: GscReport, prev: GscReport | null): string {
  const e = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const delta = (now: number, before?: number) => (before === undefined ? '' : now > before ? ` (▲ ${Math.round((now - before) * 10) / 10})` : now < before ? ` (▼ ${Math.round((before - now) * 10) / 10})` : ' (=)');
  const path = (u: string) => { try { return new URL(u).pathname || '/'; } catch { return u; } };
  const t = r.totals, p = prev?.totals;
  const lines = [
    `<b>Lorvex in Google</b> · laatste ${r.period_days} dagen`,
    `👀 Bezoekers via Google (klikken): <b>${t.clicks}</b>${delta(t.clicks, p?.clicks)}`,
    `🔎 Keer gezien in Google: <b>${t.impressions}</b>${delta(t.impressions, p?.impressions)}`,
    `📍 Gemiddelde positie: <b>${t.position}</b>${p ? (t.position < p.position ? ' (beter ▲)' : t.position > p.position ? ' (lager ▼)' : ' (=)') : ''}`,
    '',
    '<b>Beste pagina\'s</b>',
    ...r.top_pages.slice(0, 5).map((x, i) => `${i + 1}. ${e(path(x.page))} · ${x.clicks} klikken · positie ${x.position}`),
    '',
    '<b>Waarop je gevonden wordt</b>',
    ...r.top_queries.slice(0, 5).map((x) => `• "${e(x.query)}" · positie ${x.position} · ${x.impressions}× gezien`),
    ...(r.actions.length ? ['', '<b>Wat nu te doen</b>', ...r.actions.slice(0, 3).map((a) => `• ${e(a.todo)}`)] : [])
  ];
  return lines.join('\n');
}

export async function previousGscReport(): Promise<GscReport | null> {
  const r = await rest<{ payload: GscReport }[]>('events?select=payload&type=eq.seo.gsc_report&order=created_at.desc&limit=1');
  return r[0]?.payload ?? null;
}
