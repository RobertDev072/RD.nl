'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { eur } from '@/lib/format';
import { Steps } from '@/components/ui';

export default function Pay() {
  const [o, setO] = useState(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  useEffect(() => {
    try { setO(JSON.parse(sessionStorage.getItem('jhw_order'))); } catch {}
    document.body.classList.add('nobnav');
    return () => document.body.classList.remove('nobnav');
  }, []);
  if (!o) return <div className="wrap" style={{ padding: '48px 16px' }}><div className="empty"><h2>Geen openstaande betaling</h2><p>Ga terug naar de shop om een bestelling te plaatsen.</p><Link href="/shop" className="btn btn-primary">Naar de shop</Link></div></div>;

  const finish = ok => {
    setBusy(true);
    setTimeout(() => {
      try { sessionStorage.setItem('jhw_order', JSON.stringify({ ...o, paid: ok })); } catch {}
      router.push(ok ? '/bedankt' : '/afrekenen');
    }, 900);
  };

  return (
    <div className="wrap" style={{ maxWidth: 660 }}>
      <div style={{ paddingTop: 22 }}><Steps at={2} /></div>
      <div className="paybox" style={{ marginTop: 0 }}>
        <div className="ph">
          <span style={{ fontSize: 14, opacity: .85 }}>Te betalen aan JeHaarwinkel · bestelling {o.id}</span>
          <b>{eur(o.total)}</b>
        </div>
        <div className="pb">
          <div className="demo"><b>Preview-modus.</b> In de echte webshop ga je hier naar de beveiligde betaalpagina van Mollie ({o.payLabel}). In deze preview wordt niets afgeschreven en wordt er geen bestelling geplaatst.</div>
          <div className="row"><span>Betaalmethode</span><b style={{ fontWeight: 500 }}>{o.payLabel}</b></div>
          <div className="row"><span>Subtotaal</span><span>{eur(o.subtotal)}</span></div>
          <div className="row"><span>Verzending</span><span>{o.ship ? eur(o.ship) : 'Gratis'}</span></div>
          <div className="row tot"><span>Totaal</span><span>{eur(o.total)}</span></div>
          <button className="btn btn-primary btn-block" style={{ marginTop: 18, minHeight: 54 }} onClick={() => finish(true)} disabled={busy}>
            {busy ? 'Bezig met verwerken…' : `Betaling afronden (demo)`}
          </button>
          <button className="btn btn-line btn-block" style={{ marginTop: 8 }} onClick={() => finish(false)} disabled={busy}>Annuleren en terug</button>
        </div>
      </div>
    </div>
  );
}
