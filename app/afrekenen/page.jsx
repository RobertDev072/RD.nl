'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { eur, MIN_ORDER, ZONES } from '@/lib/menu';
import { useShop } from '@/components/ShopProvider';
import { ProductImg, Qty, Steps } from '@/components/ui';

const TIMES = ['Zo snel mogelijk', '11:00–12:00', '12:00–13:00', '13:00–14:00', '14:00–15:00', '15:00–16:00', '16:00–17:00', '17:00–18:00', '18:00–19:00', '19:00–20:00', '20:00–21:00', '21:00–22:00'];
const dayLabel = d => d.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' });

export default function Checkout() {
  const { lines, subtotal, ready, setQty } = useShop();
  const router = useRouter();
  const days = useMemo(() => { const out = []; const d = new Date(); for (let k = 0; out.length < 3 && k < 10; k++) { const t = new Date(d); t.setDate(d.getDate() + k); if ([5, 6, 0].includes(t.getDay())) out.push(dayLabel(t)); } return out; }, []);
  const [f, setF] = useState({ mode: 'bezorgen', zone: 'paars', day: '', time: TIMES[0], name: '', phone: '', email: '', street: '', zip: '', city: '', note: '', pay: 'ideal' });
  const [errs, setErrs] = useState({});
  useEffect(() => { setF(x => ({ ...x, day: x.day || days[0] })); }, [days]);
  const set = (k, v) => { setF(x => ({ ...x, [k]: v })); setErrs(e => ({ ...e, [k]: undefined })); };

  const zone = ZONES.find(z => z.id === f.zone);
  const delivery = f.mode === 'bezorgen' ? zone.price : 0;
  const total = subtotal + delivery;
  const tooLow = f.mode === 'bezorgen' && subtotal < MIN_ORDER;
  const hasPre = lines.some(l => l.p.pre);

  if (ready && lines.length === 0) {
    return <div className="wrap" style={{ padding: '40px 16px' }}><div className="empty"><h2>Je winkelmand is leeg</h2><p>Voeg eerst iets toe uit het menu.</p><Link href="/#menu" className="btn btn-green">Naar het menu</Link></div></div>;
  }

  const submit = e => {
    e.preventDefault();
    const req = ['name', 'phone', 'email'].concat(f.mode === 'bezorgen' ? ['street', 'zip', 'city'] : []);
    const er = {};
    req.forEach(k => { if (!String(f[k]).trim()) er[k] = 'Vul dit veld in.'; });
    if (f.phone && !/^[0-9+\s-]{9,15}$/.test(f.phone.trim())) er.phone = 'Vul een geldig telefoonnummer in.';
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email.trim())) er.email = 'Vul een geldig e-mailadres in.';
    if (f.mode === 'bezorgen' && f.zip && !/^\d{4}\s?[a-zA-Z]{2}$/.test(f.zip.trim())) er.zip = 'Bijvoorbeeld 1851 AB.';
    setErrs(er);
    if (Object.keys(er).length) { document.querySelector('.field.bad')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    const order = { id: 'HH-' + Date.now().toString().slice(-6), at: new Date().toISOString(), ...f, zoneName: zone.name, delivery, subtotal, total, lines: lines.map(l => ({ n: l.p.n, o: l.o, q: l.q, u: l.u, t: l.t, i: l.p.i })) };
    try { sessionStorage.setItem('hh_order', JSON.stringify(order)); } catch {}
    router.push(f.pay === 'ideal' ? '/betalen' : '/bedankt');
  };

  const Field = ({ k, label, type = 'text', ac, ph, half }) => (
    <div className={`field ${errs[k] ? 'bad' : ''}`}>
      <label className="label" htmlFor={k}>{label}</label>
      <input id={k} className="input" type={type} value={f[k]} onChange={e => set(k, e.target.value)} autoComplete={ac} placeholder={ph} inputMode={type === 'tel' ? 'tel' : undefined} />
      {errs[k] && <div className="err">{errs[k]}</div>}
    </div>
  );

  return (
    <div className="wrap">
      <form className="co" onSubmit={submit} noValidate>
        <div>
          <Link href="/" className="muted" style={{ fontSize: 14 }}>← Verder winkelen</Link>
          <h1 style={{ margin: '6px 0 4px' }}>Afrekenen</h1>
          <Steps at={1} />

          <div className="panel">
            <h2><span className="num">1</span>Bezorgen of afhalen</h2>
            {[['bezorgen', 'Bezorgen', 'Vrijdag t/m zondag · minimaal €30', `${eur(zone.price)}`], ['afhalen', 'Afhalen bij de foodtruck', 'Locatie bevestigen we via WhatsApp', 'Gratis']].map(([v, t, s, c]) => (
              <label key={v} className={`choice ${f.mode === v ? 'on' : ''}`}><input type="radio" name="mode" checked={f.mode === v} onChange={() => set('mode', v)} /><span><b>{t}</b><span>{s}</span></span><span className="ic">{c}</span></label>
            ))}
            {f.mode === 'bezorgen' && (
              <div className="field" style={{ marginTop: 10 }}>
                <label className="label" htmlFor="zone">Bezorgzone</label>
                <select id="zone" className="input" value={f.zone} onChange={e => set('zone', e.target.value)}>
                  {ZONES.map(z => <option key={z.id} value={z.id}>{z.name} – {eur(z.price)}</option>)}
                </select>
                <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>Twijfel je? We controleren je postcode en laten het je weten.</p>
              </div>
            )}
            {tooLow && <div className="note warn">Voor bezorging is de minimale bestelling €30. Voeg nog {eur(MIN_ORDER - subtotal)} toe, of kies afhalen.</div>}
          </div>

          <div className="panel">
            <h2><span className="num">2</span>Wanneer?</h2>
            <div className="two">
              <div className="field"><label className="label" htmlFor="day">Dag</label><select id="day" className="input" value={f.day} onChange={e => set('day', e.target.value)}>{days.map(d => <option key={d}>{d}</option>)}</select></div>
              <div className="field"><label className="label" htmlFor="time">Tijd</label><select id="time" className="input" value={f.time} onChange={e => set('time', e.target.value)}>{TIMES.map(t => <option key={t}>{t}</option>)}</select></div>
            </div>
            {hasPre && <div className="note warn" style={{ marginBottom: 0 }}>Je bestelling bevat een gerecht dat minimaal 24 uur van tevoren besteld moet worden. Kies een dag die minstens een dag later is.</div>}
          </div>

          <div className="panel">
            <h2><span className="num">3</span>Je gegevens</h2>
            <div className="two">{Field({ k: 'name', label: 'Naam', ac: 'name' })}{Field({ k: 'phone', label: 'Telefoonnummer', type: 'tel', ac: 'tel', ph: '06 12345678' })}</div>
            {Field({ k: 'email', label: 'E-mailadres (voor je bevestiging)', type: 'email', ac: 'email' })}
            {f.mode === 'bezorgen' && <>
              {Field({ k: 'street', label: 'Straat en huisnummer', ac: 'street-address' })}
              <div className="two">{Field({ k: 'zip', label: 'Postcode', ac: 'postal-code', ph: '1851 AB' })}{Field({ k: 'city', label: 'Plaats', ac: 'address-level2' })}</div>
            </>}
            <div className="field" style={{ marginBottom: 0 }}><label className="label" htmlFor="note">Opmerking (optioneel)</label><textarea id="note" className="input" rows={2} value={f.note} onChange={e => set('note', e.target.value)} placeholder="Bijv. allergie, aanbellen achterom" /></div>
          </div>

          <div className="panel">
            <h2><span className="num">4</span>Betaalmethode</h2>
            <label className={`choice ${f.pay === 'ideal' ? 'on' : ''}`}><input type="radio" name="pay" checked={f.pay === 'ideal'} onChange={() => set('pay', 'ideal')} /><span><b>iDEAL</b><span>Direct en veilig online betalen met je eigen bank.</span></span></label>
            <label className={`choice ${f.pay === 'ontvangst' ? 'on' : ''}`}><input type="radio" name="pay" checked={f.pay === 'ontvangst'} onChange={() => set('pay', 'ontvangst')} /><span><b>Betalen bij ontvangst</b><span>Je rekent af bij bezorging of afhalen.</span></span></label>
          </div>

          <button className="btn btn-red btn-block" style={{ minHeight: 52, fontSize: 16 }} disabled={tooLow}>
            {f.pay === 'ideal' ? `Doorgaan naar betalen · ${eur(total)}` : `Bestelling plaatsen · ${eur(total)}`}
          </button>
          <p className="secure">🔒 Je gegevens worden alleen gebruikt voor je bestelling.</p>
        </div>

        <aside className="panel sum">
          <h2 style={{ marginBottom: 6 }}>Je bestelling</h2>
          <div className="items">
            {lines.map(l => (
              <div className="it" key={l.k}>
                <ProductImg p={l.p} w={120} />
                <div className="n"><b>{l.p.n}</b>{l.o && <div className="muted" style={{ fontSize: 13 }}>{l.o}</div>}<div style={{ marginTop: 4 }}><Qty small value={l.q} onChange={q => setQty(l.k, q)} /></div></div>
                <b>{eur(l.t)}</b>
              </div>
            ))}
          </div>
          <div className="row"><span>Subtotaal</span><span>{eur(subtotal)}</span></div>
          <div className="row"><span>{f.mode === 'bezorgen' ? `Bezorgen (${zone.name.toLowerCase()})` : 'Afhalen'}</span><span>{f.mode === 'bezorgen' ? eur(delivery) : 'Gratis'}</span></div>
          <div className="row tot"><span>Totaal</span><span>{eur(total)}</span></div>
        </aside>
      </form>
    </div>
  );
}
