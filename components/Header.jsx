'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CATS, SITE } from '@/lib/data';
import { useShop } from './ShopProvider';
import { Icon } from './icons';
import { lock, unlock } from '@/lib/lock';
export default function Header() {
  const { count, openCart, wish } = useShop(); const [m, setM] = useState(false); const path = usePathname();
  useEffect(() => setM(false), [path]);
  useEffect(() => { if (m) { lock(); return unlock; } }, [m]);
  return (
    <>
      <div className="concept">Concept-webshop · voorbeeldproducten & demo-betaling</div>
      <div className="topbar"><span>{Icon.truck(15)} Gratis verzending vanaf € 75</span><span className="hide-s">{Icon.return(15)} 14 dagen bedenktijd</span><span className="hide-s">{Icon.pin(15)} Boetiek in {SITE.place}</span></div>
      <header className="hdr">
        <div className="wrap hdr-in">
          <button className="ib only-m" onClick={() => setM(true)} aria-label="Menu">{Icon.menu(24)}</button>
          <Link href="/" className="logo" aria-label="BellaMina home">Bella<em>Mina</em></Link>
          <nav className="nav">
            <Link href="/shop">Shop alles</Link>
            {CATS.slice(0, 4).map(c => <Link key={c.slug} href={`/shop?cat=${c.slug}`}>{c.name}</Link>)}
            <Link href="/over">Over ons</Link>
          </nav>
          <div className="hdr-r">
            <Link href="/shop?wish=1" className="ib hide-s" aria-label="Favorieten">{Icon.heart(22)}{wish.length > 0 && <i className="badge">{wish.length}</i>}</Link>
            <button className="ib" onClick={openCart} aria-label="Winkelmand">{Icon.bag(23)}{count > 0 && <i className="badge">{count}</i>}</button>
          </div>
        </div>
      </header>
      {m && (
        <div className="sheet-bg" onClick={() => setM(false)}>
          <aside className="side" onClick={e => e.stopPropagation()}>
            <div className="side-h"><span className="logo">Bella<em>Mina</em></span><button className="ib" onClick={() => setM(false)} aria-label="Sluiten">{Icon.x(24)}</button></div>
            <Link href="/shop" className="side-l">Shop alles {Icon.arrow(18)}</Link>
            {CATS.map(c => <Link key={c.slug} href={`/shop?cat=${c.slug}`} className="side-l">{c.name} {Icon.arrow(18)}</Link>)}
            <Link href="/over" className="side-l">Over BellaMina {Icon.arrow(18)}</Link>
            <div className="side-f">
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn btn-dark btn-block">{Icon.chat(18)} WhatsApp ons</a>
              <p className="muted small">{SITE.street}, {SITE.city}</p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
