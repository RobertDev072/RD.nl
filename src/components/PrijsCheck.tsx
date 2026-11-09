'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Globe, Loader2, Maximize2, MessageCircle, Minimize2, Monitor, RotateCcw, Smartphone, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { waLink } from '@/lib/site';

type Result = {
  bedrijf?: { naam?: string; branche?: string; plaats?: string };
  samenvatting: string;
  goed: string[];
  verbeterpunten: string[];
  pakket: string;
  pakketNaam: string;
  prijs: number;
  prijsUitleg: string;
  uitbreidingen: string[];
  brief: Record<string, unknown>;
  checks: { ok: boolean; label: string }[];
  site: { url: string; title: string; generator: string } | null;
};

const ease = [0.2, 0.7, 0.2, 1] as const;
const steps = ['Website uitlezen', 'Analyseren met AI', 'Prijs berekenen', 'Nieuwe site ontwerpen'];
const voorbeelden = ['Moderner en meer aanvragen via WhatsApp', 'Online afspraken laten maken', 'Een webshop voor mijn producten', 'Beter gevonden worden in Alkmaar'];

/** Extra zekerheid naast de sandbox: scripts en event-handlers eruit. */
const clean = (html: string) =>
  html.replace(/^```(?:html)?\s*/i, '').replace(/```\s*$/, '').replace(/<script[\s\S]*?(<\/script>|$)/gi, '').replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

export default function PrijsCheck({ intro }: { intro: ReactNode }) {
  const [url, setUrl] = useState('');
  const [wens, setWens] = useState('');
  const [geenSite, setGeenSite] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'analyse' | 'design' | 'done' | 'error'>('idle');
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [html, setHtml] = useState('');
  const [chars, setChars] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => () => abort.current?.abort(), []);

  useEffect(() => {
    if (phase !== 'analyse') return;
    setStep(0);
    const t = setInterval(() => setStep((s) => Math.min(s + 1, 2)), 2600);
    return () => clearInterval(t);
  }, [phase]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const honey = (new FormData(e.currentTarget).get('website') as string) || '';
    setError(''); setResult(null); setHtml(''); setChars(0); setPhase('analyse');
    abort.current?.abort();
    const ctrl = new AbortController();
    abort.current = ctrl;
    try {
      const r = await fetch('/api/prijscheck/analyse', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ url, wens, geenSite, website: honey }), signal: ctrl.signal });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Er ging iets mis.');
      setResult(data);
      setStep(3);
      setPhase('design');
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);

      const p = await fetch('/api/prijscheck/preview', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ brief: data.brief, wens }), signal: ctrl.signal });
      if (!p.ok || !p.body) {
        const d = await p.json().catch(() => ({}));
        throw new Error(d.error || 'De preview is niet gelukt. Je prijsindicatie staat hierboven.');
      }
      const reader = p.body.getReader();
      const dec = new TextDecoder();
      let acc = '';
      let last = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setChars(acc.length);
        if (Date.now() - last > 450) { setHtml(clean(acc)); last = Date.now(); }
      }
      setHtml(clean(acc));
      setPhase('done');
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setError((err as Error).message);
      setPhase((prev) => (prev === 'design' ? 'done' : 'error'));
    }
  }

  const busy = phase === 'analyse' || phase === 'design';
  const wa = result
    ? waLink(`Hoi Robert, ik heb de prijscheck gedaan${result.site ? ` voor ${result.site.url}` : ''}. Pakket: ${result.pakketNaam}, indicatie €${result.prijs}.${wens ? ` Mijn wens: ${wens}` : ''}`)
    : '';

  return (
    <div>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:items-start">
      <div className="lg:sticky lg:top-28">{intro}</div>
      <div className="grid gap-6">
      <motion.form onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="card relative grid gap-5 p-[clamp(20px,3vw,36px)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label htmlFor="pc-url" className="text-[15px] font-semibold">Link van je huidige website</label>
          <button type="button" onClick={() => setGeenSite((v) => !v)} aria-pressed={geenSite} className={'chip transition-colors ' + (geenSite ? 'border-ink bg-ink text-white' : 'hover:border-ink/40')}>
            {geenSite ? <Check size={14} /> : null} Ik heb nog geen website
          </button>
        </div>
        <AnimatePresence initial={false}>
          {!geenSite && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="flex h-[58px] items-center gap-3 rounded-2xl border border-line bg-canvas px-4 transition focus-within:border-ink focus-within:bg-white">
                <Globe size={18} className="shrink-0 text-soft" />
                <input id="pc-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="jouwbedrijf.nl" inputMode="url" autoComplete="url" className="h-full w-full bg-transparent text-[16px] outline-none placeholder:text-soft" required={!geenSite} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="grid gap-2">
          <label htmlFor="pc-wens" className="text-[15px] font-semibold">{geenSite ? 'Vertel kort over je bedrijf en wat je wilt' : 'Wat wil je anders of beter? (optioneel)'}</label>
          <textarea id="pc-wens" value={wens} onChange={(e) => setWens(e.target.value)} rows={3} maxLength={800} placeholder={geenSite ? 'Bijvoorbeeld: ik heb een kapsalon in Heiloo en wil dat klanten online een afspraak kunnen maken.' : 'Bijvoorbeeld: moderner, beter op mobiel en meer aanvragen via WhatsApp.'} className="rounded-2xl border border-line bg-canvas px-4 py-3.5 text-[16px] outline-none transition placeholder:text-soft focus:border-ink focus:bg-white" required={geenSite} />
          <div className="flex flex-wrap gap-2 pt-1">
            {voorbeelden.map((v) => <button key={v} type="button" onClick={() => setWens(v)} className="rounded-full bg-canvas px-3 py-1.5 text-[13px] text-muted transition hover:bg-ink hover:text-white">{v}</button>)}
          </div>
        </div>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button type="submit" disabled={busy} className="btn-accent disabled:opacity-60">
            {busy ? <><Loader2 size={18} className="animate-spin" /> Bezig…</> : <><Sparkles size={18} /> Start gratis prijscheck</>}
          </button>
          <p className="text-[13px] text-soft">Gratis en vrijblijvend. Duurt ongeveer een minuut.</p>
        </div>
        {error && phase === 'error' && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-canvas px-4 py-3 text-[14.5px]">
            <span>{error}</span>
            <a href={waLink(`Hoi Robert, ik wil weten wat een nieuwe website kost${url ? ` voor ${url}` : ''}.${wens ? ` Mijn wens: ${wens}` : ''}`)} className="inline-flex items-center gap-1.5 font-semibold underline underline-offset-4"><MessageCircle size={15} /> Vraag het Robert via WhatsApp</a>
          </div>
        )}
      </motion.form>

      <AnimatePresence>
        {phase === 'analyse' && (
          <motion.ol initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid gap-3 sm:grid-cols-2" aria-live="polite">
            {steps.map((s, i) => (
              <li key={s} className={'flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-[14px] transition-all duration-500 ' + (i < step ? 'border-line bg-white text-ink' : i === step ? 'border-ink bg-white font-semibold text-ink shadow-card' : 'border-line text-soft')}>
                <span className={'grid h-6 w-6 shrink-0 place-items-center rounded-full ' + (i < step ? 'bg-ink text-white' : i === step ? 'border border-ink' : 'border border-line')}>
                  {i < step ? <Check size={13} strokeWidth={3} /> : i === step ? <Loader2 size={13} className="animate-spin" /> : null}
                </span>{s}
              </li>
            ))}
          </motion.ol>
        )}
      </AnimatePresence>
      </div>
      </div>

      {result && (
        <div ref={resultRef} className="mt-[clamp(48px,6vw,88px)] grid scroll-mt-28 gap-4">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="card p-[clamp(22px,3vw,40px)]">
              <p className="eyebrow">Analyse{result.site?.generator ? ` · gebouwd met ${result.site.generator}` : ''}</p>
              <h2 className="h3 mt-3 text-[clamp(28px,2.6vw,40px)]">{result.bedrijf?.naam || 'Jouw bedrijf'}</h2>
              {(result.bedrijf?.branche || result.bedrijf?.plaats) && <p className="mt-1 text-[14px] text-muted">{[result.bedrijf?.branche, result.bedrijf?.plaats].filter(Boolean).join(' · ')}</p>}
              <p className="mt-5 text-[16.5px] leading-relaxed text-muted">{result.samenvatting}</p>
              {result.checks.length > 0 && (
                <ul className="mt-7 grid gap-2 sm:grid-cols-2">
                  {result.checks.map((c) => (
                    <li key={c.label} className="flex items-center gap-2.5 text-[14px]">
                      <span className={'grid h-5 w-5 shrink-0 place-items-center rounded-full ' + (c.ok ? 'bg-ink text-white' : 'border border-ink/30 text-ink/60')}>{c.ok ? <Check size={11} strokeWidth={3} /> : <X size={11} strokeWidth={3} />}</span>{c.label}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {result.goed.length > 0 && (
                  <div>
                    <p className="eyebrow mb-3">Wat goed is</p>
                    <ul className="grid gap-2 text-[14.5px] leading-snug">{result.goed.map((g) => <li key={g} className="flex gap-2"><Check size={15} className="mt-0.5 shrink-0" />{g}</li>)}</ul>
                  </div>
                )}
                <div>
                  <p className="eyebrow mb-3">Wat beter kan</p>
                  <ul className="grid gap-2 text-[14.5px] leading-snug">{result.verbeterpunten.map((g) => <li key={g} className="flex gap-2"><ArrowRight size={15} className="mt-0.5 shrink-0" />{g}</li>)}</ul>
                </div>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease }} className="relative overflow-hidden rounded-[28px] bg-night p-[clamp(22px,3vw,40px)] text-white shadow-glow">
              <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/[.1] blur-3xl" />
              <p className="eyebrow relative text-white/50">Prijsindicatie</p>
              <p className="relative mt-3 text-[15px] font-semibold text-white/80">{result.pakketNaam}</p>
              <p className="relative mt-1 text-[clamp(64px,6vw,104px)] font-semibold leading-none tracking-[-0.05em]" style={{ fontStretch: '112%' }}>€{result.prijs}</p>
              <p className="relative mt-4 text-[15px] leading-relaxed text-white/70">{result.prijsUitleg}</p>
              {result.uitbreidingen.length > 0 && (
                <ul className="relative mt-6 grid gap-2 border-t border-white/10 pt-5 text-[14px] text-white/70">
                  {result.uitbreidingen.map((u) => <li key={u} className="flex gap-2"><Sparkles size={14} className="mt-0.5 shrink-0" />{u}</li>)}
                </ul>
              )}
              <p className="relative mt-6 text-[12.5px] text-white/45">Indicatie op basis van een automatische scan. Geen contract, geen vaste kosten. De definitieve prijs hoor je na een kort gesprek.</p>
              <div className="relative mt-6 grid gap-2.5">
                <a href={wa} className="btn-light w-full"><MessageCircle size={18} /> Stuur dit naar Robert</a>
                <a href="/contact" className="btn w-full border border-white/15 bg-white/5 text-white hover:bg-white/10">Plan een gesprek</a>
              </div>
            </motion.section>
          </div>

          <Preview html={html} phase={phase} chars={chars} error={phase === 'done' && error ? error : ''} onRetry={() => { setPhase('idle'); setResult(null); setHtml(''); }} />
        </div>
      )}
    </div>
  );
}

function Preview({ html, phase, chars, error, onRetry }: { html: string; phase: string; chars: number; error: string; onRetry: () => void }) {
  const [device, setDevice] = useState<'desktop' | 'mobiel'>('desktop');
  const [full, setFull] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const W = device === 'desktop' ? 1280 : 390;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [W, full]);

  useEffect(() => { document.documentElement.style.overflow = full ? 'hidden' : ''; return () => { document.documentElement.style.overflow = ''; }; }, [full]);

  const H = device === 'desktop' ? 800 : 780;
  const designing = phase === 'design';

  return (
    <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease }} className={full ? 'fixed inset-0 z-[90] flex flex-col bg-canvas p-3 sm:p-6' : 'card overflow-hidden'}>
      <div className={'flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 ' + (full ? 'rounded-t-2xl bg-white' : '')}>
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-line" /><i className="h-2.5 w-2.5 rounded-full bg-line" /><i className="h-2.5 w-2.5 rounded-full bg-line" /></span>
          <span className="ml-2 text-[13.5px] font-semibold">Preview van je nieuwe site</span>
          {designing && <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-canvas px-2.5 py-1 font-mono text-[11px] text-muted"><Loader2 size={11} className="animate-spin" /> Lorvex ontwerpt · {Math.round(chars / 1000)}k</span>}
        </div>
        <div className="flex items-center gap-1.5">
          {(['desktop', 'mobiel'] as const).map((d) => (
            <button key={d} type="button" onClick={() => setDevice(d)} aria-pressed={device === d} className={'grid h-9 w-9 place-items-center rounded-full transition ' + (device === d ? 'bg-ink text-white' : 'hover:bg-canvas')} aria-label={d}>
              {d === 'desktop' ? <Monitor size={16} /> : <Smartphone size={16} />}
            </button>
          ))}
          <button type="button" onClick={() => setFull((v) => !v)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-canvas" aria-label={full ? 'Verkleinen' : 'Volledig scherm'}>{full ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button>
        </div>
      </div>
      <div ref={box} className={'relative overflow-hidden bg-canvas ' + (full ? 'flex-1 rounded-b-2xl' : '')} style={full ? undefined : { height: Math.round(H * scale) + (device === 'mobiel' ? 32 : 0) }}>
        {html ? (
          <div className={device === 'mobiel' ? 'flex h-full justify-center py-4' : 'h-full'}>
            <iframe
              title="Preview van je nieuwe website"
              sandbox=""
              srcDoc={html}
              className={'origin-top-left border-0 bg-white ' + (device === 'mobiel' ? 'rounded-[28px] shadow-card' : '')}
              style={full ? { width: device === 'mobiel' ? 390 : '100%', height: '100%' } : { width: W, height: H, transform: `scale(${scale})`, transformOrigin: device === 'mobiel' ? 'top center' : 'top left' }}
            />
          </div>
        ) : (
          <div className="grid h-full min-h-[320px] place-items-center p-8 text-center">
            {error ? (
              <div><p className="text-[15px]">{error}</p><button type="button" onClick={onRetry} className="btn-ghost mt-4"><RotateCcw size={15} /> Opnieuw proberen</button></div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-muted"><Loader2 size={22} className="animate-spin" /><p className="text-[14.5px]">Je nieuwe site wordt ontworpen. Dit duurt meestal 30 tot 60 seconden.</p></div>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
}
