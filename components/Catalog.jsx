'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { lock, unlock } from '@/lib/lock';
import { pct } from '@/lib/format';
import ProductCard from './ProductCard';
import { Icon } from './ui';

const SORTS = [
  ['aanbevolen', 'Aanbevolen'],
  ['prijs-op', 'Prijs: laag naar hoog'],
  ['prijs-af', 'Prijs: hoog naar laag'],
  ['korting', 'Hoogste korting'],
  ['naam', 'Naam A–Z']
];
const PAGE = 24;

function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

function PriceRange({ lo, hi, f, set }) {
  const a = f.pmin ?? lo, b = f.pmax ?? hi;
  if (hi - lo < 2) return null;
  const pa = ((a - lo) / (hi - lo)) * 100, pb = ((b - lo) / (hi - lo)) * 100;
  return (
    <div className="fgroup">
      <h4>Prijs</h4>
      <div className="range" style={{ '--a': pa + '%', '--b': pb + '%' }}>
        <input type="range" min={lo} max={hi} value={a} aria-label="Minimumprijs" onChange={e => { const v = Math.min(+e.target.value, b - 1); set({ pmin: v === lo ? null : v }); }} />
        <input type="range" min={lo} max={hi} value={b} aria-label="Maximumprijs" onChange={e => { const v = Math.max(+e.target.value, a + 1); set({ pmax: v === hi ? null : v }); }} />
      </div>
      <div className="rangev"><span>€ {a}</span><span>€ {b}</span></div>
    </div>
  );
}

function Filters({ facets, facetLabel, brands, f, set, counts, bounds }) {
  return (
    <>
      {facets.length > 1 && (
        <div className="fgroup">
          <h4>{facetLabel}</h4>
          <ul>
            <li><button className={!f.cat ? 'on' : ''} onClick={() => set({ cat: '' })}>Alles <span>{counts.all}</span></button></li>
            {facets.map(x => <li key={x.slug}><button className={f.cat === x.slug ? 'on' : ''} onClick={() => set({ cat: f.cat === x.slug ? '' : x.slug })}>{x.name} <span>{x.count}</span></button></li>)}
          </ul>
        </div>
      )}
      {brands.length > 1 && (
        <div className="fgroup">
          <h4>Merk</h4>
          {brands.map(b => (
            <label className="check" key={b.slug}>
              <input type="checkbox" checked={f.brands.includes(b.slug)} onChange={() => set({ brands: f.brands.includes(b.slug) ? f.brands.filter(x => x !== b.slug) : [...f.brands, b.slug] })} />
              {b.name} <span className="muted" style={{ marginLeft: 'auto', fontSize: 13 }}>{b.count}</span>
            </label>
          ))}
        </div>
      )}
      <PriceRange lo={bounds[0]} hi={bounds[1]} f={f} set={set} />
      <div className="fgroup">
        <h4>Aanbod</h4>
        <label className="check"><input type="checkbox" checked={f.sale} onChange={() => set({ sale: !f.sale })} /> Alleen aanbiedingen</label>
        <label className="check"><input type="checkbox" checked={f.stock} onChange={() => set({ stock: !f.stock })} /> Alleen op voorraad</label>
      </div>
    </>
  );
}

function FilterSheet({ children, onClose, count }) {
  useEffect(() => { lock(); return () => unlock(); }, []);
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Filters">
        <div className="handle" aria-hidden="true" />
        <div className="dhead"><h2>Filteren</h2><button className="x" onClick={onClose} aria-label="Sluiten">×</button></div>
        <div className="dbody">{children}</div>
        <div className="dfoot"><button className="btn btn-primary btn-block" onClick={onClose}>Toon {count} {count === 1 ? 'product' : 'producten'}</button></div>
      </aside>
    </>
  );
}

export default function Catalog({ items, facets = [], facetLabel = 'Categorie', search = true }) {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const qRef = useRef(null);
  const [f, setF] = useState(() => ({
    q: params.get('q') || '', cat: params.get('c') || '', brands: (params.get('merk') || '').split(',').filter(Boolean),
    sale: params.get('aanbieding') === '1', stock: params.get('voorraad') === '1', sort: params.get('sort') || 'aanbevolen',
    pmin: params.get('prijs') ? +params.get('prijs').split('-')[0] || null : null, pmax: params.get('prijs') ? +params.get('prijs').split('-')[1] || null : null
  }));
  const bounds = useMemo(() => {
    if (!items.length) return [0, 0];
    return [Math.floor(Math.min(...items.map(p => p.price)) / 100), Math.ceil(Math.max(...items.map(p => p.priceMax || p.price)) / 100)];
  }, [items]);
  const [shown, setShown] = useState(PAGE);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    if (params.get('focus') === 'zoek' && qRef.current) { qRef.current.focus(); qRef.current.scrollIntoView({ block: 'center' }); }
  }, [params]);

  // Filters in de URL bijhouden (deelbaar, terugknop werkt)
  useEffect(() => {
    const sp = new URLSearchParams();
    if (f.q) sp.set('q', f.q);
    if (f.cat) sp.set('c', f.cat);
    if (f.brands.length) sp.set('merk', f.brands.join(','));
    if (f.sale) sp.set('aanbieding', '1');
    if (f.stock) sp.set('voorraad', '1');
    if (f.sort !== 'aanbevolen') sp.set('sort', f.sort);
    if (f.pmin != null || f.pmax != null) sp.set('prijs', `${f.pmin ?? ''}-${f.pmax ?? ''}`);
    const qs = sp.toString();
    const t = setTimeout(() => router.replace(qs ? `${path}?${qs}` : path, { scroll: false }), 250);
    return () => clearTimeout(t);
  }, [f, path, router]);

  const set = patch => { setF(x => ({ ...x, ...patch })); setShown(PAGE); };

  const brands = useMemo(() => {
    const m = new Map();
    for (const p of items) if (p.brand) m.set(p.brand.slug, { ...p.brand, count: (m.get(p.brand.slug)?.count || 0) + 1 });
    return [...m.values()].sort((a, b) => b.count - a.count);
  }, [items]);

  const result = useMemo(() => {
    const terms = norm(f.q).split(/\s+/).filter(Boolean);
    const facet = facets.find(x => x.slug === f.cat);
    const pidSet = facet ? new Set(facet.pids) : null;
    let r = items.filter(p => {
      if (pidSet && !pidSet.has(p.id)) return false;
      if (f.brands.length && !f.brands.includes(p.brand?.slug)) return false;
      if (f.sale && !p.onSale) return false;
      if (f.stock && !p.inStock) return false;
      if (f.pmin != null && p.price < f.pmin * 100) return false;
      if (f.pmax != null && p.price > f.pmax * 100) return false;
      if (terms.length) {
        const hay = norm(`${p.name} ${p.brand?.name || ''} ${p.cats.map(c => c.name).join(' ')} ${p.short}`);
        if (!terms.every(t => hay.includes(t))) return false;
      }
      return true;
    });
    const by = {
      'prijs-op': (a, b) => a.price - b.price,
      'prijs-af': (a, b) => b.price - a.price,
      korting: (a, b) => pct(b.price, b.regular) - pct(a.price, a.regular),
      naam: (a, b) => a.name.localeCompare(b.name, 'nl')
    }[f.sort];
    if (by) r = [...r].sort(by);
    if (!by) r = [...r].sort((a, b) => Number(b.inStock) - Number(a.inStock));
    return r;
  }, [items, facets, f]);

  const active = [
    f.cat && { k: 'cat', label: facets.find(x => x.slug === f.cat)?.name || f.cat, clear: () => set({ cat: '' }) },
    ...f.brands.map(b => ({ k: 'b' + b, label: brands.find(x => x.slug === b)?.name || b, clear: () => set({ brands: f.brands.filter(x => x !== b) }) })),
    f.sale && { k: 'sale', label: 'Aanbiedingen', clear: () => set({ sale: false }) },
    f.stock && { k: 'stock', label: 'Op voorraad', clear: () => set({ stock: false }) },
    (f.pmin != null || f.pmax != null) && { k: 'prijs', label: `€ ${f.pmin ?? bounds[0]} – € ${f.pmax ?? bounds[1]}`, clear: () => set({ pmin: null, pmax: null }) }
  ].filter(Boolean);

  const filters = <Filters facets={facets} facetLabel={facetLabel} brands={brands} f={f} set={set} counts={{ all: items.length }} bounds={bounds} />;

  return (
    <div className="shop">
      <aside className="side" aria-label="Filters">{filters}</aside>
      <div>
        {search && (
          <label className="lsearch">
            <span className="sr">Zoek in deze lijst</span>
            {Icon.search(19)}
            <input ref={qRef} id="lq" className="input" type="search" enterKeyHint="search" value={f.q} onChange={e => set({ q: e.target.value })} placeholder="Zoek bijv. zilvershampoo, föhn, curl…" autoComplete="off" />
          </label>
        )}
        <div className="toolbar">
          <span className="count">{result.length} {result.length === 1 ? 'product' : 'producten'}{f.q && <> voor “{f.q}”</>}</span>
          <div className="btns" style={{ display: 'flex', gap: 8 }}>
            <button className="chip filterbtn" onClick={() => setSheet(true)}>{Icon.filter()} Filteren{active.length > 0 && ` (${active.length})`}</button>
            <label className="sr" htmlFor="sort">Sorteren</label>
            <select id="sort" value={f.sort} onChange={e => set({ sort: e.target.value })}>
              {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>
        {active.length > 0 && (
          <div className="chips active" style={{ marginBottom: 16 }}>
            {active.map(a => <button key={a.k} className="chip on" onClick={a.clear}>{a.label} <span className="x">×</span></button>)}
            <button className="chip" onClick={() => set({ cat: '', brands: [], sale: false, stock: false, pmin: null, pmax: null })}>Wis alles</button>
          </div>
        )}
        {result.length === 0 ? (
          <div className="empty">
            <h3>Geen producten gevonden</h3>
            <p>Probeer een ander zoekwoord of minder filters.</p>
            <button className="btn btn-line" onClick={() => set({ q: '', cat: '', brands: [], sale: false, stock: false, pmin: null, pmax: null })}>Toon alles</button>
          </div>
        ) : (
          <>
            <div className="grid">{result.slice(0, shown).map((p, i) => <ProductCard key={p.id} p={p} eager={i < 4} />)}</div>
            {shown < result.length && (
              <div className="morebtn"><button className="btn btn-line" onClick={() => setShown(s => s + PAGE)}>Meer laden ({result.length - shown})</button></div>
            )}
          </>
        )}
      </div>
      {sheet && <FilterSheet onClose={() => setSheet(false)} count={result.length}>{filters}</FilterSheet>}
    </div>
  );
}
