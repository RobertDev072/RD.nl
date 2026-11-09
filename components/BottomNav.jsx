'use client';
import { usePathname, useRouter } from 'next/navigation';
import { eur } from '@/lib/menu';
import { useShop } from './ShopProvider';

const I = ({ d }) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;

export default function BottomNav() {
  const { count, subtotal, openCart, focusSearch } = useShop();
  const path = usePathname();
  const router = useRouter();
  if (path !== '/') return null;
  const toMenu = () => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  return (
    <nav className="bnav" aria-label="Snelmenu">
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><I d={<><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></>} /><span>Home</span></button>
      <button onClick={toMenu}><I d={<><path d="M4 6h16M4 12h16M4 18h10" /></>} /><span>Menu</span></button>
      <button onClick={focusSearch}><I d={<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>} /><span>Zoeken</span></button>
      <button className={`cartnav ${count ? 'has' : ''}`} onClick={count ? openCart : toMenu}>
        <span className="ic"><I d={<><path d="M5 7h15l-1.6 8.5a2 2 0 0 1-2 1.5H9a2 2 0 0 1-2-1.6L5 4H2" /><circle cx="9.5" cy="20.5" r="1" /><circle cx="17" cy="20.5" r="1" /></>} />{count > 0 && <b>{count}</b>}</span>
        <span>{count ? eur(subtotal) : 'Mand'}</span>
      </button>
    </nav>
  );
}
