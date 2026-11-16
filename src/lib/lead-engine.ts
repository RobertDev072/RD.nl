import 'server-only';
import { checkWebsiteWithHtml, CheckError, type CheckResult } from './website-check';
import { rest } from './crm';
import { extractBrand } from './brand';
import { extractContacts, formatPhone, isMobile } from './contact-extract';
import { esc } from './telegram';
import { warmMessage, type MessageLead } from './outreach-message';

// Lead engine v1 — fully deterministic, no paid AI.
// discover (OpenStreetMap, Alkmaar ±15 km) → dedup (database) → verify + analyse (website-check
// engine) → explainable score → select the day's best opportunities. No outreach.

const CENTER = { lat: 52.6324, lon: 4.7534 }; // Alkmaar
const RADIUS_M = 15_000;
const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.private.coffee/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];

// OSM tag → category label + relevance for Lorvex (priority sectors from the project plan).
const CATEGORIES: { match: (t: Record<string, string>) => boolean; label: string; relevance: number }[] = [
  { match: (t) => t.shop === 'hairdresser', label: 'kapper', relevance: 20 },
  { match: (t) => t.shop === 'beauty' || t.shop === 'cosmetics' || t.amenity === 'spa', label: 'schoonheidssalon', relevance: 20 },
  { match: (t) => t.amenity === 'restaurant', label: 'restaurant', relevance: 15 },
  { match: (t) => t.amenity === 'cafe', label: 'café', relevance: 15 },
  { match: (t) => t.craft === 'electrician', label: 'elektricien', relevance: 18 },
  { match: (t) => ['plumber', 'hvac', 'heating_engineer', 'roofer', 'carpenter', 'painter', 'builder'].includes(t.craft), label: 'installatie/bouw', relevance: 15 },
  { match: (t) => Boolean(t.shop), label: 'winkel', relevance: 10 },
  { match: (t) => Boolean(t.craft), label: 'vakbedrijf', relevance: 10 }
];

const SIMPLE_PLATFORMS = /JouwWeb|Wix|Weebly|Webnode|Mijnwebwinkel|Sitebuilder|Joomla/;

export type OsmElement = { type: string; id: number; tags?: Record<string, string> };

// Small queries rotated per day (the public Overpass servers time out on one big query).
const GROUPS = [
  (bb: string) => `nwr["shop"~"^(hairdresser|beauty|cosmetics)$"]["website"](${bb});nwr["amenity"="spa"]["website"](${bb});`,
  (bb: string) => `nwr["amenity"~"^(restaurant|cafe)$"]["website"](${bb});`,
  (bb: string) => `nwr["craft"]["website"](${bb});`,
  (bb: string) => `nwr["shop"]["shop"!~"^(hairdresser|beauty|cosmetics)$"]["website"](${bb});`
];
export const groupForToday = () => Math.floor(Date.now() / 86_400_000) % GROUPS.length;

export async function discover(group = groupForToday()): Promise<{ group: number; found: number; new: number; existing: number; suppressed: number; failed: number }> {
  // Bounding box ≈ 15 km around Alkmaar (much faster on Overpass than an "around" radius query).
  const dLat = RADIUS_M / 111_000, dLon = RADIUS_M / (111_000 * Math.cos((CENTER.lat * Math.PI) / 180));
  const bb = [CENTER.lat - dLat, CENTER.lon - dLon, CENTER.lat + dLat, CENTER.lon + dLon].map((n) => n.toFixed(4)).join(',');
  const q = `[out:json][timeout:20];(${GROUPS[group](bb)});out tags;`;
  let elements: OsmElement[] | null = null;
  const failures: string[] = [];
  for (const ep of OVERPASS.slice(0, 2)) {
    try {
      const r = await fetch(ep, {
        method: 'POST',
        body: 'data=' + encodeURIComponent(q),
        headers: { 'content-type': 'application/x-www-form-urlencoded', 'user-agent': 'LorvexLeadEngine/1.0 (+https://lorvex.nl)' },
        signal: AbortSignal.timeout(18_000)
      });
      if (r.ok) { elements = (await r.json()).elements; break; }
      failures.push(`${new URL(ep).host}:${r.status}`);
    } catch (e) { failures.push(`${new URL(ep).host}:${e instanceof Error ? e.name : 'error'}`); }
  }
  if (!elements) throw new Error(`overpass unavailable (${failures.join(', ')})`);

  return { group, ...(await ingestOsmElements(elements, 'osm')) };
}

export type DiscoveredRow = {
  p_osm_id: string; p_name: string; p_category: string; p_website: string; p_domain: string;
  p_address: string | null; p_postcode: string | null; p_city: string | null; p_source: string; p_phone: string | null;
};

// Raw Overpass elements → validated rows. Skips chains, entries without name/website and social-only links.
export function osmElementsToRows(elements: OsmElement[], source = 'osm'): DiscoveredRow[] {
  const seen = new Set<string>();
  return elements.flatMap((e) => {
    if (!e || typeof e.type !== 'string' || !Number.isFinite(e.id) || !['node', 'way', 'relation'].includes(e.type)) return [];
    const t = e.tags || {};
    if (!t.name || t.brand || t['brand:wikidata']) return [];
    const raw = t.website || t['contact:website'];
    if (!raw) return [];
    let url: URL;
    try { url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`); } catch { return []; }
    if (!/^https?:$/.test(url.protocol)) return [];
    const domain = url.hostname.replace(/^www\./, '').toLowerCase();
    if (!domain.includes('.') || /facebook|instagram|linktr|google\.|business\.site/.test(domain)) return [];
    const osmId = `${e.type}/${e.id}`;
    if (seen.has(osmId)) return [];
    seen.add(osmId);
    const cat = CATEGORIES.find((c) => c.match(t));
    const clip = (v: string | undefined | null, n = 200) => (v ? String(v).slice(0, n) : null);
    return [{
      p_osm_id: osmId, p_name: clip(t.name)!, p_category: cat?.label ?? 'overig',
      p_website: url.origin + '/', p_domain: domain,
      p_address: clip([t['addr:street'], t['addr:housenumber']].filter(Boolean).join(' ')) || null,
      p_postcode: t['addr:postcode']?.replace(/\s/g, '').toUpperCase().slice(0, 10) || null,
      p_city: clip(t['addr:city'], 100), p_source: source,
      // Stored by the database only for B.V./N.V. (legal persons may be called); ignored otherwise.
      p_phone: clip(t.phone || t['contact:phone'], 40)
    }];
  });
}

// Rows → database. Bounded concurrency; the database decides new / existing / suppressed.
export async function ingestOsmElements(elements: OsmElement[], source = 'osm') {
  const rows = osmElementsToRows(elements, source);
  const stats = { found: rows.length, new: 0, existing: 0, suppressed: 0, failed: 0 };
  let i = 0;
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (i < rows.length) {
      const row = rows[i++];
      try {
        const r = await rest<{ status: 'new' | 'existing' | 'suppressed' }>('rpc/upsert_discovered_business', { method: 'POST', body: JSON.stringify(row) });
        stats[r.status as 'new' | 'existing' | 'suppressed'] += 1;
      } catch { stats.failed += 1; /* retried next run */ }
    }
  }));
  return stats;
}

type PendingLead = { id: string; website: string | null; category: string | null };

function relevanceFor(category: string | null) {
  return CATEGORIES.find((c) => c.label === category)?.relevance ?? 5;
}

// Explainable opportunity score: website weaknesses + sector relevance + easy-to-improve platform.
export function scoreOpportunity(check: CheckResult, category: string | null) {
  const reasons: string[] = [];
  let score = 0;
  for (const f of check.findings) {
    if (!f.ok) { score += f.id === 'mobile' ? 15 : f.id === 'booking' || f.id === 'contact' ? 12 : f.id === 'https' ? 10 : 6; reasons.push(f.title); }
  }
  const rel = relevanceFor(category);
  score += rel;
  reasons.push(`sector: ${category ?? 'overig'} (+${rel})`);
  if (SIMPLE_PLATFORMS.test(check.platform)) { score += 8; reasons.push(`eenvoudig platform: ${check.platform}`); }
  return { score: Math.min(100, score), reasons };
}

export async function verifyAndAnalyse(limit = 20) {
  const pending = await rest<PendingLead[]>(
    `leads?select=id,website,category&source=eq.discovery&verify_attempts=lt.3` +
    `&or=(verification_status.eq.pending,verification_status.eq.uncertain)&order=verify_attempts.asc,created_at.asc&limit=${limit}`
  );
  const stats = { checked: 0, active: 0, uncertain: 0, inactive: 0 };
  let i = 0;
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (i < pending.length) {
      const lead = pending[i++];
      let status: 'verified_active' | 'uncertain' | 'appears_inactive' = 'uncertain';
      let score: number | null = null, audit: CheckResult | null = null, reasons: string[] | null = null;
      let evidence: Record<string, unknown> = { checked_url: lead.website, at: new Date().toISOString() };
      try {
        if (!lead.website) throw new CheckError('unreachable', 'no website');
        const fetched = await checkWebsiteWithHtml(lead.website);
        const check = fetched.result;
        audit = check;
        if (!check.inactiveSignal) {
          await saveBrand(lead.id, extractBrand(fetched.html, fetched.finalUrl)).catch(() => undefined);
          await saveContact(lead.id, fetched.html, String(fetched.finalUrl)).catch(() => undefined);
        }
        if (check.inactiveSignal) {
          status = 'appears_inactive';
          evidence = { ...evidence, final_url: check.finalUrl, inactive_text: check.inactiveSignal };
        } else {
          status = 'verified_active';
          const s = scoreOpportunity(check, lead.category);
          score = s.score; reasons = s.reasons;
          evidence = { ...evidence, final_url: check.finalUrl, site_score: check.score, load_ms: check.loadMs };
        }
      } catch (e) {
        // An unreachable website alone is NOT evidence that the business is inactive.
        evidence = { ...evidence, error: e instanceof CheckError ? e.code : 'error' };
      }
      try {
        await rest('rpc/record_lead_verification', {
          method: 'POST', prefer: 'return=minimal',
          body: JSON.stringify({ p_id: lead.id, p_status: status, p_score: score, p_audit: audit, p_evidence: evidence, p_reasons: reasons })
        });
        stats.checked++;
        if (status === 'verified_active') stats.active++; else if (status === 'uncertain') stats.uncertain++; else stats.inactive++;
      } catch { /* retried next run */ }
    }
  }));
  return stats;
}

export async function selectDaily(limit = 5) {
  const rows = await rest<{ id: string; business_name: string; score: number }[]>('rpc/select_daily_opportunities', {
    method: 'POST', body: JSON.stringify({ p_limit: limit, p_min_score: 40 })
  });
  return rows.map((r) => ({ id: r.id, name: r.business_name, score: r.score }));
}

// Weekly discovery is enough (OSM changes slowly); verification + selection run daily.
export async function discoveryDue(): Promise<boolean> {
  const last = await rest<{ created_at: string }[]>(
    `events?select=created_at&type=eq.lead_engine.discovery&order=created_at.desc&limit=1`
  );
  return !last.length || Date.now() - new Date(last[0].created_at).getTime() > 6 * 24 * 3600_000;
}

export async function logRun(type: string, payload: unknown) {
  await rest('events', { method: 'POST', prefer: 'return=minimal', body: JSON.stringify({ type, source_agent: 'lead-agent', payload }) });
}

async function saveBrand(id: string, brand: unknown) {
  await rest('rpc/set_lead_brand', { method: 'POST', prefer: 'return=minimal', body: JSON.stringify({ p_id: id, p_brand: brand }) });
}

/** Back-fills branding for active leads that were verified before brand extraction existed. */
export async function fillBrands(limit = 12) {
  const rows = await rest<{ id: string; website: string }[]>(
    `leads?select=id,website&verification_status=eq.verified_active&brand=is.null&status=not.in.(lost,disqualified)&order=score.desc.nullslast&limit=${limit}`
  );
  let done = 0;
  await Promise.all(rows.map(async (r) => {
    try { const f = await checkWebsiteWithHtml(r.website); await saveBrand(r.id, extractBrand(f.html, f.finalUrl)); done++; } catch { /* next run */ }
  }));
  return { candidates: rows.length, done };
}

async function saveContact(id: string, html: string, url: string) {
  const c = extractContacts(html, url);
  await rest('rpc/set_lead_contact', { method: 'POST', prefer: 'return=minimal', body: JSON.stringify({ p_id: id, p_phone: c.phone, p_email: c.email }) });
}

/** Back-fills phone + e-mail from the website for active leads not checked yet. */
export async function fillContacts(limit = 12) {
  const rows = await rest<{ id: string; website: string }[]>(
    `leads?select=id,website&source=eq.discovery&verification_status=eq.verified_active&contact_checked_at=is.null&status=not.in.(lost,disqualified)&order=score.desc.nullslast&limit=${limit}`
  );
  let done = 0;
  await Promise.all(rows.map(async (r) => {
    try { const f = await checkWebsiteWithHtml(r.website); await saveContact(r.id, f.html, String(f.finalUrl)); done++; } catch { /* next run */ }
  }));
  return { candidates: rows.length, done };
}

type ReportLead = MessageLead & { id: string; website: string | null;
  business_phone: string | null; business_email?: string | null; score: number | null; legal_form: string | null };

/** Telegram messages for the daily run: a summary, then one message per lead with phone, e-mail and a ready-to-send text. */
export async function buildDailyReport(report: Record<string, unknown>): Promise<string[]> {
  const picked = (report.qualified as { id: string }[] | undefined) ?? [];
  let leads: ReportLead[] = [];
  if (picked.length) {
    leads = await rest<ReportLead[]>(`leads?select=*&id=in.(${picked.map((p) => p.id).join(',')})&order=score.desc.nullslast`);
  }
  const d = report.discovery as { found?: number; new?: number } | undefined;
  const v = report.verification as { checked?: number; active?: number } | undefined;
  const head = [
    `<b>Lorvex dagrapport</b> ${esc(new Date().toLocaleDateString('nl-NL', { timeZone: 'Europe/Amsterdam' }))}`,
    `Ontdekt: ${d ? `${d.new ?? 0} nieuw (${d.found ?? 0} gevonden)` : 'mislukt'} · gecontroleerd: ${v?.checked ?? 0} (${v?.active ?? 0} actief)`,
    ...['discovery_error', 'verification_error', 'selection_error'].filter((k) => report[k]).map((k) => `⚠️ ${k}: ${esc(String(report[k]).slice(0, 150))}`)
  ].join('\n');
  if (!leads.length) return [head + '\n\nVandaag geen nieuwe kansen.'];
  const blocks = leads.map((l, i) => {
    const phone = formatPhone(l.business_phone);
    const m = warmMessage(l);
    return [
      `<b>${i + 1}/${leads.length} · ${esc(l.business_name)}</b> · kansscore ${l.score ?? '–'}`,
      `${esc(l.category ?? 'overig')}${l.city ? ` · ${esc(l.city)}` : ''}${l.legal_form ? ' · B.V./N.V.' : ''}`,
      l.website ? `🌐 ${esc(l.website)}` : null,
      phone ? `📞 ${esc(phone)}${isMobile(l.business_phone) ? ' (06)' : ''}` : '📞 geen nummer gevonden',
      `\n<b>Belscript</b> (gebruik bij het bellen; e-mail/WhatsApp pas na hun ja):`,
      `<pre>${esc(m.body)}</pre>`
    ].filter(Boolean).join('\n');
  });
  return [`${head}\n\nHieronder de ${leads.length} beste kansen van vandaag 👇`, ...blocks];
}
