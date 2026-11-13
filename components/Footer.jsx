import Link from 'next/link';
import { CATS, HOURS, SITE } from '@/lib/data';
import { Icon } from './icons';
export default function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap fgrid">
        <div><span className="logo light">Bella<em>Mina</em></span><p>{SITE.tagline}. Online shoppen of langskomen in onze boetiek.</p>
          <a href={SITE.instagram} target="_blank" rel="noopener" className="fl">{Icon.insta(18)} {SITE.insta}</a></div>
        <div><h4>Shop</h4>{CATS.map(c => <Link key={c.slug} href={`/shop?cat=${c.slug}`}>{c.name}</Link>)}</div>
        <div><h4>Boetiek</h4><p>{SITE.street}<br />{SITE.city}</p><a href={`tel:${SITE.tel}`}>{SITE.phone}</a><a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener">WhatsApp</a></div>
        <div><h4>Openingstijden</h4><ul className="hours">{HOURS.map(([d, t]) => <li key={d}><span>{d}</span><span>{t}</span></li>)}</ul><p className="small">Privé shoppen op afspraak</p></div>
      </div>
      <div className="wrap fbot"><span>© {new Date().getFullYear()} BellaMina · Concept door Lorvex.nl</span><span className="paylogos"><span className="ideal">iDEAL</span><span>Wero</span><span>Bancontact</span><span>Klarna</span></span></div>
    </footer>
  );
}
