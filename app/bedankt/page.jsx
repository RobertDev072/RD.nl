'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { eur, WA } from '@/lib/menu';
import { useShop } from '@/components/ShopProvider';
import { Steps } from '@/components/ui';

export default function Thanks() {
  const [o, setO] = useState(null);
  const { clear } = useShop();
  useEffect(() => { try { const x = JSON.parse(sessionStorage.getItem('hh_order')); if (x) { setO(x); clear(); } } catch {} }, [clear]);
  if (!o) return <div className="wrap" style={{ padding: '40px 16px' }}><div className="empty"><h2>Geen bestelling gevonden</h2><Link href="/" className="btn btn-green" style={{ marginTop: 12 }}>Naar het menu</Link></div></div>;

  const msg = `Hoi Hewitt & Hewitt! Mijn bestelling ${o.id}:\n\n${o.lines.map(l => `${l.q}x ${l.n}${l.o ? ` (${l.o})` : ''} – ${eur(l.t)}`).join('\n')}\n\nTotaal: ${eur(o.total)} (${o.pay === 'ideal' ? 'betaald via iDEAL' : 'betalen bij ontvangst'})\n${o.mode === 'bezorgen' ? `Bezorgen: ${o.street}, ${o.zip} ${o.city}` : 'Afhalen bij de foodtruck'}\nWanneer: ${o.day}, ${o.time}\nNaam: ${o.name} · ${o.phone}${o.note ? `\nOpmerking: ${o.note}` : ''}`;

  return (
    <div className="wrap" style={{ maxWidth: 640 }}>
      <div style={{ paddingTop: 24 }}><Steps at={3} /></div>
      <div className="paybox" style={{ marginTop: 0 }}>
        <div className="pb" style={{ textAlign: 'center' }}>
          <div className="check"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2f7a3f" strokeWidth="2.6"><path d="M5 12l5 5L20 7" /></svg></div>
          <h1 style={{ fontSize: 26 }}>Bedankt {o.name.split(' ')[0]}!</h1>
          <p className="muted" style={{ margin: '6px 0 0' }}>Je bestelling <b style={{ color: 'var(--ink)' }}>{o.id}</b> is ontvangen{o.pay === 'ideal' ? ' en betaald' : ''}. We bevestigen je bestelling zo snel mogelijk.</p>
        </div>
        <div className="pb" style={{ borderTop: '1px solid var(--line)' }}>
          <div className="row"><span className="muted">{o.mode === 'bezorgen' ? 'Bezorgen op' : 'Afhalen op'}</span><b>{o.day}, {o.time}</b></div>
          {o.mode === 'bezorgen' && <div className="row"><span className="muted">Adres</span><span style={{ textAlign: 'right' }}>{o.street}, {o.zip} {o.city}</span></div>}
          <div className="row"><span className="muted">Betaling</span><span>{o.pay === 'ideal' ? 'iDEAL (demo)' : 'Bij ontvangst'}</span></div>
          <div style={{ margin: '12px 0', borderTop: '1px solid var(--line)' }} />
          {o.lines.map((l, i) => <div className="row" key={i}><span>{l.q}× {l.n}{l.o && <span className="muted"> ({l.o})</span>}</span><span>{eur(l.t)}</span></div>)}
          <div className="row"><span>{o.mode === 'bezorgen' ? 'Bezorgkosten' : 'Afhalen'}</span><span>{o.mode === 'bezorgen' ? eur(o.delivery) : 'Gratis'}</span></div>
          <div className="row tot"><span>Totaal</span><span>{eur(o.total)}</span></div>
          <a className="btn btn-wa btn-block" style={{ marginTop: 16 }} href={`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener">Stuur bestelling ook via WhatsApp</a>
          <Link href="/" className="btn btn-line btn-block" style={{ marginTop: 8 }}>Terug naar de winkel</Link>
        </div>
      </div>
    </div>
  );
}
