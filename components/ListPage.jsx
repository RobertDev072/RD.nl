import { Suspense } from 'react';
import Link from 'next/link';
import Catalog from './Catalog';

export default function ListPage({ crumbs = [], eyebrow, title, intro, items, facets, facetLabel, children }) {
  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Kruimelpad">
        <Link href="/">Home</Link>
        {crumbs.map((c, i) => <span key={c.href || i}>/ {i < crumbs.length - 1 ? <Link href={c.href}>{c.name}</Link> : c.name}</span>)}
      </nav>
      <div className="listhead">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 style={{ fontSize: 'clamp(32px,4vw,48px)' }}>{title}</h1>
        {intro && <p>{intro}</p>}
        {children}
      </div>
      <Suspense fallback={<div style={{ minHeight: 600 }} />}>
        <Catalog items={items} facets={facets} facetLabel={facetLabel} />
      </Suspense>
    </div>
  );
}
