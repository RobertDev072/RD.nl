'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { eur } from '@/lib/format';
import { GIFT, SITE } from '@/lib/data';
import { useShop } from '@/components/ShopProvider';
import { Icon, Qty } from '@/components/ui';

export default function Gift() {
  const { add, openCart } = useShop();
  const router = useRouter();
  const [amt, setAmt] = useState(5000);
  const [custom, setCustom] = useState('');
  const [design, setDesign] = useState(GIFT.designs[0].id);
  const [to, setTo] = useState('');
  const [msg, setMsg] = useState('');
  const [q, setQ] = useState(1);
  useEffect(() => { document.body.classList.add('pdp-page'); return () => document.body.classList.remove('pdp-page'); }, []);
  const value = custom ? Math.max(1000, Math.min(25000, Math.round(+custom.replace(',', '.') * 100) || 0)) : amt;
  const d = GIFT.designs.find(x => x.id === design);
  const buy = go => {
    add({ kind: 'gift', id: `gift-${value}`, slug: 'cadeaubon', name: GIFT.name, opt: eur(value), price: value, meta: { design: d.label, to: to.trim(), msg: msg.trim() } }, q);
    if (go) router.push('/afrekenen'); else openCart();
  };
  return (
    <div className="pdp">
      <div className="pgal">
        <div className={`gcard ${design}`}>
          <img src={SITE.logoLg} alt="" />
          <span className="gk">Cadeaubon</span>
          <b>{eur(value)}</b>
          {to && <span className="gto">voor {to}</span>}
          {msg && <span className="gmsg">“{msg}”</span>}
        </div>
      </div>
      <div className="pinfo">
        <span className="eyebrow">Cadeau geven</span>
        <h1>Cadeaubon</h1>
        <p className="lead">Geef iemand een verwenmoment bij House of Nails. De cadeaubon is te besteden aan alle behandelingen in de salon.</p>
        <div className="pblock">
          <div className="plabel">Kies een bedrag</div>
          <div className="amts">
            {GIFT.amounts.map(a => <button key={a} className={`amt ${!custom && amt === a ? 'on' : ''}`} onClick={() => { setAmt(a); setCustom(''); }}>{eur(a)}</button>)}
            <label className={`amt custom ${custom ? 'on' : ''}`}>€ <input inputMode="decimal" placeholder="Ander bedrag" value={custom} onChange={e => setCustom(e.target.value.replace(/[^0-9,]/g, ''))} aria-label="Ander bedrag (10 tot 250 euro)" /></label>
          </div>
        </div>
        <div className="pblock">
          <div className="plabel">Ontwerp</div>
          <div className="amts">{GIFT.designs.map(x => <button key={x.id} className={`amt ${design === x.id ? 'on' : ''}`} onClick={() => setDesign(x.id)}>{x.label}</button>)}</div>
        </div>
        <div className="pblock">
          <label className="plabel" htmlFor="gto">Voor wie? <span className="muted">(optioneel)</span></label>
          <input id="gto" className="input" value={to} maxLength={30} onChange={e => setTo(e.target.value)} placeholder="Naam ontvanger" />
          <label className="plabel" htmlFor="gmsg" style={{ marginTop: 12 }}>Persoonlijke tekst <span className="muted">(optioneel)</span></label>
          <textarea id="gmsg" className="input" rows={2} maxLength={90} value={msg} onChange={e => setMsg(e.target.value)} placeholder="Bijv. Fijne verjaardag, geniet ervan!" />
        </div>
        <div className="pbuy">
          <Qty value={q} onChange={v => setQ(Math.max(1, v))} />
          <button className="btn btn-gold" onClick={() => buy(false)}>{Icon.bag(18)} In winkelmand · {eur(value * q)}</button>
        </div>
        <ul className="pperks">
          <li>{Icon.check()} Direct per e-mail als PDF, of op te halen in de salon</li>
          <li>{Icon.check()} Veilig betalen met iDEAL | Wero</li>
        </ul>
      </div>
      <div className="stickybuy">
        <div><small>Cadeaubon</small><b>{eur(value * q)}</b></div>
        <button className="btn btn-gold" onClick={() => buy(true)}>{Icon.bag(18)} Bestellen</button>
      </div>
    </div>
  );
}
