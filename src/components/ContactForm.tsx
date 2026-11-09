'use client';
import { ArrowRight } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { services } from '@/lib/content';
import { waLink } from '@/lib/site';

export default function ContactForm() {
  const [error, setError] = useState('');
  const [picked, setPicked] = useState<string[]>([]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name') || '').trim();
    const msg = String(f.get('message') || '').trim();
    if (!name || !msg) { setError('Vul je naam en je vraag in, dan kan ik je goed helpen.'); return; }
    setError('');
    const lines = [
      `Hoi Robert, ik ben ${name}${f.get('company') ? ` van ${f.get('company')}` : ''}.`,
      picked.length ? `Ik heb interesse in: ${picked.join(', ')}.` : '',
      f.get('site') ? `Huidige website: ${f.get('site')}` : '',
      msg
    ].filter(Boolean);
    window.open(waLink(lines.join('\n')), '_blank', 'noopener');
  };

  const toggle = (t: string) => setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  return (
    <form onSubmit={submit} className="card grid gap-5 p-[clamp(24px,3.5vw,44px)]" noValidate>
      <div>
        <p className="h3 text-[28px]">Vertel wat je wilt bouwen</p>
        <p className="mt-2 text-[15px] text-muted">Je bericht opent in WhatsApp, zodat je het direct naar mij stuurt.</p>
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
      </div>
      <Field id="site" label="Huidige website (optioneel)" placeholder="www.jouwzaak.nl" />
      <label htmlFor="message" className="grid gap-2 text-[14px] font-medium">
        Je vraag
        <textarea id="message" name="message" rows={5} placeholder="Bijvoorbeeld: ik wil een nieuwe website met online afspraken." className="rounded-2xl border border-line bg-canvas px-4 py-3.5 text-[16px] font-normal outline-none transition focus:border-accent focus:bg-white" />
      </label>
      {error && <p role="alert" className="text-[14px] text-[#c2410c]">{error}</p>}
      <button type="submit" className="btn-accent w-full sm:w-auto sm:justify-self-start">Verstuur via WhatsApp <ArrowRight size={17} /></button>
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
