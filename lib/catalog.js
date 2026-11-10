// Server-helpers bovenop de Woo-data: categorieboom, filters, selecties
import { getCatalog, lite } from './woo';

export const TOP_ORDER = ['haarverzorging', 'haarstyling', 'kleur-toning', 'tools', 'haaraccessoires'];
export const TOP_LABEL = { haaraccessoires: 'Accessoires' };
export const TOP_INTRO = {
  haarverzorging: 'Shampoo, conditioner, maskers en olie voor gezond, glanzend haar.',
  haarstyling: 'Van pomade tot mousse: houvast, volume en textuur in salonkwaliteit.',
  'kleur-toning': 'Zilver- en kleurshampoo om je kleur mooi en fris te houden.',
  tools: 'Föhns, airstylers, krul- en stijltangen voor salonresultaat thuis.',
  haaraccessoires: 'Satijn, borstels en handdoeken die je haar sparen.'
};

export async function getData() {
  const c = await getCatalog();
  const cats = c.cats;
  const byId = new Map(cats.map(x => [x.id, x]));
  const children = id => cats.filter(x => x.parent === id).sort((a, b) => b.count - a.count);
  const descendantIds = id => { const out = [id]; for (const ch of children(id)) out.push(...descendantIds(ch.id)); return out; };
  const tops = TOP_ORDER.map(s => cats.find(x => x.slug === s)).filter(Boolean)
    .map(t => ({ ...t, label: TOP_LABEL[t.slug] || t.name, intro: TOP_INTRO[t.slug] || '', children: children(t.id) }));
  const brands = [];
  for (const p of c.products) if (p.brand && !brands.find(b => b.slug === p.brand.slug)) brands.push({ ...p.brand, count: 0 });
  for (const b of brands) b.count = c.products.filter(p => p.brand?.slug === b.slug).length;
  brands.sort((a, b) => b.count - a.count);
  const artistique = cats.find(x => x.slug === 'artistique');
  const lines = artistique ? children(artistique.id) : [];
  return { ...c, byId, children, descendantIds, tops, brands, lines };
}

// Navigatie voor de header (klein en serialiseerbaar) + zoekindex voor live suggesties
export async function getNav() {
  const d = await getData();
  return {
    tops: d.tops.map(t => ({ slug: t.slug, label: t.label, intro: t.intro, count: t.count, img: firstImageIn(d, t.id), children: t.children.map(c => ({ slug: c.slug, name: c.name, count: c.count })) })),
    brands: d.brands.map(b => ({ slug: b.slug, name: b.name, count: b.count })),
    lines: d.lines.map(l => ({ slug: l.slug, name: l.name.replace(/^Artistique\s+/, ''), count: l.count })),
    saleCount: d.products.filter(p => p.onSale).length,
    index: d.products.map(p => ({ id: p.id, slug: p.slug, name: p.name, brand: p.brand?.name || '', price: p.price, regular: p.regular, inStock: p.inStock, thumb: p.images[0]?.thumb || null, cats: p.cats.map(c => c.name).join(' ') }))
  };
}

export const inCat = (d, p, catId) => { const ids = new Set(d.descendantIds(catId)); return p.cats.some(c => ids.has(c.id)); };

export async function listFor({ cat, brand, sale } = {}) {
  const d = await getData();
  let items = d.products;
  let category = null;
  if (cat) { category = d.cats.find(x => x.slug === cat); if (!category) return null; items = items.filter(p => inCat(d, p, category.id)); }
  if (brand) items = items.filter(p => p.brand?.slug === brand);
  if (sale) items = items.filter(p => p.onSale);
  return { d, category, items: items.map(lite) };
}

export const firstImageIn = (d, catId) => {
  const p = d.products.find(p => p.inStock && p.images[0] && inCat(d, p, catId));
  return p?.images[0]?.thumb || null;
};

// Filter-facetten: per categorie de product-id's (inclusief subcategorieën) binnen deze lijst
export function facetsFor(d, items, cats) {
  const ids = new Set(items.map(p => p.id));
  return cats.map(c => {
    const all = new Set(d.descendantIds(c.id));
    const pids = d.products.filter(p => ids.has(p.id) && p.cats.some(x => all.has(x.id))).map(p => p.id);
    return { slug: c.slug, name: (c.label || c.name).replace(/^Artistique\s+/, ''), count: pids.length, pids };
  }).filter(f => f.count > 0);
}

export function crumbsFor(d, cat) {
  const out = [];
  let c = cat;
  while (c) { out.unshift({ name: c.name, href: `/categorie/${c.slug}` }); c = c.parent ? d.byId.get(c.parent) : null; }
  return out;
}
