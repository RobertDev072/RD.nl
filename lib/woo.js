// Haalt het assortiment live op uit de WooCommerce Store API van JeHaarwinkel
// en zet het om naar een compact, voorspelbaar formaat voor de webshop.
import { cache } from 'react';

const API = process.env.WOO_API || 'https://www.jehaarwinkel.nl/wp-json/wc/store';
const REVALIDATE = 3600; // elk uur verversen
const HEADERS = { 'user-agent': 'Mozilla/5.0 (Lorvex concept)', accept: 'application/json' };

const ENT = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', ndash: '–', mdash: '—',
  rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', euro: '€', eacute: 'é', euml: 'ë', ouml: 'ö',
  uuml: 'ü', iuml: 'ï', auml: 'ä', egrave: 'è', ccedil: 'ç', reg: '®', trade: '™', copy: '©', deg: '°', times: '×'
};
export const decode = s => String(s ?? '').replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => {
  if (e[0] === '#') {
    const n = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return Number.isFinite(n) ? String.fromCodePoint(n) : m;
  }
  return ENT[e.toLowerCase()] ?? m;
});
export const stripHtml = s => decode(String(s ?? '')
  .replace(/<br\s*\/?>/gi, ' ').replace(/<\/(p|li|h\d)>/gi, ' ').replace(/<[^>]+>/g, ''))
  .replace(/\s+/g, ' ').trim();

// Productomschrijving veilig maken: geen scripts, formulieren, inline events of externe links
export function sanitize(html) {
  return String(html ?? '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|iframe|object|embed|form|noscript|svg)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<(script|style|iframe|object|embed|form|input|button|link|meta|select|textarea)\b[^>]*>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s(style|class|id|data-[\w-]+)\s*=\s*("[^"]*"|'[^']*')/gi, '')
    .replace(/<a\b[^>]*>/gi, '<span>').replace(/<\/a>/gi, '</span>')
    .replace(/<img\b/gi, '<img loading="lazy"')
    .trim();
}

const cents = v => { const n = parseInt(v, 10); return Number.isFinite(n) ? n : 0; };
const slugify = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const pretty = s => String(s).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

async function getJSON(path) {
  const res = await fetch(API + path, { headers: HEADERS, next: { revalidate: REVALIDATE } });
  if (!res.ok) throw new Error(`Woo API ${res.status} voor ${path}`);
  return { data: await res.json(), pages: +res.headers.get('x-wp-totalpages') || 1 };
}

function normImage(img, alt) {
  return { src: img.src, thumb: img.thumbnail || img.src, alt: decode(img.alt) || alt };
}

function normProduct(p, variationsById) {
  const name = decode(p.name);
  const images = (p.images || []).map(i => normImage(i, name));
  const brand = (p.brands || [])[0];
  const base = {
    id: p.id,
    slug: p.slug,
    name,
    type: p.type,
    price: cents(p.prices?.price),
    regular: cents(p.prices?.regular_price),
    onSale: !!p.on_sale && cents(p.prices?.regular_price) > cents(p.prices?.price),
    inStock: !!p.is_in_stock,
    lowStock: p.low_stock_remaining ?? null,
    purchasable: p.is_purchasable !== false,
    short: stripHtml(p.short_description).slice(0, 320),
    descHtml: sanitize(p.description),
    images,
    cats: (p.categories || []).map(c => ({ id: c.id, slug: c.slug, name: decode(c.name) })),
    brand: brand ? { name: decode(brand.name), slug: brand.slug } : null,
    rating: Number(p.average_rating) || 0,
    reviews: p.review_count || 0,
    attrName: null,
    options: null
  };

  if (p.type === 'variable' && p.variations?.length) {
    const attr = (p.attributes || []).find(a => a.has_variations) || (p.attributes || [])[0];
    const termName = slug => {
      const t = attr?.terms?.find(t => t.slug === slug || slugify(decode(t.name)) === slug);
      return t ? decode(t.name) : pretty(slug);
    };
    base.attrName = attr ? decode(attr.name) : 'Optie';
    base.options = p.variations.map(v => {
      const vd = variationsById.get(v.id);
      const label = v.attributes.map(a => termName(a.value)).join(' / ');
      return {
        id: v.id,
        label,
        price: vd ? cents(vd.prices?.price) : base.price,
        regular: vd ? cents(vd.prices?.regular_price) : base.regular,
        inStock: vd ? !!vd.is_in_stock : base.inStock,
        image: vd?.images?.[0] ? normImage(vd.images[0], `${name} – ${label}`) : null
      };
    });
    const prices = base.options.map(o => o.price).filter(Boolean);
    if (prices.length) { base.price = Math.min(...prices); }
    base.priceMax = prices.length ? Math.max(...prices) : base.price;
    base.inStock = base.options.some(o => o.inStock);
    base.onSale = base.options.some(o => o.regular > o.price);
    base.regular = base.onSale ? Math.max(...base.options.map(o => o.regular)) : base.price;
  }
  return base;
}

async function loadLive() {
  const all = [];
  let page = 1, pages = 1;
  do {
    const r = await getJSON(`/products?per_page=50&page=${page}`);
    all.push(...r.data);
    pages = r.pages;
    page++;
  } while (page <= pages);

  const varIds = all.filter(p => p.type === 'variable').flatMap(p => (p.variations || []).map(v => v.id));
  const variations = await Promise.all(varIds.map(id => getJSON(`/products/${id}`).then(r => r.data).catch(() => null)));
  const byId = new Map(variations.filter(Boolean).map(v => [v.id, v]));

  const { data: rawCats } = await getJSON('/products/categories?per_page=100');
  const cats = rawCats.map(c => ({ id: c.id, slug: c.slug, name: decode(c.name), parent: c.parent, count: c.count }));
  const products = all.filter(p => p.is_purchasable !== false || p.type === 'variable').map(p => normProduct(p, byId));
  return { products, cats, live: true, fetchedAt: new Date().toISOString() };
}

async function loadFixture() {
  const mod = await import('./fixture.json');
  return { ...mod.default, live: false };
}

export const getCatalog = cache(async () => {
  if (process.env.WOO_FIXTURE === '1') return loadFixture();
  return loadLive();
});

// Lichte versie voor lijsten (zonder lange omschrijving)
export const lite = p => {
  const { descHtml, ...rest } = p;
  return { ...rest, images: p.images.slice(0, 2) };
};
