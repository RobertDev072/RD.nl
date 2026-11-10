'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { lock, unlock } from '@/lib/lock';
import { eur, USPS, SITE } from '@/lib/format';
import { searchIndex } from '@/lib/search';
import Logo from './Logo';
import { useShop } from './ShopProvider';
import { Suggestions, useCatMatches } from './SearchOverlay';
import { Icon } from './ui';

function MobileMenu({ nav, onClose }) {
  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    addEventListener('keydown', k); lock();
    return () => { removeEventListener('keydown', k); unlock(); };
  }, [onClose]);
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer left" role="dialog" aria-modal="true" aria-label="Menu">
        <div className="dhead"><Logo h={24} /><button className="x" onClick={onClose} aria-label="Sluiten">×</button></div>
        <div className="dbody">
          <nav className="mnav" onClick={e => { if (e.target.closest('a')) onClose(); }}>
            <Link href="/shop"><b style={{ fontWeight: 500 }}>Alle producten</b></Link>
            {nav.tops.map(t => (
              <details key={t.slug}>
                <summary>{t.label}</summary>
                <Link href={`/categorie/${t.slug}`}>Alles in {t.label.toLowerCase()} <span className="muted">{t.count}</span></Link>
                {t.children.map(c => <Link key={c.slug} href={`/categorie/${c.slug}`}>{c.name}</Link>)}
              </details>
            ))}
            <details>
              <summary>Merken</summary>
              {nav.brands.map(b => <Link key={b.slug} href={`/merk/${b.slug}`}>{b.name} <span className="muted">{b.count}</span></Link>)}
              {nav.lines.map(l => <Link key={l.slug} href={`/categorie/${l.slug}`}>Artistique {l.name}</Link>)}
            </details>
            <Link href="/aanbiedingen" className="sale">Aanbiedingen <span>{nav.saleCount}</span></Link>
            <Link href="/advies">Haaradvies</Link>
            <Link href="/verlanglijst">Verlanglijst</Link>
          </nav>
          <div className="mhelp">
            <b>Klantenservice</b>
            <Link href="/verzending" onClick={onClose}>Verzending</Link>
            <Link href="/retourneren" onClick={onClose}>Retourneren</Link>
            <Link href="/betaalmethodes" onClick={onClose}>Betaalmethodes</Link>
            <Link href="/contact" onClick={onClose}>Contact</Link>
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn btn-line btn-block" style={{ marginTop: 12 }}>{Icon.chat(18)} WhatsApp {SITE.phone}</a>
          </div>
        </div>
      </aside>
    </>
  );
}

function HeaderSearch({ nav }) {
  const { index } = useShop();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const box = useRef(null);
  const results = useMemo(() => searchIndex(index, q, 6), [index, q]);
  const cats = useCatMatches(q.trim(), nav);
  useEffect(() => {
    const out = e => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', out);
    return () => document.removeEventListener('pointerdown', out);
  }, []);
  const submit = e => { e.preventDefault(); setOpen(false); router.push(`/shop?q=${encodeURIComponent(q.trim())}`); };
  return (
    <form className="hsearch" onSubmit={submit} role="search" ref={box}>
      <label className="sr" htmlFor="hq">Zoeken</label>
      {Icon.search(19)}
      <input id="hq" className="input" type="search" enterKeyHint="search" value={q} onFocus={() => setOpen(true)}
        onChange={e => { setQ(e.target.value); setOpen(true); }} onKeyDown={e => e.key === 'Escape' && setOpen(false)}
        placeholder="Zoek een product of merk…" autoComplete="off" />
      {open && q.trim().length > 1 && <div className="hdrop"><Suggestions results={results} q={q.trim()} cats={cats} onPick={() => { setOpen(false); setQ(''); }} /></div>}
    </form>
  );
}

export default function Header({ nav }) {
  const { count, subtotal, openCart, wish, openSearch } = useShop();
  const [menu, setMenu] = useState(false);
  const [usp, setUsp] = useState(0);
  const path = usePathname();
  const closeMenu = useCallback(() => setMenu(false), []);
  useEffect(() => { setMenu(false); }, [path]);
  useEffect(() => { const i = setInterval(() => setUsp(u => (u + 1) % USPS.length), 4000); return () => clearInterval(i); }, []);

  return (
    <>
      <div className="concept"><b>Ontwerpvoorstel</b> van <a href="https://lorvex.nl" target="_blank" rel="noopener">Lorvex</a> voor JeHaarwinkel · preview, bestellingen worden niet verwerkt</div>
      <div className="usp-top"><div className="wrap">
        {USPS.map((u, i) => <span key={u} className={i === usp ? 'on' : ''}>{[Icon.clock, Icon.truck, Icon.scissors][i](15)} {u}</span>)}
        <a href="https://www.webwinkelkeur.nl/webshop/jehaarwinkel_1211559" target="_blank" rel="noopener" className="wwk-top">WebwinkelKeur lid</a>
      </div></div>
      <header className="header">
        <div className="wrap hrow">
          <button className="iconbtn menubtn" onClick={() => setMenu(true)} aria-label="Menu openen">{Icon.menu()}</button>
          <Link href="/" className="hlogo" aria-label="JeHaarwinkel home"><Logo h={30} priority /></Link>
          <HeaderSearch nav={nav} />
          <div className="hicons">
            <button className="iconbtn msearch" onClick={openSearch} aria-label="Zoeken">{Icon.search(21)}</button>
            <Link href="/verlanglijst" className="iconbtn hwish" aria-label={`Verlanglijst, ${wish.length} producten`}>{Icon.heart(22)}{wish.length > 0 && <span className="n">{wish.length}</span>}</Link>
            <button className="hcart" onClick={openCart} aria-label={`Winkelmand, ${count} artikelen`}>
              <span className="iconbtn as">{Icon.bag()}{count > 0 && <span className="n">{count}</span>}</span>
              <span className="ht"><small>Winkelmand</small>{eur(subtotal)}</span>
            </button>
          </div>
        </div>
        <nav className="nav" aria-label="Categorieën">
          <div className="wrap">
            <div className="nav-item"><Link href="/shop" className="nav-link">Shop</Link></div>
            {nav.tops.map(t => (
              <div className="nav-item" key={t.slug}>
                <Link href={`/categorie/${t.slug}`} className="nav-link">{t.label}</Link>
                <div className="mega"><div className="wrap">
                  <div><h4>{t.label}</h4><p>{t.intro}</p><Link href={`/categorie/${t.slug}`} className="btn btn-line" style={{ minHeight: 40, padding: '0 18px' }}>Bekijk alles ({t.count})</Link></div>
                  <ul>{t.children.map(c => <li key={c.slug}><Link href={`/categorie/${c.slug}`}>{c.name}<span>{c.count}</span></Link></li>)}</ul>
                  {t.img && <Link href={`/categorie/${t.slug}`} className="mega-img" tabIndex={-1}><img src={t.img} alt="" loading="lazy" /><span>Shop {t.label.toLowerCase()} {Icon.arrow(15)}</span></Link>}
                </div></div>
              </div>
            ))}
            <div className="nav-item">
              <Link href="/merken" className="nav-link">Merken</Link>
              <div className="mega"><div className="wrap">
                <div><h4>Merken</h4><p>Professionele merken die ook in de salon worden gebruikt.</p></div>
                <ul>
                  {nav.brands.map(b => <li key={b.slug}><Link href={`/merk/${b.slug}`}><b style={{ fontWeight: 500 }}>{b.name}</b><span>{b.count}</span></Link></li>)}
                  {nav.lines.map(l => <li key={l.slug}><Link href={`/categorie/${l.slug}`}>Artistique {l.name}<span>{l.count}</span></Link></li>)}
                </ul>
              </div></div>
            </div>
            <div className="nav-item"><Link href="/aanbiedingen" className="nav-link sale">Aanbiedingen</Link></div>
            <div className="nav-item"><Link href="/advies" className="nav-link">Haaradvies</Link></div>
          </div>
        </nav>
      </header>
      {menu && <MobileMenu nav={nav} onClose={closeMenu} />}
    </>
  );
}
