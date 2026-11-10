'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { eur } from '@/lib/format';
import { useShop } from './ShopProvider';
import { Icon } from './ui';

const HIDE = ['/afrekenen', '/betalen', '/bedankt'];

export default function BottomNav() {
  const { count, subtotal, openCart, openSearch, wish } = useShop();
  const path = usePathname();
  if (HIDE.includes(path) || path.startsWith('/product/')) return null;
  const on = (...ps) => ps.some(p => (p === '/' ? path === '/' : path.startsWith(p))) ? 'on' : '';
  return (
    <nav className="bnav" aria-label="Snelmenu">
      <Link href="/" className={on('/')}>{Icon.home()}<span>Home</span></Link>
      <Link href="/shop" className={on('/shop', '/categorie', '/merk', '/aanbiedingen')}>{Icon.grid()}<span>Shop</span></Link>
      <button onClick={openSearch}>{Icon.search(22)}<span>Zoeken</span></button>
      <Link href="/verlanglijst" className={on('/verlanglijst')}><span className="ic">{Icon.heart(22)}{wish.length > 0 && <b>{wish.length}</b>}</span><span>Favorieten</span></Link>
      <button className={`cart ${count ? 'has' : ''}`} onClick={openCart}>
        <span className="ic">{Icon.bag()}{count > 0 && <b>{count}</b>}</span>
        <span>{count ? eur(subtotal) : 'Mand'}</span>
      </button>
    </nav>
  );
}
