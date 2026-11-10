import ServicePage from '@/components/ServicePage';
import { SITE } from '@/lib/format';
export const metadata = { title: 'Contact' };
export default function Page() {
  return (
    <ServicePage path="/contact" title="Contact">
      <h2>Stel je vraag</h2>
      <p>Heb je een vraag over een product, je bestelling, verzending of retourneren? Neem contact met ons op via e-mail of WhatsApp. We helpen je graag verder.</p>
      <div className="ccards">
        <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="ccard"><b>WhatsApp</b><span>{SITE.phone}</span></a>
        <a href={`mailto:${SITE.email}`} className="ccard"><b>E-mail</b><span>{SITE.email}</span></a>
      </div>
      <div className="demo">In de echte webshop staat hier ook het contactformulier. In deze preview worden geen gegevens verzonden.</div>
      <h2>Bedrijfsgegevens</h2>
      <p>JeHaarwinkel.nl wordt geëxploiteerd door:<br />{SITE.company}<br />{SITE.street}<br />{SITE.zip}<br />Nederland<br />KvK: {SITE.kvk}<br />BTW: {SITE.btw}</p>
    </ServicePage>
  );
}
