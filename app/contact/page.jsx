import Link from 'next/link';
import { SITE, HOURS } from '@/lib/data';
import { Icon } from '@/components/icons';
export const metadata = { title: 'Contact & openingstijden' };
export default function Page() {
  return (
    <div className="wrap">
      <nav className="crumbs"><Link href="/">Home</Link><span>/ Contact</span></nav>
      <div className="listhead"><span className="eyebrow">Contact</span><h1>Tot snel in de salon!</h1><p>Weet je nog niet precies wat je wil? Of wil je een afspraak maken? Neem gerust contact op.</p></div>
      <div className="info3" style={{ marginBottom: 60 }}>
        <div className="ibox">
          <h3>Contact</h3>
          <div className="ibtns">
            <a href={`tel:${SITE.tel}`} className="btn btn-line btn-block">{Icon.phone(18)} {SITE.phone}</a>
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn btn-line btn-block">{Icon.chat(18)} WhatsApp</a>
            <a href={SITE.instagram} target="_blank" rel="noopener" className="btn btn-line btn-block">{Icon.insta(18)} Instagram</a>
            <a href={SITE.facebook} target="_blank" rel="noopener" className="btn btn-line btn-block">{Icon.fb(18)} Facebook</a>
          </div>
          <p className="small" style={{ marginTop: 14 }}>{Icon.pin(15)} {SITE.place} · Gratis parkeren voor de deur<br />KVK {SITE.kvk}</p>
          <div className="demo">In de echte site staat hier ook het contactformulier. In deze preview worden geen gegevens verzonden.</div>
        </div>
        <div className="ibox">
          <h3>Openingstijden</h3>
          <ul className="hours">{HOURS.map(([d, t]) => <li key={d} className={t === 'Gesloten' ? 'closed' : ''}><span>{d}</span><span>{t}</span></li>)}</ul>
        </div>
        <div className="ibox gold">
          <h3>Direct boeken</h3>
          <p>Kies je behandeling en een tijd die jou uitkomt.</p>
          <Link href="/behandelingen" className="btn btn-dark btn-block">{Icon.cal(18)} Boek je afspraak</Link>
          <p className="small" style={{ marginTop: 12 }}>Een vriendelijke groet, Jasmina</p>
        </div>
      </div>
    </div>
  );
}
