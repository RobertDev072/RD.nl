'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { eur, MIN_ORDER } from '@/lib/menu';
import { useShop } from './ShopProvider';
import { ProductImg, Qty } from './ui';

export default function CartDrawer({ onClose }) {
  const { lines, subtotal, setQty, remove, count } = useShop();
  const router = useRouter();
  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [onClose]);
  const left = Math.max(0, MIN_ORDER - subtotal);
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Winkelmand">
        <div className="dhead"><h2>Winkelmand {count > 0 && <span className="muted" style={{ fontSize: 15, fontWeight: 400 }}>({count})</span>}</h2><button className="x" onClick={onClose} aria-label="Sluiten">×</button></div>
        <div className="dbody">
          {lines.length === 0 ? (
            <div className="empty" style={{ marginTop: 18 }}>
              <h3>Je winkelmand is nog leeg</h3>
              <p>Kies iets lekkers uit het menu.</p>
              <button className="btn btn-green" onClick={onClose}>Naar het menu</button>
            </div>
          ) : lines.map(l => (
            <div className="line" key={l.k}>
              <ProductImg p={l.p} w={160} />
              <div>
                <div className="nm">{l.p.n}</div>
                <div className="sub">{l.o ? `${l.o} · ` : ''}{eur(l.u)} per stuk</div>
                <div className="ctr"><Qty small value={l.q} onChange={q => setQty(l.k, q)} /><button className="rm" onClick={() => remove(l.k)}>Verwijderen</button></div>
              </div>
              <div className="lt">{eur(l.t)}</div>
            </div>
          ))}
        </div>
        {lines.length > 0 && (
          <div className="dfoot">
            <div className="row"><span>Subtotaal</span><span>{eur(subtotal)}</span></div>
            <div className="row muted"><span>Bezorgkosten</span><span>vanaf €5,00</span></div>
            {left > 0 ? (
              <div className="note warn">Nog <b>{eur(left)}</b> tot de minimale bestelling van €30 voor bezorging. Afhalen kan altijd.
                <div className="bar"><i style={{ width: `${Math.min(100, subtotal / MIN_ORDER * 100)}%` }} /></div></div>
            ) : <div className="note ok">Je bestelling kan bezorgd worden.</div>}
            <button className="btn btn-red btn-block" onClick={() => { onClose(); router.push('/afrekenen'); }}>Afrekenen · {eur(subtotal)}</button>
            <button className="btn btn-line btn-block" style={{ marginTop: 8 }} onClick={onClose}>Verder winkelen</button>
          </div>
        )}
      </aside>
    </>
  );
}
