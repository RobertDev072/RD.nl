'use client';
import { useState } from 'react';
import { img } from '@/lib/menu';

export function ProductImg({ p, w = 500, className }) {
  const [err, setErr] = useState(false);
  if (!p.i || err) return <div className={`noimg ${className || ''}`}><div><img src="/logo.webp" alt="" />{w > 200 && <span>Foto volgt</span>}</div></div>;
  return <img className={className} src={img(p.i, w)} alt={p.n} loading="lazy" onError={() => setErr(true)} />;
}

export function Qty({ value, onChange, small, green }) {
  return (
    <div className={`qty ${small ? 'sm' : ''} ${green ? 'green' : ''}`}>
      <button type="button" onClick={() => onChange(value - 1)} aria-label="Minder">−</button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} aria-label="Meer">+</button>
    </div>
  );
}

export const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 7h15l-1.6 8.5a2 2 0 0 1-2 1.5H9a2 2 0 0 1-2-1.6L5 4H2" /><circle cx="9.5" cy="20.5" r="1" /><circle cx="17" cy="20.5" r="1" /></svg>
);

export function Steps({ at }) {
  const S = ['Winkelmand', 'Gegevens', 'Betalen', 'Klaar'];
  return <ol className="steps">{S.map((s, i) => <li key={s} className={i < at ? 'done' : i === at ? 'on' : ''}>{i + 1}. {s}</li>)}</ol>;
}


export function SafeImg({ src, alt = '', ...rest }) {
  const [err, setErr] = useState(false);
  if (err) return <div className="noimg" style={{ aspectRatio: '1' }}><img src="/logo.webp" alt="" /></div>;
  return <img src={src} alt={alt} onError={() => setErr(true)} {...rest} />;
}
