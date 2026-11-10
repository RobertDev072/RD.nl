'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { eur } from '@/lib/format';
import { useShop } from '@/components/ShopProvider';
import { Icon, Steps } from '@/components/ui';

export default function Thanks() {
  const [o, setO] = useState(null);
  const { clear } = useShop();
  useEffect(() => {
    try { const x = JSON.parse(sessionStorage.getItem('jhw_order')); if (x?.paid) { setO(x); clear(); } } catch {}
    document.body.classList.add('nobnav');
    return () => document.body.classList.remove('nobnav');
  }, [clear]);
  if (!o) return <div className="wrap" style={{ padding: '48px 16px' }}><div className="empty"><h2>Geen bestelling gevonden</h2><Link href="/shop" className="btn btn-primary" style={{ marginTop: 12 }}>Naar de shop</Link></div></div>;

  return (
    <div className="wrap" style={{ maxWidth: 660 }}>
      <div style={{ paddingTop: 22 }}><Steps at={3} /></div>
      <div className="paybox" style={{ marginTop: 0 }}>
        <div className="pb" style={{ textAlign: 'center' }}>
          <div className="ok-ic">{Icon.check(30)}</div>
          <h1 style={{ fontSize: 40 }}>Dank je wel, {o.first}!</h1>
          <p className="muted" style={{ marginTop: 6 }}>Je bestelling <b style={{ color: 'var(--ink)' }}>{o.id}</b> is ontvangen. In de echte webshop krijg je nu een bevestiging per e-mail. Voor 16:00 besteld op een werkdag? Dan gaat je pakketje dezelfde dag nog de deur uit.</p>
        </div>
        <div className="pb" style={{ borderTop: '1px solid var(--line)' }}>
          {o.lines.map((l, i) => <div className="row" key={i}><span>{l.q}× {l.name}{l.opt && <span className="muted"> ({l.opt})</span>}</span><span>{eur(l.price * l.q)}</span></div>)}
          <div className="row"><span>Verzending</span><span>{o.ship ? eur(o.ship) : 'Gratis'}</span></div>
          <div className="row tot"><span>Totaal</span><span>{eur(o.total)}</span></div>
          <div className="note plum" style={{ marginTop: 14 }}>Bezorgen op: {o.street} {o.house}{o.add ? ` ${o.add}` : ''}, {o.zip} {o.city} · {o.payLabel}</div>
          <Link href="/shop" className="btn btn-primary btn-block" style={{ marginTop: 12 }}>Verder winkelen</Link>
        </div>
      </div>
    </div>
  );
}
