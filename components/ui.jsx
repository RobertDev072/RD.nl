'use client';
import { useEffect, useState } from 'react';
import { eur } from '@/lib/format';

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
export const Icon = {
  bag: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>,
  search: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>,
  menu: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10" /></svg>,
  home: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></svg>,
  grid: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></svg>,
  plus: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} strokeWidth="2.2" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>,
  truck: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.5" /><circle cx="17" cy="17.5" r="1.5" /></svg>,
  clock: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  heart: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>,
  lock: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>,
  check: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} strokeWidth="2.2" aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>,
  filter: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" /></svg>,
  scissors: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12" /></svg>,
  card: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18" /></svg>,
  return: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M9 14 4 9l5-5" /><path d="M4 9h11a5 5 0 0 1 0 10h-3" /></svg>,
  eye: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>,
  chat: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12z" /></svg>,
  mail: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>,
  arrow: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>,
  left: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>,
  right: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>,
  star: (s = 14, fill = 'currentColor') => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" /></svg>
};

export function PImg({ src, alt = '', className, eager }) {
  const [err, setErr] = useState(false);
  if (!src || err) return <span className={`ph ${className || ''}`}><span>JeHaarwinkel</span></span>;
  return <img className={className} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setErr(true)} />;
}

export function Price({ price, regular, from, className = '' }) {
  const on = regular > price;
  return (
    <span className={`price ${on ? 'on' : ''} ${className}`}>
      {from && <small>vanaf</small>}
      {eur(price)}
      {on && <s>{eur(regular)}</s>}
    </span>
  );
}

export function Stars({ value = 0, count, small }) {
  const v = Math.round(value * 2) / 2;
  return (
    <span className={`stars ${small ? 'sm' : ''}`} aria-label={`Gewaardeerd ${value.toFixed(1).replace('.', ',')} uit 5`}>
      {[1, 2, 3, 4, 5].map(i => <span key={i} className={i <= v ? 'f' : 'e'}>{Icon.star(small ? 12 : 15)}</span>)}
      {count != null && <small>({count})</small>}
    </span>
  );
}

export function Qty({ value, onChange, small, max = 20 }) {
  return (
    <div className={`qty ${small ? 'sm' : ''}`}>
      <button type="button" onClick={() => onChange(value - 1)} aria-label="Minder">−</button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} aria-label="Meer">+</button>
    </div>
  );
}

export function Steps({ at }) {
  const L = ['Winkelmand', 'Gegevens', 'Betalen', 'Klaar'];
  return <ol className="steps">{L.map((s, i) => <li key={s} className={i < at ? 'done' : i === at ? 'on' : ''}>{i + 1}. {s}</li>)}</ol>;
}

// "Voor 16:00 besteld, vandaag verzonden" met aftelklok (werkdagen)
export function ShipCountdown() {
  const [t, setT] = useState(null);
  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const day = now.getDay();
      const cut = new Date(now); cut.setHours(16, 0, 0, 0);
      if (day >= 1 && day <= 5 && now < cut) {
        const m = Math.floor((cut - now) / 60000);
        setT({ today: true, h: Math.floor(m / 60), m: m % 60 });
      } else setT({ today: false, next: day === 5 || day === 6 ? 'maandag' : 'morgen' });
    };
    calc();
    const i = setInterval(calc, 30000);
    return () => clearInterval(i);
  }, []);
  if (!t) return <span>Voor 16:00 besteld, zelfde werkdag verzonden</span>;
  return t.today
    ? <span>Bestel binnen <b>{t.h > 0 ? `${t.h} uur en ` : ''}{t.m} min</b> en we versturen het <b>vandaag</b></span>
    : <span>Nu besteld, <b>{t.next}</b> verzonden met PostNL</span>;
}

export const PayLogos = () => (
  <div className="paylogos" aria-label="Betaalmethodes">
    <span>iDEAL | Wero</span><span>Visa</span><span>Mastercard</span><span>Klarna</span><span>Bancontact</span>
  </div>
);
