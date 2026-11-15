'use client';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { CONCEPT_CONSENT_TEXT } from '@/lib/consent';

const inputCls = 'h-[52px] rounded-2xl border border-line bg-canvas px-4 text-[16px] outline-none focus:border-accent focus:bg-white';

export default function ConceptResponse({ slug, name }: { slug: string; name: string }) {
  const [state, setState] = useState<'idle' | 'busy' | 'yes' | 'no'>('idle');
  const [error, setError] = useState('');

  const send = async (body: Record<string, unknown>) => {
    const r = await fetch('/api/concept', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ slug, ...body }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || 'Er ging iets mis.');
  };

  const yes = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get('consent') !== 'on') { setError('Vink aan dat Robert contact met u mag opnemen.'); return; }
    setError(''); setState('busy');
    try {
      await send({ action: 'contact', name: f.get('name'), email: f.get('email'), phone: f.get('phone'), company_website: f.get('company_website') });
      setState('yes');
    } catch (err) { setError(err instanceof Error ? err.message : 'Er ging iets mis.'); setState('idle'); }
  };

  const no = async () => {
    setState('busy');
    try { await send({ action: 'opt_out' }); setState('no'); } catch { setState('idle'); setError('Er ging iets mis. Mail gerust naar rb085@icloud.com.'); }
  };

  if (state === 'yes') return <div className="card p-8 text-[17px]"><b>Bedankt!</b> Robert van Lorvex neemt snel contact met u op over het ontwerp voor {name}.</div>;
  if (state === 'no') return <div className="card p-8 text-[17px]">Duidelijk. We nemen geen contact meer met u op over dit voorbeeld.</div>;

  return (
    <div className="card grid gap-5 p-[clamp(24px,3.5vw,44px)]">
      <div>
        <p className="text-[26px] font-semibold">Spreekt dit ontwerp u aan?</p>
        <p className="mt-2 text-[15px] text-muted">Eerst zien, dan beslissen. Geen contracten, werk vanaf €100. Laat uw gegevens achter en Robert neemt contact op.</p>
      </div>
      <form onSubmit={yes} className="grid gap-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-3">
          <input name="name" required placeholder="Uw naam" autoComplete="name" className={inputCls} />
          <input name="email" type="email" required placeholder="E-mailadres" autoComplete="email" className={inputCls} />
          <input name="phone" type="tel" placeholder="Telefoon (optioneel)" autoComplete="tel" className={inputCls} />
        </div>
        <input name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-px w-px opacity-0" />
        <label className="flex items-start gap-3 text-[14px]">
          <input type="checkbox" name="consent" className="mt-1 h-4 w-4" />
          <span>{CONCEPT_CONSENT_TEXT} <a href="/privacy" className="underline">Privacyverklaring</a>.</span>
        </label>
        {error && <p role="alert" className="text-[14px] text-[#c2410c]">{error}</p>}
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={state === 'busy'} className="btn-accent disabled:opacity-60">
            {state === 'busy' ? <>Versturen <Loader2 size={17} className="animate-spin" /></> : <>Ja, neem contact met mij op <ArrowRight size={17} /></>}
          </button>
          <button type="button" onClick={no} disabled={state === 'busy'} className="text-[14px] text-muted underline hover:text-ink">
            Nee, bedankt. Neem geen contact meer op.
          </button>
        </div>
      </form>
    </div>
  );
}
