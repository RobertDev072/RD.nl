'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { eur } from '@/lib/format';

export default function Pay() {
  const [o, setO] = useState(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  useEffect(() => {
    try { setO(JSON.parse(sessionStorage.getItem('hon_order'))); } catch {}
    document.body.classList.add('nobnav'); return () => document.body.classList.remove('nobnav');
  }, []);
  if (!o) return <div className="wrap" style={{ padding: '60px 16px' }}><div className="empty"><h2>Geen openstaande betaling</h2><Link href="/behandelingen" className="btn btn-gold">Naar behandelingen</Link></div></div>;
  const finish = ok => { setBusy(true); setTimeout(() => { try { sessionStorage.setItem('hon_order', JSON.stringify({ ...o, paid: ok })); } catch {} router.push(ok ? '/bedankt' : '/afrekenen'); }, 900); };
  return (
    <div className="wrap" style={{ maxWidth: 620 }}>
      <div className="paybox">
        <div className="ph"><span>Te betalen aan House of Nails by Jasmina · {o.id}</span><b>{eur(o.payNow)}</b></div>
        <div className="pb">
          <div className="demo"><b>Preview-modus.</b> In de echte site ga je hier naar de beveiligde betaalpagina ({o.payLabel}). In deze preview wordt niets afgeschreven en niets geboekt.</div>
          {o.lines.map((l, i) => <div className="row" key={i}><span>{l.q > 1 ? `${l.q}× ` : ''}{l.name}{l.opt ? ` · ${l.opt}` : ''}</span><span>{eur(l.price * l.q)}</span></div>)}
          {o.when && <div className="row"><span>Afspraak</span><span>{o.when}</span></div>}
          <div className="row tot"><span>Nu te betalen</span><span>{eur(o.payNow)}</span></div>
          <button className="btn btn-gold btn-block big" style={{ marginTop: 16 }} onClick={() => finish(true)} disabled={busy}>{busy ? 'Bezig…' : 'Betaling afronden (demo)'}</button>
          <button className="btn btn-line btn-block" style={{ marginTop: 8 }} onClick={() => finish(false)} disabled={busy}>Annuleren en terug</button>
        </div>
      </div>
    </div>
  );
}
