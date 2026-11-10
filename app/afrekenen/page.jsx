'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { eur } from '@/lib/format';
import { OPEN } from '@/lib/data';
import { useShop } from '@/components/ShopProvider';
import { Icon, Img, Steps } from '@/components/ui';

const DAYS = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
const MONTHS = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
const hm = m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;

function useDays() {
  return useMemo(() => {
    const out = []; const d = new Date(); d.setHours(0, 0, 0, 0);
    for (let i = 1; out.length < 18 && i < 30; i++) {
      const x = new Date(d); x.setDate(d.getDate() + i);
      out.push({ date: x, key: x.toISOString().slice(0, 10), open: OPEN[x.getDay()] });
    }
    return out;
  }, []);
}

export default function Checkout() {
  const { cart, total, treatments, gifts, ready, remove } = useShop();
  const router = useRouter();
  const days = useDays();
  const [day, setDay] = useState(null);
  const [time, setTime] = useState(null);
  const [f, setF] = useState({ name: '', email: '', phone: '', note: '', giftDelivery: 'email', pay: '' });
  const [errs, setErrs] = useState({});
  useEffect(() => { document.body.classList.add('nobnav'); return () => document.body.classList.remove('nobnav'); }, []);
  const set = (k, v) => { setF(x => ({ ...x, [k]: v })); setErrs(e => ({ ...e, [k]: undefined })); };

  const hasT = treatments.length > 0, hasG = gifts.length > 0;
  const tSum = treatments.reduce((a, l) => a + l.price, 0), gSum = gifts.reduce((a, l) => a + l.price * l.q, 0);
  const pays = [
    ...(hasT && !hasG ? [{ id: 'salon', label: 'Betalen in de salon', sub: 'Je betaalt na je behandeling, pin of contant' }] : []),
    { id: 'ideal', label: 'iDEAL | Wero', sub: hasT && !hasG ? 'Nu online betalen' : 'Direct betalen via je eigen bank' },
    { id: 'card', label: 'Creditcard', sub: 'Visa, Mastercard' }
  ];
  const pay = pays.some(p => p.id === f.pay) ? f.pay : pays[0].id;
  const payNow = pay === 'salon' ? gSum : total;
  const sel = days.find(d => d.key === day);
  const slots = useMemo(() => {
    if (!sel?.open) return [];
    const [a, b] = sel.open; const out = [];
    for (let m = a; m <= b - 90; m += 30) out.push(m);
    return out;
  }, [sel]);

  if (ready && cart.length === 0) {
    return <div className="wrap" style={{ padding: '60px 16px' }}><div className="empty"><h2>Je hebt nog niets gekozen</h2><p>Kies eerst een behandeling of een cadeaubon.</p><Link href="/behandelingen" className="btn btn-gold">Bekijk behandelingen</Link></div></div>;
  }

  const submit = e => {
    e.preventDefault();
    const er = {};
    if (hasT && (!day || time == null)) er.slot = 'Kies een datum en tijd.';
    if (!f.name.trim()) er.name = 'Vul je naam in.';
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) er.email = 'Vul een geldig e-mailadres in.';
    if (hasT && !/^[0-9+\s()-]{9,16}$/.test(f.phone.trim())) er.phone = 'Vul je telefoonnummer in.';
    setErrs(er);
    if (Object.keys(er).length) { setTimeout(() => document.querySelector('.bad, .slot-err')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0); return; }
    const order = {
      id: 'HON-' + Date.now().toString().slice(-6), ...f, pay, payLabel: pays.find(p => p.id === pay)?.label,
      when: hasT ? `${DAYS[sel.date.getDay()]} ${sel.date.getDate()} ${MONTHS[sel.date.getMonth()]} om ${hm(time)}` : null,
      total, payNow, lines: cart.map(l => ({ name: l.name, opt: l.opt, q: l.q, price: l.price, kind: l.kind, to: l.meta?.to }))
    };
    try { sessionStorage.setItem('hon_order', JSON.stringify(order)); } catch {}
    router.push(payNow > 0 ? '/betalen' : '/bedankt?direct=1');
  };

  const Field = ({ k, label, type = 'text', ac, ph, opt }) => (
    <div className={`field ${errs[k] ? 'bad' : ''}`}>
      <label className="label" htmlFor={k}>{label}{opt && <span className="muted"> (optioneel)</span>}</label>
      <input id={k} className="input" type={type} value={f[k]} onChange={e => set(k, e.target.value)} autoComplete={ac} placeholder={ph} inputMode={type === 'tel' ? 'tel' : type === 'email' ? 'email' : undefined} />
      {errs[k] && <div className="err">{errs[k]}</div>}
    </div>
  );
  let n = 0;
  return (
    <div className="wrap">
      <form className="co" onSubmit={submit} noValidate>
        <div>
          <Link href="/behandelingen" className="muted small">← Verder kijken</Link>
          <h1 className="coh">{hasT ? 'Afspraak maken' : 'Afrekenen'}</h1>
          <Steps at={1} labels={hasT ? ['Behandeling', 'Datum & gegevens', 'Bevestigen'] : ['Winkelmand', 'Gegevens', 'Betalen']} />

          {hasT && (
            <div className="panel">
              <h2><span className="num">{++n}</span>Kies datum &amp; tijd</h2>
              <div className="days" role="listbox" aria-label="Datum">
                {days.map(d => (
                  <button type="button" key={d.key} disabled={!d.open} className={`day ${day === d.key ? 'on' : ''}`} onClick={() => { setDay(d.key); setTime(null); setErrs(e => ({ ...e, slot: undefined })); }}>
                    <small>{DAYS[d.date.getDay()]}</small><b>{d.date.getDate()}</b><small>{MONTHS[d.date.getMonth()]}</small>
                  </button>
                ))}
              </div>
              {sel && (
                <div className="slots">
                  {slots.map(m => <button type="button" key={m} className={`slot ${time === m ? 'on' : ''}`} onClick={() => { setTime(m); setErrs(e => ({ ...e, slot: undefined })); }}>{hm(m)}</button>)}
                </div>
              )}
              {!sel && <p className="muted small" style={{ marginTop: 10 }}>Kies eerst een dag. Op zondag is de salon gesloten.</p>}
              {errs.slot && <div className="err slot-err">{errs.slot}</div>}
              <p className="demo" style={{ marginTop: 14 }}>Preview: de tijden hierboven volgen de openingstijden. In de echte site zie je hier de live agenda van de salon.</p>
            </div>
          )}

          <div className="panel">
            <h2><span className="num">{++n}</span>Je gegevens</h2>
            {Field({ k: 'name', label: 'Naam', ac: 'name' })}
            <div className="two">{Field({ k: 'email', label: 'E-mailadres', type: 'email', ac: 'email', ph: 'naam@voorbeeld.nl' })}{Field({ k: 'phone', label: 'Telefoonnummer', type: 'tel', ac: 'tel', opt: !hasT })}</div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="label" htmlFor="note">{hasT ? 'Wensen of opmerking' : 'Opmerking'} <span className="muted">(optioneel)</span></label>
              <textarea id="note" className="input" rows={2} value={f.note} onChange={e => set('note', e.target.value)} placeholder={hasT ? 'Bijv. kleurwens of inspiratie' : ''} />
            </div>
          </div>

          {hasG && (
            <div className="panel">
              <h2><span className="num">{++n}</span>Cadeaubon ontvangen</h2>
              {[['email', 'Per e-mail (PDF)', 'Direct na betaling in je mailbox'], ['salon', 'Ophalen in de salon', 'Mooi verpakt, klaar om te geven']].map(([id, l, s]) => (
                <label key={id} className={`choice ${f.giftDelivery === id ? 'on' : ''}`}><input type="radio" name="gd" checked={f.giftDelivery === id} onChange={() => set('giftDelivery', id)} /><span><b>{l}</b><span>{s}</span></span></label>
              ))}
            </div>
          )}

          <div className="panel">
            <h2><span className="num">{++n}</span>Betalen</h2>
            {pays.map(p => (
              <label key={p.id} className={`choice ${pay === p.id ? 'on' : ''}`}>
                <input type="radio" name="pay" checked={pay === p.id} onChange={() => set('pay', p.id)} />
                <span><b>{p.label}</b><span>{p.sub}</span></span>
              </label>
            ))}
          </div>

          <div className="paybar">
            <button className="btn btn-gold btn-block big">{Icon.lock(18)} {payNow > 0 ? `Betalen · ${eur(payNow)}` : 'Afspraak bevestigen'}</button>
          </div>
        </div>

        <aside className="panel sum">
          <h2 className="sumh">Overzicht</h2>
          {treatments.map(l => (
            <div className="it" key={l.k}><span className="im"><Img src={l.img} alt="" /></span><div className="nn"><b>{l.name}</b>{l.opt && <small>{l.opt}</small>}</div><span>{eur(l.price)}</span><button type="button" className="rmx" onClick={() => remove(l.k)} aria-label={`${l.name} verwijderen`}>×</button></div>
          ))}
          {gifts.map(l => (
            <div className="it" key={l.k}><span className="im giftmini"><b>Bon</b></span><div className="nn"><b>{l.q}× Cadeaubon {l.opt}</b><small>{[l.meta?.design, l.meta?.to && `voor ${l.meta.to}`].filter(Boolean).join(' · ')}</small></div><span>{eur(l.price * l.q)}</span><button type="button" className="rmx" onClick={() => remove(l.k)} aria-label="Cadeaubon verwijderen">×</button></div>
          ))}
          {hasT && sel && time != null && <div className="when">{Icon.cal(17)} {DAYS[sel.date.getDay()]} {sel.date.getDate()} {MONTHS[sel.date.getMonth()]} om {hm(time)}</div>}
          <div className="row tot"><span>Totaal</span><span>{eur(total)}</span></div>
          {pay === 'salon' && hasT && <p className="muted small">De behandeling ({eur(tSum)}) betaal je in de salon.</p>}
        </aside>
      </form>
    </div>
  );
}
