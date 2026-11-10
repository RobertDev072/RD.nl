import Link from 'next/link';
import { getData } from '@/lib/catalog';

export const revalidate = 3600;
export const metadata = { title: 'Merken' };

const BG = { artistique: 'b1', 'max-pro': 'b2', mohi: 'b3' };
const TXT = {
  artistique: 'Professionele verzorging en styling voor elk haartype.',
  'max-pro': 'Hairtools voor salonresultaat thuis.',
  mohi: 'Satijn en accessoires die je haar sparen.'
};

export default async function Brands() {
  const d = await getData();
  return (
    <div className="wrap">
      <nav className="crumbs"><Link href="/">Home</Link><span>/ Merken</span></nav>
      <div className="listhead"><span className="eyebrow">Merken</span><h1 style={{ fontSize: 'clamp(32px,4vw,48px)' }}>Onze merken</h1><p>Merken die we zelf in de salon gebruiken en waar we achter staan.</p></div>
      <div className="brands" style={{ marginBottom: 40 }}>
        {d.brands.map(b => (
          <Link key={b.slug} href={`/merk/${b.slug}`} className={`brandcard ${BG[b.slug] || 'b2'}`}>
            <h3>{b.name}</h3><p>{TXT[b.slug] || ''} {b.count} producten.</p><span className="go">Shop {b.name}</span>
          </Link>
        ))}
      </div>
      {d.lines.length > 0 && (
        <section style={{ paddingTop: 0 }}>
          <div className="shead"><div><span className="eyebrow">Artistique</span><h2>Alle productlijnen</h2></div></div>
          <div className="chips" style={{ gap: 10 }}>
            {d.lines.map(l => <Link key={l.slug} href={`/categorie/${l.slug}`} className="chip" style={{ minHeight: 44, padding: '0 18px' }}>{l.name.replace(/^Artistique\s+/, '')} <span className="muted">{l.count}</span></Link>)}
          </div>
        </section>
      )}
    </div>
  );
}
