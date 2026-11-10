import Link from 'next/link';
import Gallery from './Gallery';
export const metadata = { title: 'Kleine impressie' };
export default function Page() {
  return (
    <div className="wrap">
      <nav className="crumbs"><Link href="/">Home</Link><span>/ Kleine impressie</span></nav>
      <div className="listhead"><span className="eyebrow">Uit de salon</span><h1>Kleine impressie</h1><p>Een selectie van nagels uit de salon. Tik op een foto om hem groot te bekijken.</p></div>
      <Gallery />
      <div className="cta center" style={{ margin: '26px 0 60px' }}><Link href="/behandelingen" className="btn btn-gold">Boek je afspraak</Link></div>
    </div>
  );
}
