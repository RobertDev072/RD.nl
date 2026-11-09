'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useShop } from './ShopProvider';
import { CartIcon } from './ui';

export default function Header() {
  const { count, query, setQuery, openCart } = useShop();
  const path = usePathname();
  const router = useRouter();
  const onSearch = v => {
    setQuery(v);
    if (path !== '/') router.push('/#menu');
    else document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <>
      <div className="concept">Ontwerpvoorstel (preview) voor Hewitt &amp; Hewitt · gemaakt door <a href="https://lorvex.nl" target="_blank" rel="noopener">Lorvex</a></div>
      <div className="topbar"><div className="wrap">
        <span><span className="dot" />Bezorging vrijdag t/m zondag 11:00–22:00 · minimaal €30</span>
        <span className="hide-m">Vragen? Bel of app <a href="tel:+31621262725">06-21262725</a></span>
      </div></div>
      <header className="header">
        <div className="wrap hrow">
          <Link href="/" className="logo" aria-label="Hewitt & Hewitt home">
            <img src="/logo.webp" alt="" width="50" height="48" />
            <span><b>Hewitt &amp; Hewitt</b><small>Authentic Surinamese Food</small></span>
          </Link>
          {path === '/' && (
            <label className="search">
              <span className="sr">Zoek in het menu</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c655c" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              <input id="hsearch" className="input" type="search" enterKeyHint="search" value={query} onChange={e => onSearch(e.target.value)} placeholder="Zoek roti, bara, dawet…" autoComplete="off" />
            </label>
          )}
          <nav className="hnav" aria-label="Hoofdmenu">
            <Link href="/#menu">Menu</Link>
            <Link href="/#bezorging">Bezorging</Link>
            <Link href="/#over-ons">Over ons</Link>
          </nav>
          <button className="cartbtn" onClick={openCart} aria-label={`Winkelmand, ${count} artikelen`}>
            <CartIcon /><span className="lbl">Winkelmand</span><span className="n">{count}</span>
          </button>
        </div>
        <div className="stripe" />
      </header>
    </>
  );
}
