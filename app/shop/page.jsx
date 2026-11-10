import { getData, facetsFor } from '@/lib/catalog';
import { lite } from '@/lib/woo';
import ListPage from '@/components/ListPage';

export const revalidate = 3600;
export const metadata = { title: 'Alle producten' };

export default async function Shop() {
  const d = await getData();
  const items = d.products.map(lite);
  return (
    <ListPage
      crumbs={[{ name: 'Shop', href: '/shop' }]}
      eyebrow="Shop"
      title="Alle haarproducten"
      intro="Professionele verzorging, styling, kleur en tools. Filter op categorie of merk, of zoek direct wat je nodig hebt."
      items={items}
      facets={facetsFor(d, items, d.tops)}
    />
  );
}
