'use client';
import { useState } from 'react';

import { Icon } from './icons';
export { Icon };

export function Img({ src, alt = '', className, eager }) {
  const [err, setErr] = useState(false);
  if (!src || err) return <span className={`ph ${className || ''}`} aria-hidden="true"><span>House of Nails</span></span>;
  return <img className={className} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setErr(true)} />;
}

export function Qty({ value, onChange, max = 10 }) {
  return (
    <div className="qty">
      <button type="button" onClick={() => onChange(value - 1)} aria-label="Minder">−</button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} aria-label="Meer">+</button>
    </div>
  );
}

export function Steps({ at, labels }) {
  return <ol className="steps">{labels.map((s, i) => <li key={s} className={i < at ? 'done' : i === at ? 'on' : ''}>{i + 1}. {s}</li>)}</ol>;
}
