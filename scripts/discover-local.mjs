#!/usr/bin/env node
// Local OpenStreetMap discovery (LOR-005). Runs on a machine that Overpass accepts (not Vercel),
// fetches businesses with a website for one Dutch city, and either saves them to a file (default,
// dry run) or posts them to /api/agents/ingest (--send). Free: OpenStreetMap only, no paid AI.
//
//   node scripts/discover-local.mjs --city Amsterdam            → dry run, writes discovery-<city>-<date>.json
//   node scripts/discover-local.mjs --city Amsterdam --send     → posts to production ingest
//   env: AGENT_INGEST_TOKEN (required for --send), LORVEX_INGEST_URL (default https://lorvex.nl/api/agents/ingest)
//   options: --limit 100 (max businesses to send), --out <file>
import { writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : def; };
const city = opt('city', 'Amsterdam');
const limit = Number(opt('limit', '100'));
const send = args.includes('--send');
const date = new Date().toISOString().slice(0, 10);
const out = opt('out', `discovery-${city.toLowerCase().replace(/\W+/g, '-')}-${date}.json`);
const ingestUrl = process.env.LORVEX_INGEST_URL || 'https://lorvex.nl/api/agents/ingest';

const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.private.coffee/api/interpreter', 'https://overpass.kumi.systems/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter'];
// Same sector groups as the server-side lead engine, priority sectors first.
const GROUPS = [
  `nwr["shop"~"^(hairdresser|beauty|cosmetics)$"]["website"](area.a);nwr["amenity"="spa"]["website"](area.a);`,
  `nwr["craft"]["website"](area.a);`,
  `nwr["amenity"~"^(restaurant|cafe)$"]["website"](area.a);`,
  `nwr["shop"]["shop"!~"^(hairdresser|beauty|cosmetics)$"]["website"](area.a);`
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const safeCity = city.replace(/[^\p{L}\p{N} '-]/gu, '');

async function overpass(body) {
  const q = `[out:json][timeout:60];area["name"="${safeCity}"]["boundary"="administrative"]["admin_level"="8"]->.a;(${body});out tags;`;
  const errors = [];
  for (const ep of OVERPASS) {
    try {
      const r = await fetch(ep, {
        method: 'POST', body: 'data=' + encodeURIComponent(q),
        headers: { 'content-type': 'application/x-www-form-urlencoded', 'user-agent': 'LorvexLocalDiscovery/1.0 (+https://lorvex.nl)' },
        signal: AbortSignal.timeout(90_000)
      });
      if (r.ok) return (await r.json()).elements ?? [];
      errors.push(`${new URL(ep).host}:${r.status}`);
    } catch (e) { errors.push(`${new URL(ep).host}:${e.name}`); }
    await sleep(3000);
  }
  throw new Error(`overpass unavailable (${errors.join(', ')})`);
}

// Same pre-filter as the server (the server re-validates everything): name + website, no chains, no social links.
const usable = (e) => {
  const t = e.tags || {};
  const raw = t.website || t['contact:website'];
  return t.name && raw && !t.brand && !t['brand:wikidata'] && !/facebook|instagram|linktr|google\.|business\.site/i.test(raw);
};

const seen = new Set();
const picked = [];
for (const [i, g] of GROUPS.entries()) {
  if (picked.length >= limit) break;
  const els = await overpass(g);
  let added = 0;
  for (const e of els) {
    const key = `${e.type}/${e.id}`;
    if (seen.has(key) || !usable(e)) continue;
    // Fill in the city when OSM lacks addr:city (the whole query is inside this municipality).
    seen.add(key); picked.push({ ...e, tags: { 'addr:city': city, ...e.tags } }); added++;
    if (picked.length >= limit) break;
  }
  console.log(`group ${i + 1}/${GROUPS.length}: ${els.length} elements, ${added} usable added (total ${picked.length})`);
  await sleep(5000); // be polite to the public Overpass servers
}

writeFileSync(out, JSON.stringify({ city, date, source: 'OpenStreetMap (ODbL)', count: picked.length, elements: picked }, null, 2));
console.log(`saved ${picked.length} businesses to ${out}`);
if (!send) { console.log('dry run: nothing sent. Add --send to post to the ingest endpoint.'); process.exit(0); }

const token = process.env.AGENT_INGEST_TOKEN;
if (!token) { console.error('AGENT_INGEST_TOKEN missing'); process.exit(1); }
const totals = { received: 0, found: 0, new: 0, existing: 0, suppressed: 0, failed: 0 };
for (let i = 0; i < picked.length; i += 200) {
  const chunk = picked.slice(i, i + 200);
  const r = await fetch(ingestUrl, {
    method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ label: `${city} ${date}`, elements: chunk })
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { console.error(`ingest failed: HTTP ${r.status}`, j); process.exit(1); }
  for (const k of Object.keys(totals)) totals[k] += j[k] ?? 0;
}
console.log('ingest result:', totals);
