'use client';
import Link from 'next/link';
import { useShop } from '@/components/ShopProvider';
import ProductCard from '@/components/ProductCard';
import RecentRail from '@/components/RecentRail';
import { Icon } from '@/components/ui';

export default function Wishlist() {
  const { wish, ready, add } = useShop();
  const simple = wish.filter(p => !p.options && p.inStock);
  const addAll = () => simple.forEach(p => add({ pid: p.id, oid: 0, slug: p.slug, name: p.name, opt: '', price: p.price, regular: p.regular, img: p.images[0]?.thumb }));
  return (
    <div className="wrap">
      <nav className="crumbs"><Link href="/">Home</Link><span>/ Verlanglijst</span></nav>
      <div className="listhead">
        <span className="eyebrow">Favorieten</span>
        <h1 style={{ fontSize: 'clamp(32px,4vw,48px)' }}>Mijn verlanglijst</h1>
        <p>Bewaar producten met het hartje, dan heb je ze altijd bij de hand. Je verlanglijst wordt op dit apparaat bewaard.</p>
      </div>
      {!ready ? null : wish.length === 0 ? (
        <div className="empty" style={{ marginBottom: 40 }}>
          <div className="emptyic">{Icon.heart(30)}</div>
          <h3>Je verlanglijst is nog leeg</h3>
          <p>Tik op het hartje bij een product om het hier te bewaren.</p>
          <Link href="/shop" className="btn btn-primary">Ontdek de shop</Link>
        </div>
      ) : (
        <>
          <div className="toolbar"><span className="count">{wish.length} {wish.length === 1 ? 'product' : 'producten'}</span>
            {simple.length > 1 && <button className="btn btn-line" style={{ minHeight: 42 }} onClick={addAll}>{Icon.bag(18)} Alles in winkelmand</button>}
          </div>
          <div className="grid" style={{ marginBottom: 50 }}>{wish.map(p => <ProductCard key={p.id} p={p} />)}</div>
        </>
      )}
      <RecentRail title="Recent bekeken" />
    </div>
  );
}
