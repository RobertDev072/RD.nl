'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { eur } from '@/lib/format';
import { useShop } from '@/components/ShopProvider';
import { Icon } from '@/components/ui';
import { SITE } from '@/lib/data';

export default function Thanks() {
  const [o, setO] = useState(null);
  const { clear } = useShop();
  useEffect(() => {
    try { const x = JSON.parse(sessionStorage.getItem('hon_order')); if (x && (x.paid || x.payNow === 0)) { setO(x); clear(); } } catch {}
    document.body.classList.add('nobnav'); return () => document.body.classList.remove('nobnav');
  }, [clear]);
  if (!o) return <div className="wrap" style={{ padding: '60px 16px' }}><div className="empty"><h2>Niets gevonden</h2><Link href="/" className="btn btn-gold">Naar home</Link></div></div>;
  const first = o.name.trim().split(' ')[0];
  return (
    <div className="wrap" style={{ maxWidth: 620 }}>
      <div className="paybox">
        <div className="pb center">
          <div className="ok-ic">{Icon.check(30)}</div>
          <h1 className="thx">Dank je wel, {first}!</h1>
          {o.when ? <p className="lead">Je afspraak staat genoteerd op <b>{o.when}</b>. In de echte site krijg je nu een bevestiging per e-mail.</p> : <p className="lead">Je bestelling is ontvangen. In de echte site krijg je nu een bevestiging per e-mail.</p>}
        </div>
        <div className="pb" style={{ borderTop: '1px solid var(--line)' }}>
          {o.lines.map((l, i) => <div className="row" key={i}><span>{l.q > 1 ? `${l.q}× ` : ''}{l.name}{l.opt ? ` · ${l.opt}` : ''}</span><span>{eur(l.price * l.q)}</span></div>)}
          <div className="row tot"><span>Totaal</span><span>{eur(o.total)}</span></div>
          <p className="muted small" style={{ marginTop: 6 }}>{o.payLabel}</p>
          <div className="note">{Icon.pin(16)} {SITE.place} · Gratis parkeren voor de deur</div>
          <Link href="/" className="btn btn-gold btn-block" style={{ marginTop: 12 }}>Terug naar home</Link>
        </div>
      </div>
    </div>
  );
}
