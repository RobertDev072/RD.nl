'use client';
import Link from 'next/link';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { projects } from '@/lib/content';
import { BrowserFrame, ScreenCard } from '../Frames';

export default function ProjectsRail() {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useSpring(useTransform(scrollYProgress, [0, 1], [0, -dist]), { stiffness: 140, damping: 30, mass: 0.4 });
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const measure = () => { if (track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth)); };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <section aria-labelledby="werk-title">
      {/* desktop: horizontal pinned rail */}
      <div ref={ref} className="relative hidden lg:block" style={{ height: `calc(100svh + ${dist}px)` }}>
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-[60px]">
          <div className="wrap mb-8 flex items-end justify-between gap-8">
            <div>
              <p className="eyebrow">Werk</p>
              <h2 id="werk-title" className="h2 mt-3 text-[clamp(40px,4.6vw,80px)]">Gebouwd en <span className="script text-[1.15em]">live</span>.</h2>
            </div>
            <div className="flex items-center gap-6">
              <span className="relative h-[3px] w-48 overflow-hidden rounded bg-line"><motion.span className="absolute inset-y-0 left-0 rounded bg-blue" style={{ width: bar }} /></span>
              <Link href="/projecten" className="btn-ghost">Alle projecten</Link>
            </div>
          </div>
          <motion.div ref={track} style={{ x, paddingLeft: 'max(var(--pad), calc((100vw - 1600px) / 2 + var(--pad)))', paddingRight: 'var(--pad)' }} className="flex w-max gap-8">
            {projects.map((p, i) => <RailCard key={p.slug} p={p} i={i} />)}
          </motion.div>
        </div>
      </div>

      {/* mobile: stacked */}
      <div className="wrap py-24 lg:hidden">
        <p className="eyebrow">Werk</p>
        <h2 className="h2 mt-4">Gebouwd en <span className="script text-[1.15em]">live</span>.</h2>
        <div className="mt-10 grid gap-12">
          {projects.map((p, i) => <RailCard key={p.slug} p={p} i={i} mobile />)}
        </div>
      </div>
    </section>
  );
}

function RailCard({ p, i, mobile = false }: { p: (typeof projects)[number]; i: number; mobile?: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5% 0px' }}
      transition={{ duration: 0.8, delay: mobile ? 0 : i * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
      className={mobile ? '' : 'shrink-0'}
      style={mobile ? undefined : { width: 'min(70vw, 1040px, calc((100svh - 360px) * 1.45))' }}
    >
      <Link href={`/projecten/${p.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-[32px] p-[clamp(20px,3.5vw,56px)] pb-0" style={{ background: `radial-gradient(120% 90% at 85% 0%, ${p.accent}33, transparent 60%), linear-gradient(180deg,#fff,#eef2f8)` }}>
          <div className="absolute inset-0 rounded-[32px] ring-1 ring-inset ring-black/[.06]" />
          <div className="relative transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:scale-[1.01]">
            <BrowserFrame src={p.desktop} alt={`${p.name} op desktop`} url={p.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')} className="rounded-b-none" />
          </div>
          <div className="absolute bottom-[-6%] right-[6%] w-[19%] min-w-[96px] transition-transform duration-700 ease-out group-hover:-translate-y-6 group-hover:rotate-[-3deg]">
            <ScreenCard src={p.mobile} alt={`${p.name} op mobiel`} />
          </div>
        </div>
        <div className="mt-6 flex items-start justify-between gap-6">
          <div>
            <p className="eyebrow">{p.type} · {p.sector}</p>
            <h3 className="h3 mt-2 text-[clamp(26px,2.6vw,40px)]">{p.name}</h3>
            <p className="mt-2 line-clamp-2 max-w-[60ch] text-[15.5px] leading-relaxed text-muted">{p.summary}</p>
          </div>
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-line bg-white transition-all duration-500 group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
            <ArrowUpRight size={22} />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
