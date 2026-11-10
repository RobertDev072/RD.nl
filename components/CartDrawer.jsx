'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { lock, unlock } from '@/lib/lock';
import { eur, SHIPPING } from '@/lib/format';
import { useShop } from './ShopProvider';
import { PImg, Qty } from './ui';

export default function CartDrawer({ onClose }) {
  const { cart, count, subtotal, savings, setQty, remove } = useShop();
  const router = useRouter();
  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    addEventListener('keydown', k);
    lock();
    return () => { removeEventListener('keydown', k); unlock(); };
  }, [onClose]);
  const free = SHIPPING.NL.free;
  const left = Math.max(0, free - subtotal);
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Winkelmand">
        <div className="handle" aria-hidden="true" />
        <div className="dhead"><h2>Winkelmand {count > 0 && <span className="muted" style={{ fontSize: 18, fontFamily: 'var(--sans)', fontWeight: 400 }}>({count})</span>}</h2><button className="x" onClick={onClose} aria-label="Sluiten">×</button></div>
        <div className="dbody">
          {cart.length === 0 ? (
            <div className="empty" style={{ marginTop: 20 }}>
              <h3>Je winkelmand is nog leeg</h3>
              <p>Ontdek onze professionele haarverzorging.</p>
              <button className="btn btn-primary" onClick={() => { onClose(); router.push('/shop'); }}>Naar de shop</button>
            </div>
          ) : cart.map(l => (
            <div className="line" key={l.k}>
              <Link href={`/product/${l.slug}`} className="li" onClick={onClose}><PImg src={l.img} alt="" /></Link>
              <div>
                <Link href={`/product/${l.slug}`} className="nm" onClick={onClose}>{l.name}</Link>
                <div className="sub">{l.opt ? `${l.opt} · ` : ''}{eur(l.price)} per stuk</div>
                <div className="ctr"><Qty small value={l.q} onChange={q => setQty(l.k, q)} /><button className="rm" onClick={() => remove(l.k)}>Verwijderen</button></div>
              </div>
              <div className="lt">{eur(l.price * l.q)}{l.regular > l.price && <s>{eur(l.regular * l.q)}</s>}</div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="dfoot">
            {left > 0 ? (
              <div className="note plum" style={{ marginTop: 0 }}>Nog <b>{eur(left)}</b> tot <b>gratis verzending</b> in Nederland
                <div className="bar"><i style={{ width: `${Math.min(100, subtotal / free * 100)}%` }} /></div></div>
            ) : <div className="note ok" style={{ marginTop: 0 }}>Je bestelling wordt <b>gratis verzonden</b> (NL).</div>}
            <div className="row"><span>Subtotaal</span><span>{eur(subtotal)}</span></div>
            {savings > 0 && <div className="row" style={{ color: 'var(--sale)' }}><span>Je bespaart</span><span>−{eur(savings)}</span></div>}
            <div className="row muted"><span>Verzending</span><span>{left > 0 ? 'vanaf ' + eur(SHIPPING.NL.cost) : 'Gratis'}</span></div>
            <button className="btn btn-primary btn-block" style={{ marginTop: 12 }} onClick={() => { onClose(); router.push('/afrekenen'); }}>Afrekenen · {eur(subtotal)}</button>
            <button className="btn btn-line btn-block" style={{ marginTop: 8 }} onClick={onClose}>Verder winkelen</button>
          </div>
        )}
      </aside>
    </>
  );
}
