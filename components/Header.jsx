'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { lock, unlock } from '@/lib/lock';
import { SITE } from '@/lib/data';
import Logo from './Logo';
import { useShop } from './ShopProvider';
import { Icon } from './ui';

const LINKS = [['/behandelingen', 'Behandelingen'], ['/prijzen', 'Prijzen 2026'], ['/biab', 'BIAB'], ['/impressie', 'Impressie'], ['/cadeaubon', 'Cadeaubon'], ['/reviews', 'Reviews'], ['/contact', 'Contact']];

function Menu({ onClose }) {
  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    addEventListener('keydown', k); lock();
    return () => { removeEventListener('keydown', k); unlock(); };
  }, [onClose]);
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer left dark" role="dialog" aria-modal="true" aria-label="Menu">
        <div className="dhead"><Logo h={40} /><button className="x" onClick={onClose} aria-label="Sluiten">×</button></div>
        <div className="dbody">
          <nav className="mnav" onClick={e => e.target.closest('a') && onClose()}>
            <Link href="/">Home</Link>
            {LINKS.map(([h, l]) => <Link key={h} href={h}>{l}</Link>)}
          </nav>
          <div className="mfoot">
            <Link href="/behandelingen" className="btn btn-gold btn-block" onClick={onClose}>{Icon.cal(18)} Boek je afspraak</Link>
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn btn-ghost btn-block">{Icon.chat(18)} WhatsApp {SITE.phone}</a>
            <div className="msoc"><a href={SITE.instagram} target="_blank" rel="noopener" aria-label="Instagram">{Icon.insta()}</a><a href={SITE.facebook} target="_blank" rel="noopener" aria-label="Facebook">{Icon.fb()}</a></div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function Header() {
  const { count, openCart } = useShop();
  const [menu, setMenu] = useState(false);
  const [solid, setSolid] = useState(false);
  const path = usePathname();
  const close = useCallback(() => setMenu(false), []);
  useEffect(() => { setMenu(false); }, [path]);
  useEffect(() => {
    const f = () => setSolid(scrollY > 10);
    f(); addEventListener('scroll', f, { passive: true });
    return () => removeEventListener('scroll', f);
  }, []);
  return (
    <>
      <div className="concept"><b>Ontwerpvoorstel</b> van <a href="https://lorvex.nl" target="_blank" rel="noopener">Lorvex</a> voor House of Nails · preview, boekingen en betalingen worden niet verwerkt</div>
      <header className={`header ${solid ? 'solid' : ''}`}>
        <div className="wrap hrow">
          <button className="iconbtn menubtn" onClick={() => setMenu(true)} aria-label="Menu openen">{Icon.menu()}</button>
          <nav className="hnav" aria-label="Hoofdmenu">
            {LINKS.slice(0, 4).map(([h, l]) => <Link key={h} href={h} className={path.startsWith(h) ? 'on' : ''}>{l}</Link>)}
          </nav>
          <Link href="/" className="hlogo" aria-label="House of Nails home"><Logo h={52} priority /></Link>
          <div className="hright">
            <nav className="hnav r" aria-label="Meer">
              {LINKS.slice(4).map(([h, l]) => <Link key={h} href={h} className={path.startsWith(h) ? 'on' : ''}>{l}</Link>)}
            </nav>
            <div className="hicons">
              <Link href="/behandelingen" className="btn btn-gold hbook">Boek nu</Link>
              <button className="iconbtn" onClick={openCart} aria-label={`Jouw selectie, ${count} items`}>{Icon.bag()}{count > 0 && <span className="n">{count}</span>}</button>
            </div>
          </div>
        </div>
      </header>
      {menu && <Menu onClose={close} />}
    </>
  );
}
