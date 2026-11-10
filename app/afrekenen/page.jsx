'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { eur, SHIPPING, shippingFor, PAYMENTS } from '@/lib/format';
import { useShop } from '@/components/ShopProvider';
import { Icon, PImg, Qty, Steps } from '@/components/ui';

const EMPTY = { email: '', phone: '', first: '', last: '', country: 'NL', zip: '', house: '', add: '', street: '', city: '', note: '', pay: 'ideal', news: false };

export default function Checkout() {
  const { cart, subtotal, savings, ready, setQty } = useShop();
  const router = useRouter();
  const [f, setF] = useState(EMPTY);
  const [errs, setErrs] = useState({});
  const [open, setOpen] = useState(false);
  useEffect(() => { document.body.classList.add('nobnav'); return () => document.body.classList.remove('nobnav'); }, []);

  const set = (k, v) => { setF(x => ({ ...x, [k]: v })); setErrs(e => ({ ...e, [k]: undefined })); };
  const ship = shippingFor(f.country, subtotal);
  const total = subtotal + ship;
  const S = SHIPPING[f.country];
  const left = Math.max(0, S.free - subtotal);
  const pays = PAYMENTS.filter(p => !p.country || p.country === f.country);
  useEffect(() => { if (!pays.find(p => p.id === f.pay)) set('pay', 'ideal'); }, [f.country]); // eslint-disable-line

  if (ready && cart.length === 0) {
    return <div className="wrap" style={{ padding: '48px 16px' }}><div className="empty"><h2>Je winkelmand is leeg</h2><p>Voeg eerst iets toe uit de shop.</p><Link href="/shop" className="btn btn-primary">Naar de shop</Link></div></div>;
  }

  const submit = e => {
    e.preventDefault();
    const req = ['email', 'first', 'last', 'zip', 'house', 'street', 'city'];
    const er = {};
    req.forEach(k => { if (!String(f[k]).trim()) er[k] = 'Vul dit veld in.'; });
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email.trim())) er.email = 'Vul een geldig e-mailadres in.';
    if (f.zip && f.country === 'NL' && !/^\d{4}\s?[a-zA-Z]{2}$/.test(f.zip.trim())) er.zip = 'Bijvoorbeeld 1814 GW.';
    if (f.zip && f.country === 'BE' && !/^\d{4}$/.test(f.zip.trim())) er.zip = 'Bijvoorbeeld 2000.';
    if (f.phone && !/^[0-9+\s()-]{9,16}$/.test(f.phone.trim())) er.phone = 'Vul een geldig telefoonnummer in.';
    setErrs(er);
    if (Object.keys(er).length) { setTimeout(() => document.querySelector('.field.bad')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0); return; }
    const order = {
      id: 'JHW-' + Date.now().toString().slice(-7), at: new Date().toISOString(), ...f,
      ship, subtotal, savings, total, payLabel: PAYMENTS.find(p => p.id === f.pay)?.label,
      lines: cart.map(l => ({ name: l.name, opt: l.opt, q: l.q, price: l.price, img: l.img }))
    };
    try { sessionStorage.setItem('jhw_order', JSON.stringify(order)); } catch {}
    router.push('/betalen');
  };

  const Field = ({ k, label, type = 'text', ac, ph, opt }) => (
    <div className={`field ${errs[k] ? 'bad' : ''}`}>
      <label className="label" htmlFor={k}>{label}{opt && <span className="muted"> (optioneel)</span>}</label>
      <input id={k} className="input" type={type} value={f[k]} onChange={e => set(k, e.target.value)} autoComplete={ac} placeholder={ph}
        inputMode={type === 'tel' ? 'tel' : type === 'email' ? 'email' : undefined} />
      {errs[k] && <div className="err">{errs[k]}</div>}
    </div>
  );

  return (
    <div className="wrap">
      <form className="co" onSubmit={submit} noValidate>
        <div>
          <Link href="/shop" className="muted" style={{ fontSize: 14 }}>← Verder winkelen</Link>
          <h1 style={{ fontSize: 'clamp(32px,4vw,44px)', margin: '4px 0 2px' }}>Afrekenen</h1>
          <Steps at={1} />

          <div className="panel">
            <h2><span className="num">1</span>Contactgegevens</h2>
            {Field({ k: 'email', label: 'E-mailadres', type: 'email', ac: 'email', ph: 'naam@voorbeeld.nl' })}
            {Field({ k: 'phone', label: 'Telefoonnummer', type: 'tel', ac: 'tel', opt: true, ph: 'Voor de bezorger' })}
          </div>

          <div className="panel">
            <h2><span className="num">2</span>Bezorgadres</h2>
            <div className="field">
              <span className="label">Land</span>
              <div className="two">
                {Object.entries(SHIPPING).map(([code, s]) => (
                  <label key={code} className={`choice ${f.country === code ? 'on' : ''}`} style={{ marginBottom: 0 }}>
                    <input type="radio" name="country" checked={f.country === code} onChange={() => set('country', code)} />
                    <span><b>{s.label}</b><span>{subtotal >= s.free ? 'Gratis verzending' : `${eur(s.cost)} · gratis vanaf ${eur(s.free)}`}</span></span>
                  </label>
                ))}
              </div>
            </div>
            <div className="two">{Field({ k: 'first', label: 'Voornaam', ac: 'given-name' })}{Field({ k: 'last', label: 'Achternaam', ac: 'family-name' })}</div>
            <div className="three">{Field({ k: 'zip', label: 'Postcode', ac: 'postal-code', ph: f.country === 'NL' ? '1814 GW' : '2000' })}{Field({ k: 'house', label: 'Huisnummer', ac: 'address-line2' })}{Field({ k: 'add', label: 'Toevoeging', opt: true })}</div>
            <div className="two">{Field({ k: 'street', label: 'Straat', ac: 'address-line1' })}{Field({ k: 'city', label: 'Plaats', ac: 'address-level2' })}</div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="label" htmlFor="note">Opmerking <span className="muted">(optioneel)</span></label>
              <textarea id="note" className="input" rows={2} value={f.note} onChange={e => set('note', e.target.value)} placeholder="Bijv. bezorgen bij de buren" />
            </div>
          </div>

          <div className="panel">
            <h2><span className="num">3</span>Verzending</h2>
            <label className="choice on" style={{ marginBottom: 0 }}>
              <input type="radio" checked readOnly />
              <span><b>PostNL standaard</b><span>{S.eta} · voor 16:00 besteld, vandaag verzonden</span></span>
              <span className="ic">{ship ? eur(ship) : 'Gratis'}</span>
            </label>
            {left > 0 && <div className="note plum">Nog {eur(left)} tot gratis verzending naar {S.label}.</div>}
          </div>

          <div className="panel">
            <h2><span className="num">4</span>Betaalmethode</h2>
            {pays.map(p => (
              <label key={p.id} className={`choice ${f.pay === p.id ? 'on' : ''}`}>
                <input type="radio" name="pay" checked={f.pay === p.id} onChange={() => set('pay', p.id)} />
                <span><b>{p.label}</b><span>{p.sub}</span></span>
              </label>
            ))}
            <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>Betalingen worden veilig verwerkt via Mollie.</p>
          </div>

          <div className="paybar">
            <button className="btn btn-primary btn-block" style={{ minHeight: 54, fontSize: 16.5 }}>{Icon.lock(18)} Betalen · {eur(total)}</button>
            <p className="secure">Door te bestellen ga je akkoord met de algemene voorwaarden</p>
          </div>
        </div>

        <aside className={`panel sum ${open ? 'open' : ''}`}>
          <button type="button" className="sumtoggle" onClick={() => setOpen(v => !v)} aria-expanded={open}>
            <span><b>Je bestelling</b> <span className="muted">({cart.reduce((a, l) => a + l.q, 0)})</span></span>
            <span><b>{eur(total)}</b> <span className="chev">▾</span></span>
          </button>
          <h2 className="sumh" style={{ marginBottom: 6 }}>Je bestelling</h2>
          <div className="items">
            {cart.map(l => (
              <div className="it" key={l.k}>
                <span className="im"><PImg src={l.img} alt="" /><b>{l.q}</b></span>
                <div className="n"><div style={{ fontWeight: 500, lineHeight: 1.3 }}>{l.name}</div>{l.opt && <div className="muted" style={{ fontSize: 13 }}>{l.opt}</div>}<div style={{ marginTop: 6 }}><Qty small value={l.q} onChange={q => setQty(l.k, q)} /></div></div>
                <b style={{ fontWeight: 600 }}>{eur(l.price * l.q)}</b>
              </div>
            ))}
          </div>
          <div className="sumrows">
            <div className="row"><span>Subtotaal</span><span>{eur(subtotal)}</span></div>
            {savings > 0 && <div className="row" style={{ color: 'var(--sale)' }}><span>Korting</span><span>−{eur(savings)}</span></div>}
            <div className="row"><span>Verzending ({S.label})</span><span>{ship ? eur(ship) : 'Gratis'}</span></div>
            <div className="row tot"><span>Totaal</span><span>{eur(total)}</span></div>
            <p className="muted" style={{ fontSize: 13 }}>Inclusief btw</p>
          </div>
        </aside>
      </form>
    </div>
  );
}
