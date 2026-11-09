'use client';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { SplitHeading } from '../Reveal';

const steps = [
  { t: 'Kennismaking', d: 'Een kort gesprek of appje. Wat wil je bereiken en waar verlies je nu tijd of klanten?' },
  { t: 'Gratis voorbeeld', d: 'Je krijgt een klikbaar ontwerp te zien voordat je iets betaalt.' },
  { t: 'Bouwen en koppelen', d: 'Website, app of platform, gekoppeld aan je agenda, betalingen en WhatsApp.' },
  { t: 'Live en doorgroeien', d: 'Lancering, hosting en onderhoud. Bel wanneer je me nodig hebt.' }
];

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] });
  const line = useSpring(scrollYProgress, { stiffness: 100, damping: 24 });
  return (
    <section className="wrap py-[clamp(96px,12vw,180px)]">
      <p className="eyebrow">Werkwijze</p>
      <SplitHeading text="Eerst zien, dan *beslissen*." className="h2 mt-4" />
      <div ref={ref} className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
        <span aria-hidden className="absolute left-0 right-0 top-[27px] hidden h-[2px] bg-line md:block" />
        <motion.span aria-hidden className="absolute left-0 right-0 top-[27px] hidden h-[2px] origin-left bg-blue md:block" style={{ scaleX: line }} />
        <span aria-hidden className="absolute bottom-6 left-[27px] top-6 w-[2px] bg-line md:hidden" />
        <motion.span aria-hidden className="absolute bottom-6 left-[27px] top-6 w-[2px] origin-top bg-blue md:hidden" style={{ scaleY: line }} />
        {steps.map((s, i) => (
          <motion.div key={s.t} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-15% 0px' }} transition={{ duration: 0.7, delay: i * 0.12, ease: [0.2, 0.7, 0.2, 1] }} className="relative flex gap-5 md:block">
            <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full border border-line bg-white font-mono text-[14px] font-medium shadow-card">0{i + 1}</span>
            <div className="pt-3 md:pt-0">
              <h3 className="h3 text-[24px] md:mt-6 md:text-[26px]">{s.t}</h3>
              <p className="mt-2 max-w-[32ch] text-[15.5px] leading-relaxed text-muted md:mt-3">{s.d}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
