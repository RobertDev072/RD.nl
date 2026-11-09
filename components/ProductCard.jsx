'use client';
import { eur, hasRange, minPrice } from '@/lib/menu';
import { useShop } from './ShopProvider';
import { ProductImg, Qty } from './ui';

export default function ProductCard({ p }) {
  const { add, openProduct, qtyOf, cart, setQty } = useShop();
  const inCart = qtyOf(p.slug);
  const simpleLine = !p.v && cart.find(l => l.s === p.slug);
  return (
    <article className="card">
      <button className="ph" onClick={() => openProduct(p.slug)} aria-label={`Bekijk ${p.n}`}>
        <ProductImg p={p} w={500} />
        <span className="tags">
          {p.pre && <span className="tag red">24 uur vooraf</span>}
          {p.t && <span className="tag gold">{p.t}</span>}
        </span>
        {inCart > 0 && <span className="incart" aria-label={`${inCart} in winkelmand`}>{inCart}</span>}
      </button>
      <div className="body">
        <button className="name" onClick={() => openProduct(p.slug)}>{p.n}</button>
        <p className="desc">{p.d || p.cat}</p>
        {p.v && <span className="meta">{p.v.length} keuzes: {p.v.slice(0, 3).map(o => o[0]).join(', ')}{p.v.length > 3 ? '…' : ''}</span>}
        <div className="bot">
          <span className="price">{hasRange(p) && <small>vanaf </small>}{eur(minPrice(p))}</span>
          {p.v ? (
            <button className="btn btn-green add" onClick={() => openProduct(p.slug)} aria-label={`Kies optie voor ${p.n}`}><span className="plus">+</span><span className="lbl">Kies</span></button>
          ) : simpleLine ? (
            <Qty small green value={simpleLine.q} onChange={q => setQty(simpleLine.k, q)} />
          ) : (
            <button className="btn btn-green add" onClick={() => add(p.slug)} aria-label={`${p.n} toevoegen`}><span className="plus">+</span><span className="lbl">Toevoegen</span></button>
          )}
        </div>
      </div>
    </article>
  );
}
