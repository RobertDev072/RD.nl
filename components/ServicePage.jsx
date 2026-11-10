import Link from 'next/link';
import { SITE } from '@/lib/format';

const NAV = [['/contact', 'Contact'], ['/verzending', 'Verzending'], ['/retourneren', 'Retourneren'], ['/betaalmethodes', 'Betaalmethodes'], ['/garantie-klachten', 'Garantie & klachten'], ['/over-jehaarwinkel', 'Over JeHaarwinkel']];

export default function ServicePage({ path, title, eyebrow = 'Klantenservice', children }) {
  return (
    <div className="wrap">
      <nav className="crumbs"><Link href="/">Home</Link><span>/ {title}</span></nav>
      <div className="svc">
        <aside className="svc-nav">
          <h4>Klantenservice</h4>
          {NAV.map(([h, l]) => <Link key={h} href={h} className={h === path ? 'on' : ''}>{l}</Link>)}
          <div className="svc-help">
            <b>Hulp nodig?</b>
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener">WhatsApp {SITE.phone}</a>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>
        </aside>
        <article className="prose">
          <span className="eyebrow">{eyebrow}</span>
          <h1 style={{ fontSize: 'clamp(32px,4vw,46px)', marginBottom: 12 }}>{title}</h1>
          {children}
        </article>
      </div>
    </div>
  );
}

export const Contact = () => (
  <p><b>E-mail:</b> <a href={`mailto:${SITE.email}`}>{SITE.email}</a><br /><b>Telefoon / WhatsApp:</b> <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener">{SITE.phone}</a></p>
);
