'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { lock, unlock } from '@/lib/lock';
import { eur, pct } from '@/lib/format';
import { useShop } from './ShopProvider';
import { Icon, PImg, Price, Qty, Stars } from './ui';

export default function QuickView({ p, onClose }) {
  const { add, isWish, toggleWish } = useShop();
  const first = p.options?.find(o => o.inStock) || p.options?.[0];
  const [optId, setOptId] = useState(first?.id || 0);
  const [q, setQ] = useState(1);
  useEffect(() => {
    lock();
    const k = e => e.key === 'Escape' && onClose();
    addEventListener('keydown', k);
    return () => { unlock(); removeEventListener('keydown', k); };
  }, [onClose]);
  const opt = p.options?.find(o => o.id === optId) || null;
  const price = opt ? opt.price : p.price, regular = opt ? opt.regular : p.regular, inStock = opt ? opt.inStock : p.inStock;
  const img = (opt?.image || p.images[0]);
  const onAdd = () => {
    add({ pid: p.id, oid: opt?.id || 0, slug: p.slug, name: p.name, opt: opt?.label || '', price, regular, img: img?.thumb }, q);
    onClose();
  };
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="qv" role="dialog" aria-modal="true" aria-label={p.name}>
        <div className="handle" aria-hidden="true" />
        <button className="x qv-x" onClick={onClose} aria-label="Sluiten">×</button>
        <div className="qv-img"><PImg src={img?.src || img?.thumb} alt={p.name} eager />{pct(price, regular) > 0 && <span className="badge sale" style={{ position: 'absolute', top: 14, left: 14 }}>−{pct(price, regular)}%</span>}</div>
        <div className="qv-info">
          {p.brand && <span className="brand">{p.brand.name}</span>}
          <h2>{p.name}</h2>
          {p.reviews > 0 && <Stars value={p.rating} count={p.reviews} />}
          <Price price={price} regular={regular} />
          {p.short && <p className="short">{p.short.length > 220 ? p.short.slice(0, 220).replace(/\s\S*$/, '') + '…' : p.short}</p>}
          {p.options && (
            <>
              <div className="optlabel">{p.attrName}: <b>{opt?.label}</b></div>
              <div className="opts" role="radiogroup" aria-label={p.attrName}>
                {p.options.map(o => (
                  <button key={o.id} role="radio" aria-checked={o.id === optId} className={`opt ${o.id === optId ? 'on' : ''} ${o.inStock ? '' : 'oos'}`} onClick={() => setOptId(o.id)}>{o.label}</button>
                ))}
              </div>
            </>
          )}
          <div className={`stock ${inStock ? '' : 'no'}`}><i />{inStock ? 'Op voorraad' : 'Tijdelijk uitverkocht'}</div>
          <div className="qv-buy">
            <Qty value={q} onChange={v => setQ(Math.max(1, v))} />
            <button className="btn btn-primary" onClick={onAdd} disabled={!inStock}>{Icon.bag(19)} {inStock ? `In winkelmand · ${eur(price * q)}` : 'Uitverkocht'}</button>
            <button className={`iconbtn wishbtn ${isWish(p.id) ? 'on' : ''}`} onClick={() => toggleWish(p)} aria-label="Op verlanglijst" aria-pressed={isWish(p.id)}>{Icon.heart(21)}</button>
          </div>
          <Link href={`/product/${p.slug}`} className="qv-more" onClick={onClose}>Bekijk alle productinformatie →</Link>
        </div>
      </div>
    </>
  );
}
