'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarCheck, Check, CheckCheck, Lock, MessageCircle, Search, Send, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const ease = [0.2, 0.7, 0.2, 1] as const;

/** Types `text` out while `active`, restarting each time it becomes active. */
export function useTyping(text: string, active: boolean, speed = 55, startDelay = 250) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) { setN(0); return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(text.length); return; }
    let i = 0;
    let iv: ReturnType<typeof setInterval>;
    const t = setTimeout(() => { iv = setInterval(() => { i++; setN(i); if (i >= text.length) clearInterval(iv); }, speed); }, startDelay);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, [active, text, speed, startDelay]);
  return text.slice(0, n);
}

function Caret({ color = '#0A0A0A' }: { color?: string }) {
  return <motion.span className="ml-px inline-block h-[1em] w-[1.5px] align-[-2px]" style={{ background: color }} animate={{ opacity: [1, 1, 0, 0] }} transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }} />;
}

export function PhoneShell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={'relative rounded-[52px] bg-[#0b0d12] p-[11px] shadow-[0_0_0_1.5px_#3a3f48_inset,0_60px_120px_-40px_rgba(10,10,10,.6),0_40px_120px_-60px_rgba(10,10,10,.45)] ' + className}>
      <div className="absolute left-1/2 top-[20px] z-20 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black" />
      <div className="relative h-full w-full overflow-hidden rounded-[42px] bg-white">
        <div className="absolute inset-x-0 top-0 z-10 flex h-12 items-center justify-between px-7 text-[12px] font-semibold">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="flex items-end gap-[2px]">{[4, 6, 8, 10].map((h) => <i key={h} className="w-[3px] rounded-[1px] bg-ink" style={{ height: h }} />)}</span>
            <span className="ml-1 h-[10px] w-[20px] rounded-[3px] border border-ink p-[1.5px]"><i className="block h-full w-[70%] rounded-[1px] bg-ink" /></span>
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

const sceneMotion = { initial: { opacity: 0, x: 30, filter: 'blur(6px)' }, animate: { opacity: 1, x: 0, filter: 'blur(0px)' }, exit: { opacity: 0, x: -30, filter: 'blur(6px)' }, transition: { duration: 0.5, ease } };

export function PhoneScenes({ step }: { step: number }) {
  return (
    <AnimatePresence mode="wait">
      {step === 0 && <motion.div key="s0" className="absolute inset-0" {...sceneMotion}><SceneSearch /></motion.div>}
      {step === 1 && <motion.div key="s1" className="absolute inset-0" {...sceneMotion}><SceneSite /></motion.div>}
      {step >= 2 && <motion.div key="s2" className="absolute inset-0" {...sceneMotion}><SceneChat step={step} /></motion.div>}
    </AnimatePresence>
  );
}

function SceneSearch() {
  const q = useTyping('kapper alkmaar', true, 70, 300);
  const done = q.length === 14;
  return (
    <div className="flex h-full flex-col bg-white px-4 pt-16">
      <div className="text-center text-[26px] font-semibold tracking-tight text-ink/80" style={{ fontStretch: '110%' }}>Zoeken</div>
      <div className="mt-4 flex h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-[14px] shadow-sm">
        <Search size={15} className="text-soft" />
        <span className="flex-1 truncate">{q || <span className="text-soft">Zoek of typ een adres</span>}{!done && <Caret />}</span>
      </div>
      <AnimatePresence>
        {done && (
          <motion.ul className="mt-5 grid gap-3" initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.12 } } }}>
            {[
              { t: 'Studio Noord · Kapper Alkmaar', u: 'kapper.nl', hl: true },
              { t: 'Kappers in Alkmaar · Kaart', u: 'maps', hl: false },
              { t: 'Beste kapsalons Alkmaar 2026', u: 'gids.nl', hl: false }
            ].map((r) => (
              <motion.li key={r.t} variants={{ h: { opacity: 0, y: 10 }, s: { opacity: 1, y: 0 } }} className={'rounded-2xl p-3 ' + (r.hl ? 'bg-accent-50 ring-1 ring-accent/30' : 'bg-canvas')}>
                <span className="block text-[11px] text-soft">{r.u}</span>
                <span className={'block text-[13.5px] font-semibold ' + (r.hl ? 'text-accent' : '')}>{r.t}</span>
                {r.hl && <span className="mt-1 block text-[11.5px] text-muted">★ 4,9 · Vandaag open tot 18:00 · Afspraak via WhatsApp</span>}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function SceneSite() {
  const [tap, setTap] = useState(false);
  useEffect(() => { const t = setTimeout(() => setTap(true), 1300); return () => clearTimeout(t); }, []);
  return (
    <div className="flex h-full flex-col bg-white pt-12">
      <div className="mx-3 flex h-8 items-center justify-center gap-1.5 rounded-xl bg-canvas text-[11px] text-muted"><Lock size={10} />kapper.nl</div>
      <motion.div initial={{ scale: 1.08, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease }} className="relative mx-3 mt-3 h-[220px] overflow-hidden rounded-[22px] bg-[linear-gradient(160deg,#241c19,#6b4a3e_60%,#c28e74)] p-5 text-white">
        <span className="text-[10.5px] uppercase tracking-[.14em] text-white/75">Studio Noord · Alkmaar</span>
        <p className="mt-14 text-[30px] font-semibold leading-[.95] tracking-tight" style={{ fontStretch: '110%' }}>Knippen,<br />kleuren,<br />stylen.</p>
      </motion.div>
      <div className="grid gap-2 px-4 pt-4 text-[13px]">
        {[['Knippen dames', '€ 42'], ['Knippen heren', '€ 29'], ['Kleuren', 'v.a. € 65']].map(([a, b]) => (
          <div key={a} className="flex justify-between border-b border-line pb-2"><span>{a}</span><b>{b}</b></div>
        ))}
      </div>
      <div className="relative mx-4 mb-7 mt-auto">
        <motion.div animate={tap ? { scale: [1, 0.95, 1] } : {}} transition={{ duration: 0.35 }} className="flex h-[52px] items-center justify-center gap-2 rounded-full bg-[#16a34a] text-[14.5px] font-semibold text-white shadow-[0_14px_30px_-12px_rgba(22,163,74,.8)]">
          <MessageCircle size={17} /> Afspraak via WhatsApp
        </motion.div>
        {tap && <motion.span className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50" initial={{ scale: 0.3, opacity: 0.8 }} animate={{ scale: 3, opacity: 0 }} transition={{ duration: 0.7 }} />}
      </div>
    </div>
  );
}

function SceneChat({ step }: { step: number }) {
  const msg = 'Hoi! Kan ik donderdag rond 11:00 knippen?';
  const draft = useTyping(msg, step === 2, 38, 400);
  const sent = step >= 3 || (step === 2 && draft.length === msg.length);
  return (
    <div className="flex h-full flex-col bg-[#efeae2]">
      <div className="flex items-center gap-3 border-b border-black/5 bg-[#f7f7f7] px-4 pb-3 pt-[52px]">
        <span className="h-9 w-9 rounded-full bg-[linear-gradient(160deg,#241c19,#c28e74)]" />
        <span className="leading-tight">
          <b className="block text-[14px]">Studio Noord</b>
          <span className="text-[11px] text-muted">{step === 3 ? 'AI-assistent typt…' : 'zakelijk account'}</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-2 px-3 py-4 text-[13px] leading-snug">
        <AnimatePresence>
          {sent && (
            <motion.div key="m1" initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="max-w-[82%] self-end rounded-[14px] rounded-br-[4px] bg-[#d9fdd3] px-3 py-2 shadow-sm">
              {msg}<span className="mt-0.5 flex items-center justify-end gap-1 text-[10px] text-[#5a8a5a]">09:41 <CheckCheck size={12} className={step >= 3 ? 'text-[#34B7F1]' : ''} /></span>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-1 self-start rounded-[14px] bg-white px-3.5 py-3 shadow-sm">
              {[0, 1, 2].map((i) => <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-soft" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }} />)}
            </motion.div>
          )}
          {step >= 4 && (
            <motion.div key="m2" initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ease }} className="max-w-[86%] self-start rounded-[14px] rounded-bl-[4px] bg-white px-3 py-2 shadow-sm">
              Hoi Sanne! Donderdag 11:00 is vrij en staat voor je vast. Woensdag krijg je een herinnering.
              <span className="mt-1 flex items-center gap-1 text-[10px] text-soft"><Sparkles size={10} /> AI-assistent · 09:41</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-2 bg-[#f7f7f7] px-3 pb-7 pt-2">
        <div className="min-h-[38px] flex-1 rounded-full bg-white px-4 py-2.5 text-[13px]">
          {step === 2 && !sent ? <>{draft}<Caret color="#16a34a" /></> : <span className="text-soft">Bericht</span>}
        </div>
        <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-[#16a34a] text-white"><Send size={15} /></span>
      </div>
      <AnimatePresence>
        {step >= 4 && (
          <motion.div initial={{ y: -90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 220, damping: 22 }} className="absolute inset-x-2.5 top-11 z-20 flex items-center gap-3 rounded-[18px] bg-white/90 p-3 shadow-[0_18px_40px_-14px_rgba(0,0,0,.4)] backdrop-blur">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-white"><CalendarCheck size={17} /></span>
            <span className="leading-tight"><b className="block text-[12.5px]">Agenda · nu</b><span className="text-[12px] text-muted">Knippen · do 12 nov, 11:00</span></span>
            <Check size={16} className="ml-auto text-[#16a34a]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
