'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { CATS, PRODUCTS } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { useShop } from '@/components/ShopProvider';
export default function Catalog() {
  const sp = useSearchParams(); const cat = sp.get('cat'); const w = sp.get('wish'); const { wish } = useShop();
  const [sort, setSort] = useState('new');
  let list = PRODUCTS.filter(p => (!cat || p.cat === cat) && (!w || wish.includes(p.slug)));
  if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
  if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
  const c = CATS.find(x => x.slug === cat);
  return (
    <div className="wrap shop">
      <div className="crumbs"><Link href="/">Home</Link> / <span>{w ? 'Favorieten' : c?.name || 'Shop alles'}</span></div>
      <h1>{w ? 'Je favorieten' : c?.name || 'Shop alles'}</h1>
      <div className="chips">
        <Link href="/shop" className={!cat && !w ? 'on' : ''}>Alles</Link>
        {CATS.map(x => <Link key={x.slug} href={`/shop?cat=${x.slug}`} className={cat === x.slug ? 'on' : ''}>{x.name}</Link>)}
      </div>
      <div className="bar"><span className="muted">{list.length} artikelen</span>
        <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sorteren"><option value="new">Nieuwste</option><option value="low">Prijs laag–hoog</option><option value="high">Prijs hoog–laag</option></select>
      </div>
      {list.length ? <div className="pgrid">{list.map(p => <ProductCard key={p.slug} p={p} />)}</div>
        : <div className="empty"><p>{w ? 'Je hebt nog geen favorieten. Tik op het hartje bij een artikel.' : 'Geen artikelen gevonden.'}</p><Link href="/shop" className="btn btn-dark">Bekijk alles</Link></div>}
    </div>
  );
}
