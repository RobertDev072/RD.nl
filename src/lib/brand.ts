// Extracts a business's own public branding from its homepage HTML: logo, colours, photos and texts.
// Used only for the private, noindex concept page shown to that same business ("eerst zien").
// Nothing is invented: every field is taken from their site or left empty.

export type Brand = {
  logo: string | null;
  colors: string[];          // most prominent brand colours (hex), best first
  images: string[];          // up to 8 content photos (absolute https URLs on their site/CDN)
  title: string | null;      // h1 or <title>
  tagline: string | null;    // meta description / og:description
  about: string[];           // up to 3 longer paragraphs from their site
  services: string[];        // up to 8 short headings/list items that look like services
  phone: string | null;
  email: string | null;
  address: string | null;
  socials: string[];
  extracted_at: string;
};

const decode = (s: string) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&nbsp;/g, ' ')
   .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/&[a-z]+;/g, ' ');
const strip = (s: string) => decode(s.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const attr = (tag: string, name: string) => tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, 'i'))?.[1] ?? null;

function abs(src: string | null, base: URL): string | null {
  if (!src || src.startsWith('data:')) return null;
  try {
    const u = new URL(decode(src.trim().split(/\s+/)[0]), base);
    if (u.protocol === 'http:') u.protocol = 'https:';
    return u.protocol === 'https:' ? u.href : null;
  } catch { return null; }
}

function meta(html: string, key: string): string | null {
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = m[0];
    if ((attr(tag, 'property') || attr(tag, 'name'))?.toLowerCase() === key) return attr(tag, 'content');
  }
  return null;
}

const GREYISH = (hex: string) => {
  const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  return max - min < 28 || max < 35 || min > 225; // greys, near-black, near-white
};
// Default palettes shipped by WordPress (Gutenberg), Wix and common builders: not the business's brand.
const PLATFORM_DEFAULTS = new Set(['#ff6900','#fcb900','#7bdcb5','#00d084','#8ed1fc','#0693e3','#9b51e0','#cf2e2e','#f78da7','#abb8c3',
  '#003388','#116dff','#0f62fe','#97f4ff','#4854c7','#ff0000','#00ff00','#0000ff','#ffff00','#ff00ff','#00ffff','#1e73be','#21759b','#0073aa','#0085ba','#2271b1','#3858e9']);
const toHex6 = (h: string) => (h.length === 4 ? '#' + [...h.slice(1)].map((c) => c + c).join('') : h).toLowerCase();

function colors(html: string): string[] {
  const count = new Map<string, number>();
  const add = (h: string, w: number) => { const x = toHex6(h); if (!GREYISH(x) && !PLATFORM_DEFAULTS.has(x)) count.set(x, (count.get(x) ?? 0) + w); };
  const theme = meta(html, 'theme-color'); if (theme && /^#[0-9a-f]{3,6}$/i.test(theme)) add(theme, 50);
  const css = html.replace(/--wp--preset--[^;]+;/g, '').replace(/--wix-[^;]+;/g, '');
  for (const m of css.matchAll(/#([0-9a-f]{6}|[0-9a-f]{3})\b/gi)) add('#' + m[1], 1);
  for (const m of css.matchAll(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/gi)) {
    add('#' + [m[1], m[2], m[3]].map((v) => Math.min(255, +v).toString(16).padStart(2, '0')).join(''), 1);
  }
  return [...count.entries()].sort((a, b) => b[1] - a[1]).map(([h]) => h).slice(0, 3);
}

export function extractBrand(html: string, base: URL): Brand {
  const body = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>/gi, ' ');
  const imgs = [...body.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);

  const logoTag = imgs.find((t) => /logo/i.test(`${attr(t, 'class')} ${attr(t, 'alt')} ${attr(t, 'src')} ${attr(t, 'id')}`));
  const logo = abs(logoTag ? attr(logoTag, 'src') || attr(logoTag, 'data-src') : null, base)
    ?? abs([...html.matchAll(/<link\b[^>]*rel=["'][^"']*apple-touch-icon[^"']*["'][^>]*>/gi)].map((m) => attr(m[0], 'href'))[0] ?? null, base);

  const seen = new Set<string>();
  const images: string[] = [];
  const og = abs(meta(html, 'og:image'), base);
  if (og) { images.push(og); seen.add(og); }
  for (const t of imgs) {
    if (t === logoTag) continue;
    const src = abs(attr(t, 'data-src') || attr(t, 'src') || attr(t, 'data-lazy-src'), base);
    if (!src || seen.has(src) || /\.svg(\?|$)|logo|icon|sprite|pixel|tracking|avatar|flag|payment|badge/i.test(src)) continue;
    const w = Number(attr(t, 'width')), h = Number(attr(t, 'height'));
    if ((w && w < 200) || (h && h < 150)) continue;
    seen.add(src); images.push(src);
    if (images.length >= 8) break;
  }

  const h1 = body.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  const title = (h1 && strip(h1)) || strip(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '') || null;
  const tagline = meta(html, 'description') || meta(html, 'og:description');

  const about = [...body.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => strip(m[1]))
    .filter((p) => p.length >= 80 && p.length <= 600 && !/cookie|privacy|javascript|©|copyright|algemene voorwaarden/i.test(p)).slice(0, 3);

  const services = [...new Set([...body.matchAll(/<(h2|h3|li)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => strip(m[2]))
    .filter((s) => s.length >= 4 && s.length <= 40 && !/menu|home|contact|cookie|privacy|over ons|login|winkelwagen|zoeken|©|\d{4}/i.test(s)))].slice(0, 8);

  const phone = html.match(/href=["']tel:([+0-9 ()-]{8,20})["']/i)?.[1]?.trim() ?? null;
  const email = html.match(/href=["']mailto:([^"'?]+)["']/i)?.[1] ?? null;
  const address = strip(html).match(/[A-Z][a-zà-ÿ.' -]{2,40}\s\d{1,4}[a-zA-Z]?,?\s+\d{4}\s?[A-Z]{2}\s+[A-Z][a-zà-ÿ' -]{2,30}/)?.[0] ?? null;
  const socials = [...new Set([...html.matchAll(/href=["'](https?:\/\/(?:www\.)?(?:instagram|facebook|tiktok|linkedin)\.com\/[^"'?#]+)/gi)].map((m) => m[1]))].slice(0, 4);

  return { logo, colors: colors(html), images, title: title?.slice(0, 120) ?? null, tagline: tagline ? decode(tagline).slice(0, 300) : null,
    about, services, phone, email, address, socials, extracted_at: new Date().toISOString() };
}
