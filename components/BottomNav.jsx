'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useShop } from './ShopProvider';
import { Icon } from './icons';
export default function BottomNav() {
  const p = usePathname(); const { count, openCart, wish } = useShop();
  const L = (href, ic, t, on) => <Link href={href} className={on ? 'on' : ''}>{ic}<span>{t}</span></Link>;
  return (
    <nav className="bnav" aria-label="App-navigatie">
      {L('/', Icon.home(22), 'Home', p === '/')}
      {L('/shop', Icon.grid(22), 'Shop', p.startsWith('/shop') || p.startsWith('/product'))}
      {L('/shop?wish=1', <span className="bi">{Icon.heart(22)}{wish.length > 0 && <i className="badge">{wish.length}</i>}</span>, 'Favoriet', false)}
      <button onClick={openCart}><span className="bi">{Icon.bag(22)}{count > 0 && <i className="badge">{count}</i>}</span><span>Tas</span></button>
      {L('/over', Icon.user(22), 'Boetiek', p === '/over')}
    </nav>
  );
}
