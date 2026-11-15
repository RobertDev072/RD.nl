'use client';
import { ArrowRight, Loader2, MessageCircle } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { services } from '@/lib/content';
import { site } from '@/lib/site';
import { CONTACT_NOTICE_TEXT, MARKETING_CONSENT_TEXT } from '@/lib/consent';

export default function ContactForm() {
  const [error, setError] = useState('');
  const [picked, setPicked] = useState<string[]>([]);
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name') || '').trim();
    const email = String(f.get('email') || '').trim();
    const msg = String(f.get('message') || '').trim();
    if (!name || !email || !msg) { setError('Vul je naam, e-mailadres en je vraag in, dan kan ik je goed helpen.'); return; }
    setError(''); setState('busy');
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name, email, message: msg, phone: f.get('phone'), company: f.get('company'), website: f.get('site'),
          services: picked, marketing: f.get('marketing') === 'on', company_website: f.get('company_website')
        })
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { setError(j.error || 'Versturen lukte niet. App of bel me gerust.'); setState('idle'); } else setState('done');
    } catch { setError('Versturen lukte niet. App of bel me gerust.'); setState('idle'); }
  };

  const toggle = (t: string) => setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  return (
    <form onSubmit={submit} className="card grid gap-5 p-[clamp(24px,3.5vw,44px)]" noValidate>
      <div>
        <p className="h3 text-[28px]">Vertel wat je wilt bouwen</p>
        <p className="mt-2 text-[15px] text-muted">Ik reageer meestal binnen één werkdag. Liever direct? <a href={site.whatsapp} className="underline">App me</a>.</p>
      </div>
      <fieldset>
        <legend className="mb-3 text-[14px] font-medium">Waar kan ik mee helpen?</legend>
        <div className="flex flex-wrap gap-2">
          {services.map((s) => (
            <button key={s.slug} type="button" onClick={() => toggle(s.title)} aria-pressed={picked.includes(s.title)} className={'rounded-full border px-4 py-2 text-[14px] transition-all ' + (picked.includes(s.title) ? 'border-accent bg-accent text-white' : 'border-line bg-white hover:border-ink/40')}>
              {s.title}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Naam" placeholder="Je naam" autoComplete="name" />
        <Field id="company" label="Bedrijf (optioneel)" placeholder="Bedrijfsnaam" autoComplete="organization" />
        <Field id="email" label="E-mailadres" placeholder="naam@bedrijf.nl" type="email" autoComplete="email" />
        <Field id="phone" label="Telefoon (optioneel)" placeholder="06 12345678" type="tel" autoComplete="tel" />
      </div>
      <Field id="site" label="Huidige website (optioneel)" placeholder="www.jouwzaak.nl" />
      <label htmlFor="message" className="grid gap-2 text-[14px] font-medium">
        Je vraag
        <textarea id="message" name="message" rows={5} placeholder="Bijvoorbeeld: ik wil een nieuwe website met online afspraken." className="rounded-2xl border border-line bg-canvas px-4 py-3.5 text-[16px] font-normal outline-none transition focus:border-accent focus:bg-white" />
      </label>
      <input name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-px w-px opacity-0" />
      <p className="text-[13px] text-muted">{CONTACT_NOTICE_TEXT} Lees de <a href="/privacy" className="underline">privacyverklaring</a>.</p>
      <label className="flex items-start gap-3 text-[14px]">
        <input type="checkbox" name="marketing" className="mt-1 h-4 w-4" />
        <span>{MARKETING_CONSENT_TEXT} <span className="text-muted">(optioneel)</span></span>
      </label>
      {error && <p role="alert" className="text-[14px] text-[#c2410c]">{error}</p>}
      {state === 'done' ? (
        <p role="status" className="rounded-2xl bg-canvas p-5 text-[16px]"><b>Bedankt, je aanvraag is binnen!</b> Ik neem meestal binnen één werkdag contact met je op.</p>
      ) : (
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={state === 'busy'} className="btn-accent w-full disabled:opacity-60 sm:w-auto">
            {state === 'busy' ? <>Versturen <Loader2 size={17} className="animate-spin" /></> : <>Verstuur aanvraag <ArrowRight size={17} /></>}
          </button>
          <a href={site.whatsapp} className="inline-flex items-center gap-2 text-[14px] text-muted hover:text-ink"><MessageCircle size={16} /> Of app direct</a>
        </div>
      )}
    </form>
  );
}

function Field({ id, label, ...rest }: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label htmlFor={id} className="grid gap-2 text-[14px] font-medium">
      {label}
      <input id={id} name={id} className="h-[52px] rounded-2xl border border-line bg-canvas px-4 text-[16px] font-normal outline-none transition focus:border-accent focus:bg-white" {...rest} />
    </label>
  );
}
