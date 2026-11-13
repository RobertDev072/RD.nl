import { HOURS, SITE, STORE, im } from '@/lib/data';
import { Icon, Img } from '@/components/icons';
export const metadata = { title: 'Over BellaMina · Boetiek in Heerhugowaard' };
export default function About() {
  const q = encodeURIComponent(`${SITE.street}, ${SITE.city}`);
  return (
    <div className="wrap about">
      <div className="split">
        <Img src={STORE} alt="Binnenkant van de BellaMina boetiek" className="split-v" eager />
        <div><span className="eyebrow">Over BellaMina</span><h1>Mode met een vrouwelijke touch</h1>
          <p className="lead">Bij BellaMina in {SITE.place} vind je bijzondere damesmode vol stijl en vrouwelijkheid. Elke week nieuwe items en altijd persoonlijk advies.</p>
          <p>Liever rustig passen? Plan een privé shopmoment, dan heb je de boetiek even helemaal voor jezelf.</p>
          <div className="cta"><a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn btn-dark">{Icon.chat(18)} Afspraak via WhatsApp</a><a href={`tel:${SITE.tel}`} className="btn btn-line">{Icon.phone(18)} {SITE.phone}</a></div>
        </div>
      </div>
      <div className="info3">
        <div className="ibox"><h3>{Icon.pin(20)} Adres</h3><p>{SITE.street}<br />{SITE.city}</p><a className="more" href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener">Route plannen {Icon.arrow(16)}</a></div>
        <div className="ibox"><h3>Openingstijden</h3><ul className="hours">{HOURS.map(([d, t]) => <li key={d}><span>{d}</span><span>{t}</span></li>)}</ul></div>
        <div className="ibox"><h3>{Icon.insta(20)} Instagram</h3><div className="insta mini">{[8, 9, 10].map(i => <Img key={i} src={im(i)} alt="" />)}</div><a className="more" href={SITE.instagram} target="_blank" rel="noopener">{SITE.insta} {Icon.arrow(16)}</a></div>
      </div>
    </div>
  );
}
