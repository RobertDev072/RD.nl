import type { Metadata } from 'next';
import Image from 'next/image';
import { Code2, Compass, Layers, Server, Sparkles, Wrench } from 'lucide-react';
import PageHero from '@/components/PageHero';
import Counter from '@/components/Counter';
import TiltCard from '@/components/TiltCard';
import CtaBand from '@/components/CtaBand';
import { Reveal, SplitHeading } from '@/components/Reveal';
import { stack } from '@/lib/content';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Over Robert Rocha, developer uit Alkmaar',
  description: 'Robert Rocha (24) uit Alkmaar: developer met achtergrond als systeembeheerder. 100+ websites in 5 jaar, van UI/UX tot productie.',
  alternates: { canonical: '/over' }
};

const values = [
  { icon: Compass, t: 'Eerst begrijpen', d: 'Ik kijk naar je bedrijf en je klanten voordat ik iets ontwerp.' },
  { icon: Layers, t: 'Ontwerp en bouw', d: 'UI/UX, front-end en back-end in één hand. Van schets tot productie.' },
  { icon: Server, t: 'Techniek geregeld', d: 'Als systeembeheerder regel ik ook hosting, mail, data en beveiliging.' },
  { icon: Sparkles, t: 'Slim automatiseren', d: 'AI-agents en koppelingen waar ze je echt tijd besparen.' },
  { icon: Code2, t: 'Modern en snel', d: 'React, Next.js, Node.js en Docker. Gebouwd om lang mee te gaan.' },
  { icon: Wrench, t: 'Blijven helpen', d: 'Geen contract, wel een directe lijn. Bel wanneer je me nodig hebt.' }
];

export default function Over() {
  return (
    <>
      <PageHero eyebrow="Over mij" title="Hoi, ik ben *Robert*." intro={`Ik ben 24 en kom uit ${site.city}. Ik heb een opleiding als developer en kennis van technische systemen vanuit mijn werk als systeembeheerder. De afgelopen vijf jaar bouwde ik meer dan honderd websites.`} />

      <section className="wrap grid items-center gap-14 pb-[clamp(96px,12vw,170px)] lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
        <Reveal>
          <div className="relative aspect-[4/5] max-w-[540px] overflow-hidden rounded-[36px] bg-navy shadow-glow">
            <div aria-hidden className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-blue/60 blur-3xl" />
            <div className="absolute inset-0 grid place-items-center"><Image src="/img/logo-white.png" alt="R DEV logo" width={220} height={279} className="w-[42%]" /></div>
          </div>
        </Reveal>
        <div>
          <SplitHeading text="Van *schets* tot productie." className="h2" />
          <Reveal delay={0.15}>
            <p className="lead mt-8">Ik ontwerp en bouw zelf. Websites, web apps, SaaS en apps, en de systemen erachter. Ik moderniseer bestaande software, koppel API&apos;s en zet AI-agents in waar dat tijd bespaart.</p>
            <p className="lead mt-5">Ik kijk niet alleen naar hoe iets eruitziet, maar naar wat het oplevert: meer aanvragen, minder gemiste klanten en minder handwerk.</p>
          </Reveal>
          <div className="mt-12 grid grid-cols-3 gap-6">
            {[{ n: 100, s: '+', l: 'websites' }, { n: 5, s: '', l: 'jaar ervaring' }, { n: 24, s: '', l: 'jaar, uit Alkmaar' }].map((x) => (
              <Reveal key={x.l}>
                <p className="text-[clamp(44px,4.6vw,72px)] font-semibold leading-none tracking-[-0.04em]" style={{ fontStretch: '110%' }}><Counter to={x.n} suffix={x.s} /></p>
                <p className="mt-2 text-[14px] text-muted">{x.l}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white py-[clamp(96px,12vw,170px)]">
        <div className="wrap">
          <p className="eyebrow">Hoe ik werk</p>
          <SplitHeading text="Wat je van me kunt *verwachten*." className="h2 mt-4" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.t} delay={(i % 3) * 0.08}>
                <TiltCard>
                  <div className="card flex h-full min-h-[220px] flex-col p-7">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue"><v.icon size={22} strokeWidth={1.7} /></span>
                    <h3 className="h3 mt-auto pt-8 text-[24px]">{v.t}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">{v.d}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap py-[clamp(96px,12vw,170px)]">
        <p className="eyebrow">Stack en kennis</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {stack.map((s, i) => (
            <Reveal key={s} delay={i * 0.04}><span className="inline-block rounded-full border border-line bg-white px-6 py-3 text-[clamp(16px,1.4vw,20px)] font-medium shadow-card">{s}</span></Reveal>
          ))}
        </div>
      </section>
      <CtaBand title="Zullen we kennismaken?" />
    </>
  );
}
