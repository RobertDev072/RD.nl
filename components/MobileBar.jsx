'use client';
import { usePathname } from 'next/navigation';
import { eur } from '@/lib/menu';
import { useShop } from './ShopProvider';

export default function MobileBar() {
  const { count, subtotal, openCart } = useShop();
  const path = usePathname();
  if (!count || path !== '/') return null;
  return (
    <div className="mbar">
      <button className="btn btn-red" onClick={openCart}>
        <span>{count} {count === 1 ? 'artikel' : 'artikelen'}</span>
        <span>Bekijk winkelmand · {eur(subtotal)}</span>
      </button>
    </div>
  );
}
