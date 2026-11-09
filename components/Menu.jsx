'use client';
import { useEffect, useMemo, useState } from 'react';
import { CATEGORIES } from '@/lib/menu';
import { useShop } from './ShopProvider';
import ProductCard from './ProductCard';

export default function Menu() {
  const { query, setQuery } = useShop();
  const [active, setActive] = useState(CATEGORIES[0].slug);
  const q = query.trim().toLowerCase();
  const cats = useMemo(() => CATEGORIES.map(c => ({ ...c, items: c.items.filter(p => !q || `${p.n} ${p.d || ''} ${(p.v || []).map(o => o[0]).join(' ')} ${c.name}`.toLowerCase().includes(q)) })).filter(c => c.items.length), [q]);
  const total = cats.reduce((a, c) => a + c.items.length, 0);

  useEffect(() => {
    const els = cats.map(c => document.getElementById(`c-${c.slug}`)).filter(Boolean);
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id.slice(2))), { rootMargin: '-45% 0px -50% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [cats]);

  const go = s => document.getElementById(`c-${s}`)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="menu" style={{ scrollMarginTop: 120, paddingTop: 12 }}>
      <div className="wrap">
        <div className="shead"><h2>Menu</h2><span className="muted" style={{ fontSize: 14 }}>{q ? `${total} resultaten voor “${query}”` : `${total} gerechten & drankjes`}</span></div>
        <div className="menubar">
          <div className="chips" role="tablist" aria-label="Categorieën">
            {cats.map(c => (
              <button key={c.slug} role="tab" aria-selected={active === c.slug} className={`chip ${active === c.slug ? 'on' : ''}`} onClick={() => go(c.slug)}>
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
