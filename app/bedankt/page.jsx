'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useShop } from '@/components/ShopProvider';
import { eur } from '@/lib/format';
import { Icon, Img } from '@/components/icons';
import { im, SITE } from '@/lib/data';
export default function Thanks() {
  const [o, setO] = useState(null); const { clear } = useShop();
  useEffect(() => { try { const x = JSON.parse(sessionStorage.getItem('bm_order')); if (x?.paid) { setO(x); clear(); } } catch {} }, [clear]);
  if (!o) return <div className="wrap"><div className="empty" style={{ padding: '64px 0' }}><h2>Geen bestelling gevonden</h2><Link href="/shop" className="btn btn-dark">Naar de shop</Link></div></div>;
  return (
    <div className="wrap paywrap">
      <div className="paybox center">
        <div className="ok">{Icon.check(30)}</div>
        <h1>Dank je wel, {o.first}!</h1>
        <p className="muted">Bestelling <b>{o.id}</b> is betaald. In de echte webshop krijg je nu een bevestiging per e-mail.{o.deliver === 'pick' ? ' We appen je zodra je bestelling klaarligt in de boetiek.' : ' Voor 16:00 besteld? Dan heb je hem morgen in huis.'}</p>
        <div className="sumlist">{o.lines.map((l, i) => <div className="it" key={i}><span className="im"><Img src={im(l.img)} alt="" /><i>{l.q}</i></span><div><b>{l.name}</b><small>{l.opt}</small></div><span>{eur(l.price * l.q)}</span></div>)}
          <div className="row tot"><span>Totaal betaald</span><span>{eur(o.total)}</span></div></div>
        <Link href="/shop" className="btn btn-dark btn-block">Verder winkelen</Link>
        <a href={SITE.instagram} target="_blank" rel="noopener" className="btn btn-line btn-block">{Icon.insta(18)} Volg {SITE.insta}</a>
      </div>
    </div>
  );
}
