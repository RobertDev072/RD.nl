import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Hero from '@/components/home/Hero';
import ServicesGrid from '@/components/home/ServicesGrid';
import FlowStory from '@/components/home/FlowStory';
import ProjectsRail from '@/components/home/ProjectsRail';
import Process from '@/components/home/Process';
import Marquee from '@/components/Marquee';
import Counter from '@/components/Counter';
import Faq from '@/components/Faq';
import { Reveal, SplitHeading } from '@/components/Reveal';
import { projects, stack } from '@/lib/content';
import { site } from '@/lib/site';

const faq = [
  { q: 'Wat kost een website laten maken in Alkmaar?', a: 'Werk begint vanaf €100. Je krijgt vooraf een prijs per klus. Geen contracten en geen vaste maandkosten.' },
  { q: 'Bouw je ook web apps, SaaS en apps?', a: 'Ja. Van klantportaal en boekingssysteem tot SaaS-platform en mobiele app, met koppelingen en automatisering.' },
  { q: 'Zorg je dat ik gevonden word in Google?', a: 'Ja. Elke site krijgt een goede SEO-basis en snelle laadtijd, en ik help met je Google Bedrijfsprofiel.' },
  { q: 'Regel je ook domein, mailboxen en hosting?', a: 'Ja. Met mijn achtergrond als systeembeheerder regel ik domein, zakelijke mail, hosting, back-ups en veilige opslag.' },
  { q: 'Hoe neem ik contact op?', a: `Bel of app ${site.phone}. Je spreekt mij direct, zonder accountmanager of ticketsysteem.` }
];

export default function Home() {
  const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  return (
    <>
      <Hero />

      <section className="border-y border-line bg-white/60 py-7 backdrop-blur">
        <Marquee
          items={[...projects.map((p) => p.name), ...stack.slice(0, 6)].map((t, i) => (
            <span key={i} className="flex items-center gap-16 text-[clamp(22px,2.2vw,32px)] font-semibold tracking-tight text-ink/35" style={{ fontStretch: '115%' }}>
              {t}<span className="h-2 w-2 rounded-full bg-blue/40" />
            </span>
          ))}
        />
      </section>

      <ServicesGrid />

      <section className="relative border-y border-line bg-white">
        <FlowStory />
      </section>

      <ProjectsRail />

      <section className="relative overflow-hidden bg-white py-[clamp(96px,12vw,180px)]">
        <div aria-hidden className="absolute -left-40 top-1/3 h-[60vh] w-[60vh] rounded-full bg-blue/15 blur-[120px]" />
        <div className="wrap relative grid items-center gap-14 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
          <Reveal>
            <div className="relative aspect-[4/5] max-w-[520px] overflow-hidden rounded-[36px] bg-navy shadow-glow">
              <div aria-hidden className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-blue/60 blur-3xl" />
              <div className="absolute inset-0 grid place-items-center"><Image src="/img/logo-white.png" alt="R DEV" width={210} height={266} className="w-[42%]" /></div>
              <div className="absolute inset-x-6 bottom-6 flex items-center justify-between rounded-2xl bg-white/10 px-5 py-4 text-white backdrop-blur">
                <span><b className="block">{site.owner}</b><span className="text-[13px] text-white/70">Developer · {site.city}</span></span>
                <span className="font-script text-[34px] text-[#8fb0ff]">R DEV</span>
              </div>
            </div>
          </Reveal>
          <div>
            <p className="eyebrow">Over mij</p>
            <SplitHeading text="Hoi, ik ben Robert. Van *schets* tot productie." className="h2 mt-4" />
            <Reveal delay={0.2}>
              <p className="lead mt-8 max-w-[56ch]">Ik ben 24, kom uit Alkmaar en heb een opleiding als developer, met kennis van technische systemen vanuit mijn werk als systeembeheerder. In vijf jaar bouwde ik meer dan honderd websites.</p>
              <p className="lead mt-5 max-w-[56ch]">Ik ontwerp en bouw zelf: UI/UX, front-end en back-end. Ik moderniseer bestaande systemen, koppel API&apos;s en zet AI-agents in waar dat je tijd bespaart.</p>
            </Reveal>
            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
              {[{ n: 100, s: '+', l: 'websites gebouwd' }, { n: 5, s: ' jaar', l: 'ervaring' }, { n: 100, s: '', l: 'startprijs per klus', p: '€' }, { n: 1, s: '', l: 'directe lijn' }].map((x) => (
                <Reveal key={x.l}>
                  <p className="text-[clamp(40px,4vw,64px)] font-semibold leading-none tracking-[-0.04em]" style={{ fontStretch: '110%' }}>{x.p}<Counter to={x.n} suffix={x.s} /></p>
                  <p className="mt-2 text-[14px] text-muted">{x.l}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2} className="mt-12"><Link href="/over" className="btn-primary">Meer over mij <ArrowRight size={17} /></Link></Reveal>
          </div>
        </div>
      </section>

      <Process />

      <section className="wrap grid gap-12 pb-[clamp(96px,12vw,180px)] lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
        <div>
          <p className="eyebrow">Veelgestelde vragen</p>
          <SplitHeading text="Website laten maken in *Alkmaar*." className="h2 mt-4 text-[clamp(38px,4.4vw,72px)]" />
          <Reveal delay={0.2}><p className="lead mt-6 max-w-[40ch]">Ook actief in {site.areas.slice(1, 6).join(', ')} en de rest van {site.region}.</p></Reveal>
        </div>
        <Reveal><Faq items={faq} /></Reveal>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </>
  );
}
