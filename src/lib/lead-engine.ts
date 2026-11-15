import 'server-only';
import { checkWebsite, CheckError, type CheckResult } from './website-check';
import { rest } from './crm';

// Lead engine v1 — fully deterministic, no paid AI.
// discover (OpenStreetMap, Alkmaar ±15 km) → dedup (database) → verify + analyse (website-check
// engine) → explainable score → select the day's best opportunities. No outreach.

const CENTER = { lat: 52.6324, lon: 4.7534 }; // Alkmaar
const RADIUS_M = 15_000;
const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];

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

type OsmElement = { type: string; id: number; tags?: Record<string, string> };

export async function discover(): Promise<{ found: number; new: number; existing: number; suppressed: number }> {
  const q = `[out:json][timeout:50];(
    nwr(around:${RADIUS_M},${CENTER.lat},${CENTER.lon})["shop"]["website"];
    nwr(around:${RADIUS_M},${CENTER.lat},${CENTER.lon})["craft"]["website"];
    nwr(around:${RADIUS_M},${CENTER.lat},${CENTER.lon})["amenity"~"^(restaurant|cafe|spa)$"]["website"];
  );out tags;`;
  let elements: OsmElement[] | null = null;
  for (const ep of OVERPASS) {
    try {
      const r = await fetch(ep, {
        method: 'POST',
        body: 'data=' + encodeURIComponent(q),
        headers: { 'content-type': 'application/x-www-form-urlencoded', 'user-agent': 'LorvexLeadEngine/1.0 (+https://lorvex.nl)' },
        signal: AbortSignal.timeout(25_000)
      });
      if (r.ok) { elements = (await r.json()).elements; break; }
    } catch { /* try next mirror */ }
  }
  if (!elements) throw new Error('overpass unavailable');

  const stats = { found: 0, new: 0, existing: 0, suppressed: 0 };
  const rows = elements.flatMap((e) => {
    const t = e.tags || {};
    // Skip chains/franchises and anything without a name or website.
    if (!t.name || t.brand || t['brand:wikidata']) return [];
    const raw = t.website || t['contact:website'];
    let url: URL;
    try { url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`); } catch { return []; }
    const domain = url.hostname.replace(/^www\./, '').toLowerCase();
    if (/facebook|instagram|linktr|google\.|business\.site/.test(domain)) return [];
    const cat = CATEGORIES.find((c) => c.match(t));
    return [{
      p_osm_id: `${e.type}/${e.id}`, p_name: t.name, p_category: cat?.label ?? 'overig',
      p_website: url.origin + '/', p_domain: domain,
      p_address: [t['addr:street'], t['addr:housenumber']].filter(Boolean).join(' ') || null,
      p_postcode: t['addr:postcode']?.replace(/\s/g, '').toUpperCase() || null,
      p_city: t['addr:city'] || null, p_source: 'osm'
    }];
  });
  stats.found = rows.length;

  // Bounded concurrency; the database decides new / existing / suppressed.
  let i = 0;
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (i < rows.length) {
      const row = rows[i++];
      try {
        const r = await rest<{ status: 'new' | 'existing' | 'suppressed' }>('rpc/upsert_discovered_business', { method: 'POST', body: JSON.stringify(row) });
        stats[r.status] += 1;
      } catch { /* counted as not processed; retried next run */ }
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
        const check = await checkWebsite(lead.website);
        audit = check;
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
