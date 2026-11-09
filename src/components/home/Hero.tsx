'use client';
import Link from 'next/link';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, CalendarCheck, Check, MessageCircle, Star } from 'lucide-react';
import { useRef, type PointerEvent } from 'react';
import { BrowserFrame, ScreenCard } from '../Frames';
import { site } from '@/lib/site';

const ease = [0.2, 0.7, 0.2, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const visY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const visRot = useTransform(scrollYProgress, [0, 1], [0, -6]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  const layer = (depth: number) => ({ x: useTransform(sx, (v) => v * depth), y: useTransform(sy, (v) => v * depth) });
  const l1 = layer(18), l2 = layer(36), l3 = layer(60);
  const tiltX = useTransform(sy, [-1, 1], [6, -6]);
  const tiltY = useTransform(sx, [-1, 1], [-8, 8]);

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    mx.set((e.clientX / window.innerWidth) * 2 - 1);
    my.set((e.clientY / window.innerHeight) * 2 - 1);
  };

  const words = ['Ik', 'bouw', 'je', 'website,', 'app', 'of', 'platform.'];

  return (
    <section ref={ref} onPointerMove={onMove} className="relative min-h-[100svh] overflow-hidden pt-[76px]">
      <div aria-hidden className="absolute inset-0 bg-grid" />
      <motion.div aria-hidden className="absolute -top-[20%] right-[-10%] h-[90vh] w-[90vh] rounded-full bg-blue/25 blur-[140px]" animate={{ scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
      <div aria-hidden className="absolute bottom-[-30%] left-[-10%] h-[70vh] w-[70vh] rounded-full bg-[#8fb0ff]/25 blur-[140px]" />

      <div className="wrap relative grid min-h-[calc(100svh-76px)] items-center gap-12 py-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-6">
        <motion.div style={{ y: textY, opacity: fade }} className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="chip">
            <span className="h-2 w-2 animate-pulseRing rounded-full bg-blue" /> Webdesign en development · {site.city}
          </motion.div>

          <h1 className="display mt-7 text-[clamp(46px,6.3vw,116px)]" aria-label="Ik bouw je website, app of platform. En zorg dat je geen klant mist.">
            <span aria-hidden className="block">
              {words.map((w, i) => (
                <span key={i} className="inline-block overflow-hidden pb-[.08em] align-bottom">
                  <motion.span className="inline-block" initial={{ y: '105%' }} animate={{ y: '0%' }} transition={{ duration: 1, ease, delay: 0.15 + i * 0.06 }}>{w}</motion.span>
                  {' '}
                </span>
              ))}
            </span>
            <motion.span aria-hidden className="mt-3 block text-[0.56em] leading-[1] text-soft" initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 1, delay: 0.75 }}>
              En zorg dat je <span className="script text-[1.3em]">geen klant</span> mist.
            </motion.span>
          </h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9, ease }} className="lead mt-7 max-w-[52ch]">
            <b className="font-semibold text-ink">Website laten maken in {site.city}?</b> Ik ontwerp en bouw websites, web apps, SaaS en apps. Strak, snel en vindbaar, met slimme automatisering die aanvragen opvangt en afspraken in je agenda zet.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.05, ease }} className="mt-9 flex flex-wrap gap-3">
            <Link href="/contact" className="btn-blue">Plan een gesprek <ArrowRight size={17} /></Link>
            <Link href="/projecten" className="btn-ghost">Bekijk projecten</Link>
          </motion.div>

          <motion.ul initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.08, delayChildren: 1.2 } } }} className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[14px] text-muted">
            {['100+ websites in 5 jaar', 'Werk vanaf €100', 'Geen contracten', 'Directe lijn'].map((t) => (
              <motion.li key={t} variants={{ h: { opacity: 0, y: 8 }, s: { opacity: 1, y: 0 } }} className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-blue-50 text-blue"><Check size={12} strokeWidth={3} /></span>{t}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* visual */}
        <motion.div style={{ y: visY, rotate: visRot }} className="relative h-[clamp(420px,52vw,760px)] lg:-mr-[6vw]">
          <motion.div style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1600 }} className="absolute inset-0">
            <motion.div style={l1} initial={{ opacity: 0, x: 80, rotate: 6 }} animate={{ opacity: 1, x: 0, rotate: 4 }} transition={{ duration: 1.2, ease, delay: 0.3 }} className="absolute right-[2%] top-[4%] w-[72%]">
              <BrowserFrame src="/img/vp-desktop.webp" alt="VeriPasso SaaS, gebouwd door R DEV" url="veripasso.com" className="opacity-90" />
            </motion.div>
            <motion.div style={l2} initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease, delay: 0.45 }} className="absolute left-[2%] top-[22%] w-[80%]">
              <BrowserFrame src="/img/sg-desktop.webp" alt="SG Onderneming website, gebouwd door R DEV" url="sgonderneming.nl" priority />
            </motion.div>
            <motion.div style={l3} initial={{ opacity: 0, y: 100, rotate: -4 }} animate={{ opacity: 1, y: 0, rotate: -3 }} transition={{ duration: 1.2, ease, delay: 0.65 }} className="absolute bottom-[2%] right-[8%] w-[22%] min-w-[110px]">
              <ScreenCard src="/img/gt-mobile.webp" alt="Goaltje web app op mobiel" priority />
            </motion.div>

            <motion.div style={l3} initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 1.4, type: 'spring', stiffness: 160, damping: 16 }} className="absolute left-[-2%] top-[8%] origin-top-left scale-[.82] sm:scale-100">
              <Float><div className="card flex items-center gap-3 rounded-2xl px-4 py-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#16a34a] text-white"><MessageCircle size={17} /></span><span className="leading-tight"><b className="block text-[13px]">Nieuwe aanvraag</b><span className="text-[12px] text-muted">via WhatsApp · nu</span></span></div></Float>
            </motion.div>
            <motion.div style={l2} initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 1.6, type: 'spring', stiffness: 160, damping: 16 }} className="absolute bottom-[12%] left-[2%] origin-bottom-left scale-[.82] sm:left-[6%] sm:scale-100">
              <Float delay={1.2}><div className="card flex items-center gap-3 rounded-2xl px-4 py-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue text-white"><CalendarCheck size={17} /></span><span className="leading-tight"><b className="block text-[13px]">Afspraak ingepland</b><span className="text-[12px] text-muted">do 12 nov · 11:00</span></span></div></Float>
            </motion.div>
            <motion.div style={l1} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.8, type: 'spring', stiffness: 160, damping: 16 }} className="absolute right-[0%] top-[-2%] hidden md:block">
              <Float delay={0.6}><div className="card flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px]"><span className="flex text-[#f5a524]">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={13} fill="currentColor" strokeWidth={0} />)}</span><b>100+</b> websites live</div></Float>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-8 hidden flex-col items-center gap-2 text-soft xl:flex" style={{ right: 'var(--pad)' }}>
        <span className="eyebrow text-[10px]">Scroll</span>
        <span className="relative h-10 w-[2px] overflow-hidden rounded bg-line"><motion.span className="absolute inset-x-0 top-0 h-4 rounded bg-blue" animate={{ y: [-16, 40] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} /></span>
      </motion.div>
    </section>
  );
}

function Float({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay }}>
      {children}
    </motion.div>
  );
}
