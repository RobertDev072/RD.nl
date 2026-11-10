import { notFound } from 'next/navigation';
import { getData, facetsFor } from '@/lib/catalog';
import { lite } from '@/lib/woo';
import ListPage from '@/components/ListPage';

export const revalidate = 3600;

const INTRO = {
  artistique: 'Artistique is een professioneel salonmerk met verzorging en styling voor elk haartype, van de Orchid- en Core Lab-verzorging tot de YouStyle-stylinglijn.',
  'max-pro': 'Max Pro maakt professionele hairtools: föhns, airstylers, stijl- en krultangen en borstels voor salonresultaat thuis.',
  mohi: 'MOHI maakt accessoires die je haar sparen: satijnen kussenslopen en bonnets, microvezel handdoeken en zachte borstels.'
};

export async function generateStaticParams() {
  const d = await getData();
  return d.brands.map(b => ({ slug: b.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const d = await getData();
  return { title: d.brands.find(b => b.slug === slug)?.name || 'Merk' };
}

export default async function Brand({ params }) {
  const { slug } = await params;
  const d = await getData();
  const brand = d.brands.find(b => b.slug === slug);
  if (!brand) notFound();
  const items = d.products.filter(p => p.brand?.slug === slug).map(lite);
  const facets = slug === 'artistique' && d.lines.length ? facetsFor(d, items, d.lines) : facetsFor(d, items, d.tops);
  return (
    <ListPage
      crumbs={[{ name: 'Merken', href: '/merken' }, { name: brand.name, href: `/merk/${slug}` }]}
      eyebrow="Merk"
      title={brand.name}
      intro={INTRO[slug] || `Alle producten van ${brand.name}.`}
      items={items}
      facets={facets}
      facetLabel={slug === 'artistique' ? 'Productlijn' : 'Categorie'}
    />
  );
}
