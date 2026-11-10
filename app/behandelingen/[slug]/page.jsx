import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TREATMENTS, CATS } from '@/lib/data';
import Detail from './Detail';
import TreatmentCard from '@/components/TreatmentCard';

export function generateStaticParams() { return TREATMENTS.map(t => ({ slug: t.slug })); }
export async function generateMetadata({ params }) {
  const { slug } = await params; const t = TREATMENTS.find(x => x.slug === slug);
  return { title: t ? t.name : 'Behandeling', description: t?.short };
}
export default async function Page({ params }) {
  const { slug } = await params;
  const t = TREATMENTS.find(x => x.slug === slug);
  if (!t) notFound();
  const cat = CATS.find(c => c.id === t.cat);
  const more = TREATMENTS.filter(x => x.slug !== t.slug && (x.cat === t.cat || x.popular)).slice(0, 4);
  return (
    <div className="wrap">
      <nav className="crumbs"><Link href="/">Home</Link><span>/ <Link href="/behandelingen">Behandelingen</Link></span><span>/ <Link href={`/behandelingen?cat=${cat.id}`}>{cat.name}</Link></span></nav>
      <Detail t={t} />
      <section style={{ paddingTop: 10 }}>
        <div className="shead"><div><span className="eyebrow">Ook populair</span><h2>Andere behandelingen</h2></div></div>
        <div className="tgrid">{more.map(x => <TreatmentCard key={x.slug} t={x} />)}</div>
      </section>
    </div>
  );
}
