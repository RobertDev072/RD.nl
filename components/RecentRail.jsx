'use client';
import { useShop } from './ShopProvider';
import ProductCard from './ProductCard';

export default function RecentRail({ exclude, title = 'Recent bekeken' }) {
  const { recent, ready } = useShop();
  const items = recent.filter(p => p.id !== exclude);
  if (!ready || items.length === 0) return null;
  return (
    <section style={{ paddingTop: 0 }}>
      <div className="shead"><div><span className="eyebrow">Jouw historie</span><h2>{title}</h2></div></div>
      <div className="rail">{items.map(p => <ProductCard key={p.id} p={p} />)}</div>
    </section>
  );
}
