'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { useShop } from './ShopProvider';
import { Icon, Img } from './icons';
import { eur } from '@/lib/format';
import { im, SHIP_FREE } from '@/lib/data';
import { lock, unlock } from '@/lib/lock';
export default function CartDrawer() {
  const { open, closeCart, lines, sub, ship, total, setQ, toast } = useShop();
  useEffect(() => { if (open) { lock(); const k = e => e.key === 'Escape' && closeCart(); addEventListener('keydown', k); return () => { unlock(); removeEventListener('keydown', k); }; } }, [open, closeCart]);
  const left = SHIP_FREE - sub;
  return (
    <>
      {toast && !open && <div className="toast">{Icon.check()} <span><b>{toast}</b> zit in je tas</span><button onClick={() => document.querySelector('.hdr .ib[aria-label=Winkelmand]')?.click()}>Bekijk</button></div>}
      {open && (
        <div className="sheet-bg" onClick={closeCart}>
          <aside className="cart" onClick={e => e.stopPropagation()} role="dialog" aria-label="Winkeltas">
            <div className="cart-h"><h2>Je tas</h2><button className="ib" onClick={closeCart} aria-label="Sluiten">{Icon.x(24)}</button></div>
            {lines.length === 0 ? (
              <div className="empty"><p>Je tas is nog leeg.</p><Link href="/shop" className="btn btn-dark" onClick={closeCart}>Ontdek de collectie</Link></div>
            ) : (
              <>
                <div className="freebar"><p>{left > 0 ? <>Nog <b>{eur(left)}</b> tot gratis verzending</> : <>Je bestelling wordt <b>gratis verzonden</b></>}</p><span><i style={{ width: `${Math.min(100, sub / SHIP_FREE * 100)}%` }} /></span></div>
                <div className="cart-l">
                  {lines.map(l => (
                    <div className="cl" key={l.k}>
                      <Link href={`/product/${l.slug}`} onClick={closeCart}><Img src={im(l.p.imgs[0])} alt="" /></Link>
                      <div><b>{l.p.name}</b><small>{l.colorLabel} · {l.size}</small>
                        <div className="qty"><button onClick={() => setQ(l.k, l.q - 1)} aria-label="Minder">{Icon.minus(15)}</button><span>{l.q}</span><button onClick={() => setQ(l.k, l.q + 1)} aria-label="Meer">{Icon.plus(15)}</button></div>
                      </div>
                      <span className="pr">{eur(l.p.price * l.q)}</span>
                    </div>
                  ))}
                </div>
                <div className="cart-f">
                  <div className="row"><span>Subtotaal</span><span>{eur(sub)}</span></div>
                  <div className="row"><span>Verzending</span><span>{ship ? eur(ship) : 'Gratis'}</span></div>
                  <div className="row tot"><span>Totaal</span><span>{eur(total)}</span></div>
                  <Link href="/afrekenen" className="btn btn-dark btn-block big" onClick={closeCart}>{Icon.lock(18)} Afrekenen</Link>
                  <p className="paylogos"><span className="ideal">iDEAL</span><span>Wero</span><span>Bancontact</span><span>Klarna</span></p>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
