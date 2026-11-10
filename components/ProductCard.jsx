'use client';
import Link from 'next/link';
import { pct } from '@/lib/format';
import { useShop } from './ShopProvider';
import { Icon, PImg, Price, Stars } from './ui';

export default function ProductCard({ p, eager }) {
  const { add, qtyOf, isWish, toggleWish, openQuick } = useShop();
  const href = `/product/${p.slug}`;
  const inCart = qtyOf(p.id);
  const off = pct(p.price, p.regular);
  const hasOpts = !!p.options;
  const wished = isWish(p.id);
  const onAdd = () => {
    if (hasOpts) return openQuick(p);
    add({ pid: p.id, oid: 0, slug: p.slug, name: p.name, opt: '', price: p.price, regular: p.regular, img: p.images[0]?.thumb });
  };
  return (
    <article className="card">
      <div className="pimg">
        <Link href={href} className="pl" aria-label={p.name} tabIndex={-1}>
          <PImg src={p.images[0]?.thumb} alt={p.name} eager={eager} />
          {p.images[1] && <img className="alt" src={p.images[1].thumb} alt="" loading="lazy" decoding="async" />}
        </Link>
        <span className="badges">
          {off > 0 && <span className="badge sale">−{off}%</span>}
          {!p.inStock && <span className="badge oos">Uitverkocht</span>}
          {p.inStock && p.lowStock && <span className="badge low">Laatste stuks</span>}
        </span>
        <button className={`wish ${wished ? 'on' : ''}`} onClick={() => toggleWish(p)} aria-label={wished ? 'Van verlanglijst halen' : 'Op verlanglijst'} aria-pressed={wished}>{Icon.heart(19)}</button>
        <button className="qbtn" onClick={() => openQuick(p)}>{Icon.eye(17)} Snel bekijken</button>
        {inCart > 0 && <span className="incart" aria-label={`${inCart} in winkelmand`}>{Icon.bag(13)} {inCart}</span>}
      </div>
      <div className="cb">
        {p.brand && <span className="brand">{p.brand.name}</span>}
        <Link href={href} className="name">{p.name}</Link>
        {p.reviews > 0 ? <Stars value={p.rating} count={p.reviews} small /> : hasOpts ? <span className="opts">{p.options.length} {p.attrName?.toLowerCase().includes('kleur') ? 'kleuren' : 'varianten'}</span> : null}
        <div className="bot">
          <Price price={p.price} regular={p.onSale ? p.regular : 0} from={hasOpts && p.priceMax > p.price} />
          <button className="addbtn" onClick={onAdd} disabled={!p.inStock} aria-label={hasOpts ? `Kies een variant van ${p.name}` : `${p.name} in winkelmand`}>
            {hasOpts ? Icon.plus(20) : Icon.bag(19)}
          </button>
        </div>
      </div>
    </article>
  );
}
