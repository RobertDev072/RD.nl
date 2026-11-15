#!/usr/bin/env node
// Crawls the built site (served by `next start`) and fails if any internal page or link
// returns a non-2xx status. Starts from the sitemap, then follows internal <a href> links.
// Usage: BASE_URL=http://localhost:3000 node scripts/check-links.mjs
const BASE = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const SITE_HOSTS = ['lorvex.nl', 'www.lorvex.nl', 'rd-main-project-2026-site.vercel.app'];

function toLocal(href, from) {
  let url;
  try { url = new URL(href, from); } catch { return null; }
  if (!['http:', 'https:'].includes(url.protocol)) return null;
  const local = new URL(BASE);
  if (url.host !== local.host && !SITE_HOSTS.includes(url.hostname)) return null; // external
  return `${BASE}${url.pathname}`;
}

async function main() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
  const xml = await res.text();
  const queue = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => toLocal(m[1], BASE)).filter(Boolean);
  if (queue.length === 0) throw new Error('sitemap.xml contains no URLs');
  queue.push(`${BASE}/robots.txt`);

  const seen = new Set();
  const broken = [];
  while (queue.length) {
    const url = queue.shift();
    if (seen.has(url)) continue;
    seen.add(url);
    const r = await fetch(url, { redirect: 'follow' });
    if (!r.ok) { broken.push(`${r.status} ${url}`); continue; }
    if (!(r.headers.get('content-type') || '').includes('text/html')) continue;
    const html = await r.text();
    for (const m of html.matchAll(/<a\s[^>]*href="([^"#]+)/g)) {
      const next = toLocal(m[1], url);
      if (next && !seen.has(next)) queue.push(next);
    }
  }

  console.log(`Checked ${seen.size} internal URLs.`);
  if (broken.length) {
    console.error(`Broken links (${broken.length}):\n${broken.join('\n')}`);
    process.exit(1);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
