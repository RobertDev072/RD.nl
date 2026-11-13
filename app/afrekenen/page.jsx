'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useShop } from '@/components/ShopProvider';
import { Icon, Img } from '@/components/icons';
import { eur } from '@/lib/format';
import { im } from '@/lib/data';
const PAYS = [['ideal', 'iDEAL | Wero', 'Direct betalen via je eigen bank'], ['bancontact', 'Bancontact', 'Voor Belgische bankpassen'], ['klarna', 'Klarna', 'Achteraf betalen binnen 30 dagen'], ['creditcard', 'Creditcard', 'Visa, Mastercard, Amex']];
export default function Checkout() {
  const { lines, sub, ship, total, ready } = useShop(); const router = useRouter();
  const [f, setF] = useState({ email: '', first: '', last: '', zip: '', house: '', street: '', city: '', phone: '', deliver: 'ship', pay: 'ideal' });
  const [er, setEr] = useState({}); const [busy, setBusy] = useState(false);
  useEffect(() => { document.body.classList.add('nobnav'); return () => document.body.classList.remove('nobnav'); }, []);
  if (ready && !lines.length) return <div className="wrap"><div className="empty" style={{ padding: '64px 0' }}><h2>Je tas is leeg</h2><Link href="/shop" className="btn btn-dark">Naar de shop</Link></div></div>;
  const pick = f.deliver === 'pick'; const shipNow = pick ? 0 : ship; const tot = sub + shipNow;
  const set = (k, v) => { setF(x => ({ ...x, [k]: v })); setEr(e => ({ ...e, [k]: undefined })); };
  const In = (k, l, p = {}) => <div className={`field ${er[k] ? 'bad' : ''} ${p.cls || ''}`}><label htmlFor={k}>{l}</label><input id={k} value={f[k]} onChange={e => set(k, e.target.value)} {...p.a} />{er[k] && <small className="err">{er[k]}</small>}</div>;
  const go = async e => {
    e.preventDefault(); const x = {};
    if (!/^\S+@\S+\.\S+$/.test(f.email)) x.email = 'Vul een geldig e-mailadres in';
    if (!f.first.trim()) x.first = 'Vul je voornaam in'; if (!f.last.trim()) x.last = 'Vul je achternaam in';
    if (!pick) { if (!/^\d{4}\s?[a-z]{2}$/i.test(f.zip.trim())) x.zip = 'Bijv. 1703 AB'; if (!f.house.trim()) x.house = 'Huisnr.'; if (!f.street.trim()) x.street = 'Vul je straat in'; if (!f.city.trim()) x.city = 'Vul je plaats in'; }
    setEr(x); if (Object.keys(x).length) { setTimeout(() => document.querySelector('.field.bad')?.scrollIntoView({ behavior: 'smooth', block: 'center' })); return; }
    setBusy(true);
    const id = 'BM-' + Date.now().toString().slice(-6);
    const order = { id, ...f, sub, ship: shipNow, total: tot, payLabel: PAYS.find(p => p[0] === f.pay)[1], lines: lines.map(l => ({ name: l.p.name, opt: `${l.colorLabel} · ${l.size}`, q: l.q, price: l.p.price, img: l.p.imgs[0] })) };
    try { sessionStorage.setItem('bm_order', JSON.stringify(order)); } catch {}
    try {
      const r = await (await fetch('/api/mollie', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, method: f.pay, lines: lines.map(l => ({ slug: l.slug, q: l.q })) }) })).json();
      if (r.checkoutUrl) { location.href = r.checkoutUrl; return; }
    } catch {}
    router.push('/betalen');
  };
  return (
    <div className="wrap">
      <form className="co" onSubmit={go} noValidate>
        <div>
          <Link href="/shop" className="muted small">← Verder winkelen</Link>
          <h1 className="coh">Afrekenen</h1>
          <ol className="steps"><li className="done">Tas</li><li className="on">Gegevens</li><li>Betalen</li></ol>
          <div className="panel"><h2><span className="num">1</span>Contact</h2>
            {In('email', 'E-mailadres', { a: { type: 'email', autoComplete: 'email', inputMode: 'email', placeholder: 'naam@voorbeeld.nl' } })}
            <div className="two">{In('first', 'Voornaam', { a: { autoComplete: 'given-name' } })}{In('last', 'Achternaam', { a: { autoComplete: 'family-name' } })}</div>
          </div>
          <div className="panel"><h2><span className="num">2</span>Bezorging</h2>
            {[['ship', 'Thuisbezorgd', ship ? `PostNL · ${eur(ship)}` : 'PostNL · gratis'], ['pick', 'Ophalen in de boetiek', 'Gratis · Leliehofstraat 12, Heerhugowaard']].map(([id, l, s]) => (
              <label key={id} className={`choice ${f.deliver === id ? 'on' : ''}`}><input type="radio" checked={f.deliver === id} onChange={() => set('deliver', id)} /><span><b>{l}</b><small>{s}</small></span></label>))}
            {!pick && <>
              <div className="three">{In('zip', 'Postcode', { a: { autoComplete: 'postal-code', placeholder: '1703 AB' } })}{In('house', 'Huisnr.', { a: { inputMode: 'numeric' } })}{In('add', 'Toev.', { cls: 'opt' })}</div>
              <div className="two">{In('street', 'Straat', { a: { autoComplete: 'address-line1' } })}{In('city', 'Plaats', { a: { autoComplete: 'address-level2' } })}</div>
            </>}
          </div>
          <div className="panel"><h2><span className="num">3</span>Betaalmethode</h2>
            {PAYS.map(([id, l, s]) => <label key={id} className={`choice ${f.pay === id ? 'on' : ''}`}><input type="radio" checked={f.pay === id} onChange={() => set('pay', id)} /><span><b>{l}</b><small>{s}</small></span>{id === 'ideal' && <span className="ideal sm">iDEAL</span>}</label>)}
            <p className="muted small" style={{ marginTop: 10 }}>{Icon.lock(14)} Betalingen verlopen via Mollie. Je bankgegevens komen nooit op deze site.</p>
          </div>
          <div className="paybar"><button className="btn btn-dark btn-block big" disabled={busy}>{Icon.lock(18)} {busy ? 'Even geduld…' : `Betalen · ${eur(tot)}`}</button></div>
        </div>
        <aside className="panel sum">
          <h2>Je bestelling</h2>
          {lines.map(l => <div className="it" key={l.k}><span className="im"><Img src={im(l.p.imgs[0])} alt="" /><i>{l.q}</i></span><div><b>{l.p.name}</b><small>{l.colorLabel} · {l.size}</small></div><span>{eur(l.p.price * l.q)}</span></div>)}
          <div className="row"><span>Subtotaal</span><span>{eur(sub)}</span></div>
          <div className="row"><span>Verzending</span><span>{shipNow ? eur(shipNow) : 'Gratis'}</span></div>
          <div className="row tot"><span>Totaal <small>incl. btw</small></span><span>{eur(tot)}</span></div>
        </aside>
      </form>
    </div>
  );
}
