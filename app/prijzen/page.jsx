import Link from 'next/link';
import { CATS, TREATMENTS } from '@/lib/data';
import { eur } from '@/lib/format';
export const metadata = { title: 'Prijzen 2026' };
export default function Page() {
  return (
    <div className="wrap narrow">
      <nav className="crumbs"><Link href="/">Home</Link><span>/ Prijzen 2026</span></nav>
      <div className="listhead"><span className="eyebrow">Prijslijst</span><h1>Prijzen 2026</h1><p>Alle prijzen in de salon. Tik op een behandeling om direct te boeken.</p></div>
      <div className="pricelist">
        {CATS.map(c => (
          <section key={c.id} className="pl-sec">
            <h2>{c.name}</h2>
            {TREATMENTS.filter(t => t.cat === c.id).flatMap(t => (t.variants || [{ id: '', label: '', price: t.price }]).map(v => (
              <Link key={t.slug + v.id} href={`/behandelingen/${t.slug}`} className="pl-row">
                <span>{t.variants ? (c.id === 'brow-lash' || c.id === 'extras' ? `${t.name} · ${v.label}` : v.label) : t.name}{t.short === 'All inclusive.' ? <small> all incl.</small> : null}</span>
                <i /><b>{eur(v.price)}</b>
              </Link>
            )))}
            {c.id === 'nieuwe-set' && <div className="pl-row static"><span>Verlenging</span><i /><b>+ € 15,-</b></div>}
          </section>
        ))}
      </div>
      <div className="cta center" style={{ margin: '24px 0 60px' }}><Link href="/behandelingen" className="btn btn-gold">Boek je afspraak</Link></div>
    </div>
  );
}
