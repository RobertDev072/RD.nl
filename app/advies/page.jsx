import { Suspense } from 'react';
import Link from 'next/link';
import Advisor from './Advisor';
import { SITE } from '@/lib/format';

export const metadata = { title: 'Haaradvies' };

export default function Page() {
  return (
    <div className="wrap">
      <nav className="crumbs"><Link href="/">Home</Link><span>/ Haaradvies</span></nav>
      <div className="listhead">
        <span className="eyebrow">Advies vanuit de kapsalon</span>
        <h1 style={{ fontSize: 'clamp(32px,4vw,48px)' }}>Welk haarproduct past bij jou?</h1>
        <p>Kies waar je advies over wilt. Je krijgt in een paar korte stappen een praktisch haaradvies, met uitleg waarom de keuze past en directe links naar producten die je kunt bestellen.</p>
      </div>
      <Suspense fallback={null}><Advisor /></Suspense>
      <div className="prose" style={{ paddingTop: 30 }}>
        <h2>Haaradvies begint bij wat je haar nodig heeft</h2>
        <p>Het juiste haarproduct kies je niet alleen op merk of verpakking. Kijk eerst naar je haartype, de conditie van je haar, je hoofdhuid, eventuele kleur- of chemische behandelingen en het resultaat dat je wilt bereiken. Fijn haar kan tegelijk beschadigd zijn, krullend haar kan droog aanvoelen en een snel vette hoofdhuid kan samengaan met droge lengtes. Daarom kijkt deze adviespagina naar meerdere factoren en niet naar één vast label.</p>
        <h2>Een goede haarroutine hoeft niet ingewikkeld te zijn</h2>
        <p>Voor de meeste mensen bestaat een goede basis uit reinigen, verzorgen en eventueel stylen. Kies shampoo op basis van hoofdhuid en haarconditie.</p>
        <h2>Kom je er nog niet uit?</h2>
        <p>Stel je vraag via <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" style={{ textDecoration: 'underline' }}>WhatsApp ({SITE.phone})</a> of <a href={`mailto:${SITE.email}`} style={{ textDecoration: 'underline' }}>{SITE.email}</a>. We helpen je graag verder.</p>
      </div>
    </div>
  );
}
