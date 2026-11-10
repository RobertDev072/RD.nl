import Link from 'next/link';
import { REVIEWS, SITE } from '@/lib/data';
import Reviews from '@/components/Reviews';
export const metadata = { title: 'Reviews' };
export default function Page() {
  return (
    <div className="wrap">
      <nav className="crumbs"><Link href="/">Home</Link><span>/ Reviews</span></nav>
      <div className="listhead"><span className="eyebrow">Reviews via Facebook</span><h1>Wat klanten zeggen</h1><p>Echte ervaringen van klanten, zoals ze op Facebook zijn geplaatst.</p></div>
      <Reviews items={REVIEWS} grid />
      <div className="cta center" style={{ margin: '26px 0 60px' }}><a href={SITE.facebook} target="_blank" rel="noopener" className="btn btn-line">Bekijk op Facebook</a><Link href="/behandelingen" className="btn btn-gold">Boek je afspraak</Link></div>
    </div>
  );
}
