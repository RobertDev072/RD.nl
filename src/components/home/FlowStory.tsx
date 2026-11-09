'use client';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { CalendarCheck, Check, Globe, MessageCircle, Search, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PhoneScenes, PhoneShell } from './PhoneScenes';

const ease = [0.2, 0.7, 0.2, 1] as const;

const STEPS = [
  { icon: Search, label: 'Gevonden in Google', text: 'Een klant zoekt "kapper alkmaar" en vindt jou bovenaan.' },
  { icon: Globe, label: 'Snelle website', text: 'Je site laadt direct op mobiel, met één duidelijke knop.' },
  { icon: MessageCircle, label: 'Bericht via WhatsApp', text: 'De klant appt, zoals hij gewend is. Geen formulier.' },
  { icon: Sparkles, label: 'AI checkt je agenda', text: 'De AI-agent kijkt of er plek is, met pauzes en buffers.' },
  { icon: CalendarCheck, label: 'Afspraak staat', text: 'Bevestiging, herinnering en reviewverzoek gaan vanzelf.' }
];

function useIsDesktop() {
  const [d, setD] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(min-width: 1024px) and (min-height: 700px)');
    const on = () => setD(m.matches);
    on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return d;
}

export default function FlowStory() {
  const desktop = useIsDesktop();
  return desktop ? <PinnedFlow /> : <AutoFlow />;
}

function PinnedFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const rail = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (p) => setStep(Math.min(4, Math.max(0, Math.floor(p * 5.0001)))));

  const go = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (el.offsetHeight - window.innerHeight) * ((i + 0.5) / 5), behavior: 'smooth' });
  };

  return (
    <div ref={ref} className="relative" style={{ height: '520vh' }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-grid opacity-70" />
        <div aria-hidden className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue/20 blur-[120px]" />
        <div className="wrap relative grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-[clamp(24px,4vw,72px)] pt-16">
          {/* left: heading + step rail */}
          <div>
            <p className="eyebrow">Zo werkt het</p>
            <h2 className="h2 mt-4 text-[clamp(38px,4.2vw,72px)]">Van zoek&shy;opdracht tot <span className="script text-[1.15em]">afspraak</span>.</h2>
            <ol className="relative mt-10 grid gap-1 pl-7">
              <span aria-hidden className="absolute bottom-3 left-[7px] top-3 w-[2px] rounded bg-line" />
              <motion.span aria-hidden className="absolute left-[7px] top-3 w-[2px] origin-top rounded bg-blue" style={{ bottom: 12, scaleY: rail }} />
              {STEPS.map((s, i) => (
                <li key={s.label}>
                  <button type="button" onClick={() => go(i)} className="group relative block w-full rounded-xl py-2 text-left">
                    <span className={'absolute -left-7 top-[13px] h-4 w-4 rounded-full border-2 transition-all duration-500 ' + (i <= step ? 'border-blue bg-blue shadow-[0_0_0_5px_rgba(31,92,255,.15)]' : 'border-line bg-white')} />
                    <span className={'block text-[17px] font-semibold transition-colors duration-500 ' + (i === step ? 'text-ink' : i < step ? 'text-ink/60' : 'text-ink/35')}>{s.label}</span>
                    <motion.span initial={false} animate={{ height: i === step ? 'auto' : 0, opacity: i === step ? 1 : 0 }} transition={{ duration: 0.45, ease }} className="block overflow-hidden text-[14.5px] leading-snug text-muted">
                      <span className="block pt-1">{s.text}</span>
                    </motion.span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {/* center: phone */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease }} style={{ height: 'min(660px, 74svh)', aspectRatio: '320 / 660' }}>
            <PhoneShell className="h-full w-full">
              <PhoneScenes step={step} />
            </PhoneShell>
          </motion.div>

          {/* right: connector + card stack */}
          <div className="relative flex items-center">
            <Connector step={step} />
            <CardStack step={step} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AutoFlow() {
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setStep((s) => (s + 1) % 5), step === 2 ? 4200 : 3400);
    return () => clearTimeout(t);
  }, [step, visible]);
  return (
    <div ref={ref} className="wrap relative py-24">
      <p className="eyebrow">Zo werkt het</p>
      <h2 className="h2 mt-4">Van zoekopdracht tot <span className="script text-[1.15em]">afspraak</span>.</h2>
      <div className="mt-8 flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <button key={s.label} type="button" onClick={() => setStep(i)} className={'chip transition-colors ' + (i === step ? 'border-ink bg-ink text-white' : i < step ? 'text-blue' : 'text-muted')}>
            {i + 1}. {s.label}
          </button>
        ))}
      </div>
      <div className="mt-10 flex flex-col items-center gap-8">
        <div style={{ width: 'min(300px, 78vw)', aspectRatio: '320 / 660' }}>
          <PhoneShell className="h-full w-full"><PhoneScenes step={step} /></PhoneShell>
        </div>
        <div className="w-full max-w-md pt-16"><CardStack step={step} /></div>
      </div>
    </div>
  );
}

function Connector({ step }: { step: number }) {
  return (
    <svg aria-hidden width="90" height="160" viewBox="0 0 90 160" className="mr-2 hidden shrink-0 xl:block" fill="none">
      <path d="M2 80 C 40 80, 50 20, 88 20" stroke="#E3E7EE" strokeWidth="2" />
      <motion.path key={step} d="M2 80 C 40 80, 50 20, 88 20" stroke="#1F5CFF" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease }} />
      <circle r="4.5" fill="#1F5CFF" key={'d' + step}>
        <animateMotion dur="0.8s" fill="freeze" path="M2 80 C 40 80, 50 20, 88 20" />
      </circle>
    </svg>
  );
}

function CardStack({ step }: { step: number }) {
  return (
    <div className="relative h-[360px] w-full max-w-[400px]">
      <AnimatePresence>
        {[0, 1, 2, 3, 4].filter((i) => i <= step && step - i < 3).map((i) => {
          const d = step - i;
          return (
            <motion.div
              key={i}
              className="absolute inset-x-0 top-10"
              initial={{ opacity: 0, y: 60, scale: 0.94, rotateX: -18 }}
              animate={{ opacity: d === 0 ? 1 : 0.55 - d * 0.15, y: -d * 34, scale: 1 - d * 0.06, rotateX: 0, filter: d === 0 ? 'blur(0px)' : 'blur(1.5px)' }}
              exit={{ opacity: 0, y: -100, scale: 0.85 }}
              transition={{ duration: 0.7, ease }}
              style={{ zIndex: 10 - d, transformPerspective: 900 }}
            >
              <StepCard i={i} active={d === 0} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function StepCard({ i, active }: { i: number; active: boolean }) {
  const S = STEPS[i];
  return (
    <div className="card overflow-hidden p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-white"><S.icon size={18} strokeWidth={1.8} /></span>
        <span className="leading-tight">
          <span className="eyebrow block text-[10.5px]">Stap {i + 1}</span>
          <b className="text-[16px]">{S.label}</b>
        </span>
        <span className={'ml-auto rounded-full px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wide ' + (i === 3 && active ? 'bg-blue-50 text-blue' : 'bg-[#e8f8ee] text-[#15803d]')}>{i === 3 && active ? 'Bezig' : 'Klaar'}</span>
      </div>
      <div className="mt-4">{active && <CardBody i={i} />}{!active && <div className="h-10" />}</div>
    </div>
  );
}

function CardBody({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className="rounded-2xl bg-canvas p-3.5">
        <span className="text-[11px] text-soft">kapper.nl</span>
        <p className="text-[14px] font-semibold text-blue">Studio Noord · Kapper Alkmaar</p>
        <div className="mt-2 flex items-center gap-2 text-[12px] text-muted"><span className="rounded bg-blue px-1.5 py-0.5 font-mono text-[10px] text-white">#1</span> Lokale SEO en Google Bedrijfsprofiel</div>
      </div>
    );
  if (i === 1)
    return (
      <div className="grid gap-2.5">
        {[['Laadtijd op mobiel', 92], ['Duidelijke boekknop', 100], ['Vindbaarheid', 88]].map(([l, v], k) => (
          <div key={l as string}>
            <div className="mb-1 flex justify-between text-[12.5px]"><span className="text-muted">{l}</span></div>
            <div className="h-1.5 overflow-hidden rounded-full bg-canvas"><motion.div className="h-full rounded-full bg-blue" initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 1, delay: 0.15 * k, ease }} /></div>
          </div>
        ))}
      </div>
    );
  if (i === 2)
    return (
      <div className="flex items-start gap-3 rounded-2xl bg-[#effaf2] p-3.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#16a34a] text-white"><MessageCircle size={15} /></span>
        <span className="text-[13.5px] leading-snug"><b className="block">Sanne · nieuw bericht</b>Hoi! Kan ik donderdag rond 11:00 knippen?</span>
      </div>
    );
  if (i === 3) return <ScanCalendar />;
  return (
    <div>
      <div className="rounded-2xl bg-blue p-4 text-white">
        <span className="text-[12px] text-white/70">Donderdag 12 november</span>
        <p className="text-[20px] font-semibold tracking-tight">11:00 · Knippen · Sanne</p>
      </div>
      <ul className="mt-3 grid gap-2 text-[13.5px]">
        {['Bevestiging via WhatsApp', 'In Google Agenda gezet', 'Herinnering op woensdag', 'Reviewverzoek na afloop'].map((t, k) => (
          <motion.li key={t} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + k * 0.12, ease }} className="flex items-center gap-2">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#16a34a] text-white"><Check size={12} strokeWidth={3} /></span>{t}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function ScanCalendar() {
  const [row, setRow] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setRow((r) => Math.min(3, r + 1)), 520);
    return () => clearInterval(iv);
  }, []);
  const busy: Record<string, string> = { '0-0': 'Iris', '1-1': 'Mark', '3-1': 'Lotte', '2-2': 'Ans', '4-2': 'Youssef' };
  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <div className="grid grid-cols-[44px_repeat(5,minmax(0,1fr))] bg-canvas font-mono text-[10px] text-soft">
        <span />{['MA', 'DI', 'WO', 'DO', 'VR'].map((d) => <span key={d} className={'px-1.5 py-2 ' + (d === 'DO' ? 'text-blue' : '')}>{d}</span>)}
      </div>
      {['09:00', '10:00', '11:00'].map((h, r) => (
        <div key={h} className="grid h-9 grid-cols-[44px_repeat(5,minmax(0,1fr))] border-t border-line">
          <span className="pl-2 font-mono text-[10px] leading-9 text-soft">{h}</span>
          {[0, 1, 2, 3, 4].map((d) => {
            const b = busy[`${d}-${r}`];
            const scan = d === 3 && row === r && row < 3;
            const free = d === 3 && r === 2 && row >= 3;
            return (
              <span key={d} className={'m-1 flex items-center overflow-hidden whitespace-nowrap rounded-md px-1.5 text-[9.5px] font-semibold transition-all duration-300 ' + (b ? 'bg-blue-50 text-[#1a3d8f]' : scan ? 'ring-2 ring-blue bg-blue/10' : free ? 'bg-[#16a34a] text-white' : '')}>
                {b || (free ? 'Vrij ✓' : '')}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
