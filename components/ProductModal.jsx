'use client';
import { useEffect, useState } from 'react';
import { bySlug, eur, unitPrice, WA } from '@/lib/menu';
import { useShop } from './ShopProvider';
import { ProductImg, Qty } from './ui';

export default function ProductModal({ slug, onClose }) {
  const p = bySlug(slug);
  const { add } = useShop();
  const [opt, setOpt] = useState(p.v ? p.v[0][0] : '');
  const [q, setQ] = useState(1);
  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [onClose]);
  const price = unitPrice(p, opt);
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true" aria-label={p.n}>
        <div className="pd">
          <div className="pimg"><ProductImg p={p} w={900} /></div>
          <div className="info2">
            <button className="x" onClick={onClose} aria-label="Sluiten">×</button>
            <span className="muted" style={{ fontSize: 14 }}>{p.cat}</span>
            <h2>{p.n}</h2>
            <div className="price">{eur(price)}</div>
            {p.d && <p>{p.d}</p>}
            {p.v && (
              <div style={{ marginTop: 16 }}>
                <span className="label">Kies je optie</span>
                <div className="opts" role="radiogroup">
                  {p.v.map(([o, pr]) => (
                    <button key={o} role="radio" aria-checked={opt === o} className={`opt ${opt === o ? 'on' : ''}`} onClick={() => setOpt(o)}>
                      {o}<small>{eur(pr)}</small>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="buy">
              <Qty value={q} onChange={v => setQ(Math.max(1, Math.min(20, v)))} />
              <button className="btn btn-red" onClick={() => { add(p.slug, opt, q); onClose(); }}>
                Toevoegen · {eur(price * q)}
              </button>
            </div>
            <dl className="facts">
              <div><dt>Beschikbaar</dt><dd>{p.pre ? 'Minimaal 24 uur van tevoren bestellen.' : 'Vrijdag t/m zondag, 11:00–22:00.'}</dd></div>
              <div><dt>Allergenen</dt><dd>Heb je een allergie of dieetwens? Vraag het ons via <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener">WhatsApp</a> voordat je bestelt.</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
