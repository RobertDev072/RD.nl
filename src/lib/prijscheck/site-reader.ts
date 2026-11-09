import 'server-only';
import dns from 'node:dns/promises';
import net from 'node:net';

/** Wat de prijscheck-agent van een bestaande website weet. */
export type SiteFacts = {
  url: string;
  finalUrl: string;
  https: boolean;
  status: number;
  ms: number;
  bytes: number;
  title: string;
  description: string;
  lang: string;
  generator: string;
  viewport: boolean;
  headings: string[];
  nav: string[];
  text: string;
  images: number;
  imagesWithoutAlt: number;
  logo?: string;
  themeColor?: string;
  phone: boolean;
  whatsapp: boolean;
  forms: number;
  structuredData: boolean;
  ogImage: boolean;
};

const MAX_BYTES = 1_500_000;
const TIMEOUT = 9000;

/** Blokkeert interne, lokale en gereserveerde adressen (SSRF-bescherming). */
function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return (
      a === 0 || a === 10 || a === 127 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 192 && b === 0) ||
      (a === 198 && (b === 18 || b === 19)) || a >= 224
    );
  }
  const v = ip.toLowerCase();
  if (v === '::' || v === '::1') return true;
  if (v.startsWith('::ffff:')) return isPrivateIp(v.slice(7));
  return v.startsWith('fc') || v.startsWith('fd') || v.startsWith('fe8') || v.startsWith('fe9') || v.startsWith('fea') || v.startsWith('feb') || v.startsWith('ff');
}

export function normalizeUrl(input: string): URL {
  let s = input.trim();
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
  const u = new URL(s);
  if (!['http:', 'https:'].includes(u.protocol)) throw new Error('Alleen http- en https-links.');
  if (u.port && !['80', '443'].includes(u.port)) throw new Error('Deze link kan niet worden gelezen.');
  if (u.username || u.password) throw new Error('Deze link kan niet worden gelezen.');
  if (!u.hostname.includes('.') || net.isIP(u.hostname)) throw new Error('Vul een gewone website-link in, zoals jouwbedrijf.nl.');
  return u;
}

async function assertPublic(u: URL) {
  const addrs = await dns.lookup(u.hostname, { all: true }).catch(() => []);
  if (!addrs.length) throw new Error('Deze website bestaat niet of is niet bereikbaar.');
  if (addrs.some((a) => isPrivateIp(a.address))) throw new Error('Deze link kan niet worden gelezen.');
}

async function safeFetch(start: URL): Promise<{ res: Response; url: URL; html: string; ms: number }> {
  let url = start;
  const t0 = Date.now();
  for (let hop = 0; hop < 4; hop++) {
    await assertPublic(url);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
    let res: Response;
    try {
      res = await fetch(url, {
        redirect: 'manual',
        signal: ctrl.signal,
        headers: { 'user-agent': 'Mozilla/5.0 (compatible; LorvexPrijscheck/1.0; +https://lorvex.nl/prijscheck)', accept: 'text/html,application/xhtml+xml' }
      });
    } catch {
      clearTimeout(timer);
      throw new Error('De website reageert niet. Klopt de link?');
    }
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      clearTimeout(timer);
      url = normalizeUrl(new URL(res.headers.get('location')!, url).toString());
      continue;
    }
    const type = res.headers.get('content-type') || '';
    if (!type.includes('html')) { clearTimeout(timer); throw new Error('Deze link is geen webpagina.'); }
    const reader = res.body?.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.length;
        chunks.push(value);
        if (size > MAX_BYTES) { await reader.cancel(); break; }
      }
    }
    clearTimeout(timer);
    const html = new TextDecoder('utf-8', { fatal: false }).decode(Buffer.concat(chunks.map((c) => Buffer.from(c))));
    return { res, url, html, ms: Date.now() - t0 };
  }
  throw new Error('Te veel doorverwijzingen op deze website.');
}

const decode = (s: string) =>
  s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
const strip = (s: string) => decode(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const meta = (html: string, name: string) => {
  const re = new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]*>`, 'i');
  const tag = html.match(re)?.[0] || '';
  return decode(tag.match(/content=["']([^"']*)["']/i)?.[1] || '').trim();
};

export async function readSite(input: string): Promise<SiteFacts> {
  const start = normalizeUrl(input);
  const { res, url, html, ms } = await safeFetch(start);
  const body = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ').replace(/<svg[\s\S]*?<\/svg>/gi, ' ');
  const headings = [...body.matchAll(/<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => `H${m[1]}: ${strip(m[2])}`).filter((h) => h.length > 4).slice(0, 30);
  const navHtml = body.match(/<nav[\s\S]*?<\/nav>/i)?.[0] || body.match(/<header[\s\S]*?<\/header>/i)?.[0] || '';
  const nav = [...new Set([...navHtml.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi)].map((m) => strip(m[1])).filter((t) => t && t.length < 40))].slice(0, 15);
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const logoTag = imgs.find((t) => /logo/i.test(t));
  const logoSrc = logoTag?.match(/\ssrc=["']([^"']+)["']/i)?.[1];
  let logo: string | undefined;
  try { if (logoSrc && !logoSrc.startsWith('data:')) logo = new URL(logoSrc, url).toString(); } catch { /* geen logo */ }
  return {
    url: start.toString(),
    finalUrl: url.toString(),
    https: url.protocol === 'https:',
    status: res.status,
    ms,
    bytes: html.length,
    title: strip(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || ''),
    description: meta(html, 'description') || meta(html, 'og:description'),
    lang: html.match(/<html[^>]*\slang=["']([^"']+)["']/i)?.[1] || '',
    generator: meta(html, 'generator') || (/wp-content|wp-includes/.test(html) ? 'WordPress' : /wix\.com|wixstatic/.test(html) ? 'Wix' : /squarespace/.test(html) ? 'Squarespace' : /shopify/i.test(html) ? 'Shopify' : /webflow/i.test(html) ? 'Webflow' : /__next/.test(html) ? 'Next.js' : ''),
    viewport: /<meta[^>]+name=["']viewport["']/i.test(html),
    headings,
    nav,
    text: strip(body.match(/<body[\s\S]*<\/body>/i)?.[0] || body).slice(0, 5000),
    images: imgs.length,
    imagesWithoutAlt: imgs.filter((t) => !/\salt=["'][^"']+["']/i.test(t)).length,
    logo,
    themeColor: meta(html, 'theme-color') || undefined,
    phone: /href=["']tel:/i.test(html),
    whatsapp: /wa\.me|api\.whatsapp\.com|whatsapp:\/\//i.test(html),
    forms: (html.match(/<form\b/gi) || []).length,
    structuredData: /application\/ld\+json/i.test(html),
    ogImage: !!meta(html, 'og:image')
  };
}
