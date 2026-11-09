'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { eur } from '@/lib/menu';
import { Steps } from '@/components/ui';

export default function Pay() {
  const [o, setO] = useState(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  useEffect(() => { try { setO(JSON.parse(sessionStorage.getItem('hh_order'))); } catch {} }, []);
  if (!o) return <div className="wrap" style={{ padding: '40px 16px' }}><div className="empty"><h2>Geen openstaande betaling</h2><p>Ga terug naar het menu om een bestelling te plaatsen.</p><Link href="/" className="btn btn-green">Naar het menu</Link></div></div>;

  const pay = ok => {
    setBusy(true);
    setTimeout(() => {
      try { sessionStorage.setItem('hh_order', JSON.stringify({ ...o, paid: ok, payStatus: ok ? 'betaald' : 'geannuleerd' })); } catch {}
      router.push(ok ? '/bedankt' : '/afrekenen');
    }, 900);
  };

  return (
    <div className="wrap" style={{ maxWidth: 640 }}>
      <div style={{ paddingTop: 24 }}><Steps at={2} /></div>
      <div className="paybox" style={{ marginTop: 0 }}>
        <div className="ph">
          <span style={{ fontSize: 14, opacity: .85 }}>Te betalen aan Hewitt &amp; Hewitt · bestelling {o.id}</span>
          <b>{eur(o.total)}</b>
        </div>
        <div className="pb">
          <div className="demo"><b>Preview-modus.</b> In de echte webshop word je hier doorgestuurd naar iDEAL (via Mollie) en betaal je in de app van je eigen bank. In deze preview wordt er niets afgeschreven.</div>
          <h2 style={{ fontSize: 19, marginBottom: 8 }}>Betalen met iDEAL</h2>
          <ol style={{ paddingLeft: 18, color: 'var(--muted)', fontSize: 15, marginBottom: 18 }}>
            <li>Je gaat naar de beveiligde iDEAL-betaalpagina.</li>
            <li>Je bevestigt de betaling in je bank-app.</li>
            <li>Je komt terug en ontvangt direct je bevestiging.</li>
          </ol>
          <div className="row"><span>Subtotaal</span><span>{eur(o.subtotal)}</span></div>
          <div className="row"><span>{o.mode === 'bezorgen' ? `Bezorgen (${o.zoneName.toLowerCase()})` : 'Afhalen'}</span><span>{o.mode === 'bezorgen' ? eur(o.delivery) : 'Gratis'}</span></div>
          <div className="row tot"><span>Totaal</span><span>{eur(o.total)}</span></div>
          <button className="btn btn-red btn-block" style={{ marginTop: 16, minHeight: 52 }} onClick={() => pay(true)} disabled={busy}>
            {busy ? 'Bezig met verwerken…' : `Betaal ${eur(o.total)} met iDEAL (demo)`}
          </button>
          <button className="btn btn-line btn-block" style={{ marginTop: 8 }} onClick={() => pay(false)} disabled={busy}>Annuleren en terug</button>
          <p className="secure">🔒 Beveiligde betaling via iDEAL</p>
        </div>
      </div>
    </div>
  );
}
