'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CATEGORIES } from '@/lib/menu';
import { useShop } from './ShopProvider';
import ProductCard from './ProductCard';

export default function Menu() {
  const { query, setQuery } = useShop();
  const [active, setActive] = useState(CATEGORIES[0].slug);
  const chipsRef = useRef(null);
  const q = query.trim().toLowerCase();
  const cats = useMemo(() => CATEGORIES.map(c => ({ ...c, items: c.items.filter(p => !q || `${p.n} ${p.d || ''} ${(p.v || []).map(o => o[0]).join(' ')} ${c.name}`.toLowerCase().includes(q)) })).filter(c => c.items.length), [q]);
  const total = cats.reduce((a, c) => a + c.items.length, 0);

  useEffect(() => {
    const els = cats.map(c => document.getElementById(`c-${c.slug}`)).filter(Boolean);
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id.slice(2))), { rootMargin: '-45% 0px -50% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [cats]);

  useEffect(() => {
    const box = chipsRef.current; const el = box?.querySelector(`[data-s="${active}"]`);
    if (box && el) box.scrollTo({ left: el.offsetLeft - 16, behavior: 'smooth' });
  }, [active]);

  const go = s => document.getElementById(`c-${s}`)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="menu" style={{ scrollMarginTop: 120, paddingTop: 12 }}>
      <div className="wrap">
        <div className="shead"><h2>Menu</h2><span className="muted" style={{ fontSize: 14 }}>{q ? `${total} resultaten voor “${query}”` : `${total} gerechten & drankjes`}</span></div>
        <div className="menubar">
          <label className="msearch">
            <span className="sr">Zoek in het menu</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c655c" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input id="msearch" className="input" type="search" enterKeyHint="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Zoek roti, bara, dawet…" autoComplete="off" />
            {query && <button type="button" className="clr" onClick={() => setQuery('')} aria-label="Wissen">×</button>}
          </label>
          <div className="chips" ref={chipsRef} role="tablist" aria-label="Categorieën">
            {cats.map(c => (
              <button key={c.slug} data-s={c.slug} role="tab" aria-selected={active === c.slug} className={`chip ${active === c.slug ? 'on' : ''}`} onClick={() => go(c.slug)}>
                {c.name} <span style={{ opacity: .6, fontWeight: 400 }}>{c.items.length}</span>
              </button>
            ))}
          </div>
        </div>
        {cats.length === 0 ? (
          <div className="empty" style={{ marginTop: 16 }}>
            <h3>Niets gevonden voor “{query}”</h3>
            <p>Probeer een ander woord, of bekijk het hele menu.</p>
            <button className="btn btn-line" onClick={() => setQuery('')}>Toon alles</button>
          </div>
        ) : cats.map(c => (
          <div key={c.slug}>
            <div className="cathead" id={`c-${c.slug}`}><h2>{c.name}</h2><span>{c.items.length}</span></div>
            <div className="grid">{c.items.map(p => <ProductCard key={p.slug} p={p} />)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
