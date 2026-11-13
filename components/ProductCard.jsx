'use client';
import Link from 'next/link';
import { useShop } from './ShopProvider';
import { Icon, Img } from './icons';
import { eur } from '@/lib/format';
import { im } from '@/lib/data';
export default function ProductCard({ p }) {
  const { wish, toggleWish, add } = useShop(); const on = wish.includes(p.slug);
  return (
    <div className="pc">
      <Link href={`/product/${p.slug}`} className="pc-i">
        <Img src={im(p.imgs[0])} alt={p.name} />
        {p.imgs[1] != null && <Img src={im(p.imgs[1])} alt="" className="alt" />}
        {p.tag && <span className="tag">{p.tag}</span>}
      </Link>
      <button className={`wish ${on ? 'on' : ''}`} onClick={() => toggleWish(p.slug)} aria-label={on ? 'Uit favorieten' : 'Aan favorieten toevoegen'}>{Icon.heart(19, on)}</button>
      {p.sizes.length === 1 && <button className="qadd" onClick={() => add(p.slug, p.sizes[0], p.colors[0].id)} aria-label={`${p.name} in tas`}>{Icon.plus(18)}</button>}
      <Link href={`/product/${p.slug}`} className="pc-t">
        <span className="nm">{p.name}</span>
        <span className="pr">{eur(p.price)}</span>
        <span className="sw">{p.colors.map(c => <i key={c.id} style={{ background: c.hex }} title={c.label} />)}</span>
      </Link>
    </div>
  );
}
