'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { eur } from '@/lib/format';
import { Icon } from '@/components/icons';
const BANKS = ['ABN AMRO', 'ING', 'Rabobank', 'ASN Bank', 'SNS', 'RegioBank', 'Triodos', 'bunq', 'Knab', 'Revolut'];
export default function Pay() {
  const [o, setO] = useState(null); const [bank, setBank] = useState(null); const [st, setSt] = useState(0); const router = useRouter();
  useEffect(() => { try { setO(JSON.parse(sessionStorage.getItem('bm_order'))); } catch {} document.body.classList.add('nobnav'); return () => document.body.classList.remove('nobnav'); }, []);
  if (!o) return <div className="wrap"><div className="empty" style={{ padding: '64px 0' }}><h2>Geen openstaande betaling</h2><Link href="/shop" className="btn btn-dark">Naar de shop</Link></div></div>;
  const pay = () => { setSt(1); setTimeout(() => { sessionStorage.setItem('bm_order', JSON.stringify({ ...o, paid: true })); router.push('/bedankt'); }, 1400); };
  return (
    <div className="wrap paywrap">
      <ol className="steps"><li className="done">Tas</li><li className="done">Gegevens</li><li className="on">Betalen</li></ol>
      <div className="paybox">
        <div className="pb-h"><span className="ideal">iDEAL</span><div><small>BellaMina · {o.id}</small><b>{eur(o.total)}</b></div></div>
        <div className="demo">Demo-betaling: er wordt niets afgeschreven. In de live webshop opent hier de beveiligde betaalpagina van Mollie en daarna de app van je eigen bank.</div>
        {o.pay === 'ideal' ? <>
          <p className="plabel">Kies je bank</p>
          <div className="banks">{BANKS.map(b => <button key={b} className={bank === b ? 'on' : ''} onClick={() => setBank(b)}>{b}</button>)}</div>
        </> : <p className="lead">Betaalmethode: <b>{o.payLabel}</b></p>}
        <button className="btn btn-dark btn-block big" disabled={(o.pay === 'ideal' && !bank) || st} onClick={pay}>{st ? 'Betaling verwerken…' : <>{Icon.lock(18)} {o.pay === 'ideal' ? (bank ? `Betaal met ${bank}` : 'Kies eerst je bank') : 'Betaling afronden'}</>}</button>
        <Link href="/afrekenen" className="muted small center">Annuleren en terug</Link>
      </div>
    </div>
  );
}
