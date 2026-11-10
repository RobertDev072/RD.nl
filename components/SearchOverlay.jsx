'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { lock, unlock } from '@/lib/lock';
import { searchIndex, POPULAR } from '@/lib/search';
import { useShop } from './ShopProvider';
import { Icon, PImg, Price } from './ui';

export function Suggestions({ results, q, onPick, cats = [] }) {
  if (!q) return null;
  return (
    <div className="sugg">
      {cats.length > 0 && <div className="sugg-cats">{cats.map(c => <Link key={c.slug} href={`/categorie/${c.slug}`} className="chip" onClick={onPick}>{c.name}</Link>)}</div>}
      {results.length === 0 ? <p className="muted" style={{ padding: '14px 4px' }}>Geen producten gevonden voor “{q}”.</p> : (
        <ul>
          {results.map(p => (
            <li key={p.id}>
              <Link href={`/product/${p.slug}`} onClick={onPick}>
                <span className="si"><PImg src={p.thumb} alt="" /></span>
                <span className="sn"><small>{p.brand}</small>{p.name}</span>
                <Price price={p.price} regular={p.regular > p.price ? p.regular : 0} />
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link href={`/shop?q=${encodeURIComponent(q)}`} className="sugg-all" onClick={onPick}>Toon alle resultaten voor “{q}” →</Link>
    </div>
  );
}

export function useCatMatches(q, nav) {
  return useMemo(() => {
    if (!q || q.length < 2 || !nav) return [];
    const n = q.toLowerCase();
    const all = nav.tops.flatMap(t => [{ slug: t.slug, name: t.label }, ...t.children]);
    return all.filter(c => c.name.toLowerCase().includes(n)).slice(0, 4);
  }, [q, nav]);
}

export default function SearchOverlay({ onClose }) {
  const { index } = useShop();
  const [q, setQ] = useState('');
  const ref = useRef(null);
  const router = useRouter();
  useEffect(() => {
    lock(); ref.current?.focus();
    const k = e => e.key === 'Escape' && onClose();
    addEventListener('keydown', k);
    return () => { unlock(); removeEventListener('keydown', k); };
  }, [onClose]);
  const results = useMemo(() => searchIndex(index, q, 8), [index, q]);
  const go = e => { e.preventDefault(); if (!q.trim()) return; onClose(); router.push(`/shop?q=${encodeURIComponent(q.trim())}`); };

  return (
    <div className="sov" role="dialog" aria-modal="true" aria-label="Zoeken">
      <form className="sov-bar" onSubmit={go} role="search">
        {Icon.search(20)}
        <input ref={ref} className="input" type="search" enterKeyHint="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Zoek een product of merk…" autoComplete="off" aria-label="Zoeken" />
        <button type="button" className="sov-x" onClick={onClose}>Sluiten</button>
      </form>
      <div className="sov-body">
        {!q && (
          <>
            <h4 className="sov-h">Populair</h4>
            <div className="chips">{POPULAR.map(t => <button key={t} className="chip" onClick={() => setQ(t)}>{t}</button>)}</div>
          </>
        )}
        <Suggestions results={results} q={q.trim()} onPick={onClose} />
      </div>
    </div>
  );
}
