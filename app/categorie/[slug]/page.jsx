import { notFound } from 'next/navigation';
import { getData, facetsFor, crumbsFor, inCat, TOP_INTRO, TOP_LABEL } from '@/lib/catalog';
import { lite } from '@/lib/woo';
import ListPage from '@/components/ListPage';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const d = await getData();
  return d.cats.filter(c => c.count > 0).map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const d = await getData();
  const c = d.cats.find(x => x.slug === slug);
  return { title: c ? (TOP_LABEL[c.slug] || c.name) : 'Categorie' };
}

export default async function Category({ params }) {
  const { slug } = await params;
  const d = await getData();
  const cat = d.cats.find(x => x.slug === slug);
  if (!cat) notFound();
  const items = d.products.filter(p => inCat(d, p, cat.id)).map(lite);
  const kids = d.children(cat.id);
  const parent = cat.parent ? d.byId.get(cat.parent) : null;
  const siblings = !kids.length && parent ? d.children(parent.id) : [];
  const isBrandLine = parent?.slug === 'artistique';
  const intro = TOP_INTRO[cat.slug]
    || (isBrandLine ? `Alle producten uit de ${cat.name}-lijn: professionele haarverzorging zoals in de salon.` : `${items.length} producten in ${cat.name.toLowerCase()}, geselecteerd vanuit de kapsalon.`);
  return (
    <ListPage
      crumbs={crumbsFor(d, cat).map(c => ({ ...c, name: TOP_LABEL[c.href.split('/').pop()] || c.name }))}
      eyebrow={parent ? (TOP_LABEL[parent.slug] || parent.name) : 'Categorie'}
      title={TOP_LABEL[cat.slug] || cat.name}
      intro={intro}
      items={items}
      facets={kids.length ? facetsFor(d, items, kids) : []}
      facetLabel={kids.length ? 'Soort' : 'Categorie'}
    >
      {siblings.length > 1 && (
        <div className="chips" style={{ marginTop: 16, flexWrap: 'nowrap', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {siblings.map(s => <a key={s.slug} href={`/categorie/${s.slug}`} className={`chip ${s.slug === cat.slug ? 'on' : ''}`}>{s.name.replace(/^Artistique\s+/, '')}</a>)}
        </div>
      )}
    </ListPage>
  );
}
