import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getData, inCat } from '@/lib/catalog';
import { lite } from '@/lib/woo';
import ProductView from '@/components/ProductView';
import ProductCard from '@/components/ProductCard';
import RecentRail from '@/components/RecentRail';

export const revalidate = 3600;

export async function generateStaticParams() {
  const d = await getData();
  return d.products.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const d = await getData();
  const p = d.products.find(x => x.slug === slug);
  if (!p) return { title: 'Product' };
  return { title: p.name, description: p.short?.slice(0, 155) };
}

export default async function Product({ params }) {
  const { slug } = await params;
  const d = await getData();
  const p = d.products.find(x => x.slug === slug);
  if (!p) notFound();

  // Kruimelpad via de meest specifieke categorie
  const deepest = [...p.cats].map(c => d.byId.get(c.id)).filter(Boolean)
    .sort((a, b) => (b.parent ? 1 : 0) - (a.parent ? 1 : 0))[0];
  const trail = [];
  for (let c = deepest; c; c = c.parent ? d.byId.get(c.parent) : null) trail.unshift(c);

  const related = deepest
    ? d.products.filter(x => x.id !== p.id && x.inStock && inCat(d, x, deepest.id)).slice(0, 8)
    : [];
  const more = related.length < 4 && p.brand ? d.products.filter(x => x.id !== p.id && x.inStock && x.brand?.slug === p.brand.slug && !related.includes(x)).slice(0, 8 - related.length) : [];
  const recs = [...related, ...more].map(lite);
  const { descHtml, ...prod } = p;

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Kruimelpad">
        <Link href="/">Home</Link>
        {trail.map(c => <span key={c.id}>/ <Link href={`/categorie/${c.slug}`}>{c.name}</Link></span>)}
      </nav>
      <ProductView p={prod} descHtml={descHtml} />
      {recs.length > 0 && (
        <section style={{ paddingTop: 0 }}>
          <div className="shead"><div><span className="eyebrow">Combineer met</span><h2>Dit vind je misschien ook mooi</h2></div></div>
          <div className="rail">{recs.map(r => <ProductCard key={r.id} p={r} />)}</div>
        </section>
      )}
      <RecentRail exclude={p.id} />
    </div>
  );
}
