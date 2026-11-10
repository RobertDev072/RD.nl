'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { eur } from '@/lib/format';
import { useShop } from './ShopProvider';
import { Icon } from './ui';

export default function BottomNav() {
  const { count, total, openCart } = useShop();
  const path = usePathname();
  if (['/afrekenen', '/betalen', '/bedankt'].includes(path) || path.startsWith('/behandelingen/') || path === '/cadeaubon') return null;
  const on = p => (p === '/' ? path === '/' : path.startsWith(p)) ? 'on' : '';
  return (
    <nav className="bnav" aria-label="Snelmenu">
      <Link href="/" className={on('/')}>{Icon.home()}<span>Home</span></Link>
      <Link href="/behandelingen" className={on('/behandelingen')}>{Icon.nail()}<span>Behandelingen</span></Link>
      <Link href="/impressie" className={on('/impressie')}>{Icon.image()}<span>Impressie</span></Link>
      <Link href="/cadeaubon" className={on('/cadeaubon')}>{Icon.gift()}<span>Cadeaubon</span></Link>
      <button className={`cart ${count ? 'has' : ''}`} onClick={openCart}>
        <span className="ic">{Icon.cal()}{count > 0 && <b>{count}</b>}</span><span>{count ? eur(total) : 'Afspraak'}</span>
      </button>
    </nav>
  );
}
