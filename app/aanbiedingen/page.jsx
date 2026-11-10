import { getData, facetsFor } from '@/lib/catalog';
import { lite } from '@/lib/woo';
import { pct } from '@/lib/format';
import ListPage from '@/components/ListPage';

export const revalidate = 3600;
export const metadata = { title: 'Aanbiedingen' };

export default async function Sale() {
  const d = await getData();
  const items = d.products.filter(p => p.onSale).sort((a, b) => pct(b.price, b.regular) - pct(a.price, a.regular)).map(lite);
  return (
    <ListPage
      crumbs={[{ name: 'Aanbiedingen', href: '/aanbiedingen' }]}
      eyebrow="Nu voordeliger"
      title="Aanbiedingen"
      intro={`${items.length} professionele producten met korting, zolang de voorraad strekt.`}
      items={items}
      facets={facetsFor(d, items, d.tops)}
    />
  );
}
