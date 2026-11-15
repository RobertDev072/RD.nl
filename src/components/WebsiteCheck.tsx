'use client';
import { ArrowRight, Check, Loader2, MessageCircle, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { waLink } from '@/lib/site';
import { CONSENT_TEXT } from '@/lib/consent';

type Finding = { id: string; ok: boolean; title: string; detail: string };
type Result = { domain: string; finalUrl: string; score: number; loadMs: number; platform: string; findings: Finding[] };

const inputCls = 'h-[52px] rounded-2xl border border-line bg-canvas px-4 text-[16px] font-normal outline-none transition focus:border-accent focus:bg-white';

export default function WebsiteCheck({ leadFormEnabled }: { leadFormEnabled: boolean }) {
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  const run = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); setResult(null); setBusy(true);
    try {
      const r = await fetch('/api/website-check', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ url }) });
      const j = await r.json();
      if (!r.ok) setError(j.error || 'Er ging iets mis.'); else setResult(j);
    } catch { setError('Er ging iets mis. Probeer het opnieuw.'); }
    setBusy(false);
  };

  const missing = result?.findings.filter((f) => !f.ok) ?? [];
  const tone = !result ? '' : result.score >= 80 ? 'text-[#16a34a]' : result.score >= 55 ? 'text-[#d97706]' : 'text-[#c2410c]';

  return (
    <div className="grid gap-6">
      <form onSubmit={run} className="card grid gap-4 p-[clamp(24px,3.5vw,44px)]" noValidate>
        <label htmlFor="wc-url" className="grid gap-2 text-[14px] font-medium">
          Webadres van je bedrijf
          <input id="wc-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="www.jouwzaak.nl" inputMode="url" autoComplete="url" className={inputCls} />
        </label>
        {error && <p role="alert" className="text-[14px] text-[#c2410c]">{error}</p>}
        <button type="submit" disabled={busy || !url.trim()} className="btn-accent w-full disabled:opacity-60 sm:w-auto sm:justify-self-start">
          {busy ? <>Bezig met controleren <Loader2 size={17} className="animate-spin" /></> : <>Check mijn website <ArrowRight size={17} /></>}
        </button>
        <p className="text-[13px] text-muted">Gratis en zonder registratie. We bekijken alleen de openbare voorpagina.</p>
      </form>

      {result && (
        <div className="card grid gap-6 p-[clamp(24px,3.5vw,44px)]" aria-live="polite">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[14px] text-muted">Resultaat voor {result.domain}</p>
              <p className={`h3 text-[56px] leading-none tabular-nums ${tone}`}>{result.score}<span className="text-[24px] text-muted">/100</span></p>
            </div>
            <p className="text-[14px] text-muted">Laadtijd {(result.loadMs / 1000).toFixed(1)} s{result.platform ? ` · gemaakt met ${result.platform}` : ''}</p>
          </div>
          <ul className="grid gap-3">
            {result.findings.map((f) => (
              <li key={f.id} className="flex gap-3 rounded-2xl border border-line p-4">
                <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-white ${f.ok ? 'bg-[#16a34a]' : 'bg-[#c2410c]'}`}>{f.ok ? <Check size={14} /> : <X size={14} />}</span>
                <span><b className="block text-[16px]">{f.title}</b><span className="text-[15px] text-muted">{f.detail}</span></span>
              </li>
            ))}
          </ul>
          {leadFormEnabled
            ? <LeadForm url={result.finalUrl} improvements={missing.length} />
            : <a className="btn-accent justify-self-start" href={waLink(`Hoi Robert, ik deed de website-check voor ${result.domain} (score ${result.score}/100). Kun je me helpen met de verbeterpunten?`)}>Bespreek de verbeterpunten via WhatsApp <MessageCircle size={17} /></a>}
        </div>
      )}
    </div>
  );
}

function LeadForm({ url, improvements }: { url: string; improvements: number }) {
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle');
  const [error, setError] = useState('');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setError(''); setState('busy');
    try {
      const r = await fetch('/api/website-check/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          url,
          name: f.get('name'), email: f.get('email'), phone: f.get('phone'), business: f.get('business'),
          company_website: f.get('company_website'), consent: f.get('consent') === 'on'
        })
      });
      const j = await r.json();
      if (!r.ok) { setError(j.error || 'Er ging iets mis.'); setState('idle'); } else setState('done');
    } catch { setError('Er ging iets mis. Probeer het opnieuw.'); setState('idle'); }
  };

  if (state === 'done') {
    return <p className="rounded-2xl bg-canvas p-5 text-[16px]"><b>Bedankt!</b> Robert bekijkt je website persoonlijk en stuurt je binnen twee werkdagen een gratis voorbeeldontwerp met de verbeterpunten.</p>;
  }
  return (
    <form onSubmit={submit} className="grid gap-4 border-t border-line pt-6" noValidate>
      <div>
        <p className="h3 text-[24px]">{improvements ? `Gratis voorbeeldontwerp met ${improvements} verbeterpunten` : 'Gratis voorbeeldontwerp'}</p>
        <p className="mt-1 text-[15px] text-muted">Eerst zien, dan beslissen. Je zit nergens aan vast.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" placeholder="Je naam" autoComplete="name" required className={inputCls} />
        <input name="business" placeholder="Bedrijfsnaam" autoComplete="organization" className={inputCls} />
        <input name="email" type="email" placeholder="E-mailadres" autoComplete="email" required className={inputCls} />
        <input name="phone" type="tel" placeholder="Telefoon (optioneel)" autoComplete="tel" className={inputCls} />
      </div>
      <input name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-px w-px opacity-0" />
      <label className="flex items-start gap-3 text-[14px]">
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-[var(--accent,#2563eb)]" />
        <span>{CONSENT_TEXT} Lees de <a href="/privacy" className="underline">privacyverklaring</a>.</span>
      </label>
      {error && <p role="alert" className="text-[14px] text-[#c2410c]">{error}</p>}
      <button type="submit" disabled={state === 'busy'} className="btn-accent w-full disabled:opacity-60 sm:w-auto sm:justify-self-start">
        {state === 'busy' ? <>Versturen <Loader2 size={17} className="animate-spin" /></> : <>Vraag gratis voorbeeld aan <ArrowRight size={17} /></>}
      </button>
    </form>
  );
}
