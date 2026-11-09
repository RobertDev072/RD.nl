import type { Metadata } from 'next';
import { Code2, Compass, Layers, Server, Sparkles, Wrench } from 'lucide-react';
import PageHero from '@/components/PageHero';
import Counter from '@/components/Counter';
import TiltCard from '@/components/TiltCard';
import CtaBand from '@/components/CtaBand';
import { Reveal, SplitHeading } from '@/components/Reveal';
import { stack } from '@/lib/content';
import { site } from '@/lib/site';
import { LogoMark } from '@/components/Logo';

export const metadata: Metadata = {
  title: 'Over Lorvex: AI tech company en webbureau uit Alkmaar',
  description: 'Lorvex is een AI tech company uit Alkmaar, opgericht door developer Robert Rocha. 100+ websites in 5 jaar. Websites, apps, SaaS en AI-oplossingen voor het mkb.',
  alternates: { canonical: '/over' }
};

const facts = [
  ['Bedrijfsnaam', 'Lorvex'],
  ['Wat we doen', 'Websites, web apps, SaaS, apps, AI-automatisering, AI-development en SEO'],
  ['Vestiging', 'Alkmaar, Noord-Holland'],
  ['Werkgebied', 'Alkmaar, Heiloo, Heerhugowaard, Castricum, Bergen, Langedijk, Schagen, Den Helder en online in heel Nederland'],
  ['Oprichter', 'Robert Rocha, developer en systeembeheerder'],
  ['Ervaring', 'Meer dan 100 websites en platformen in 5 jaar'],
  ['Werkwijze', 'Vaste prijs per klus, werk vanaf €100, geen contracten of vaste kosten'],
  ['Contact', '+31 6 28669488 (bellen en WhatsApp)']
];

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
      <PageHero eyebrow="Over Lorvex" title="Een AI tech company uit *Alkmaar*." intro={`Lorvex bouwt websites, web apps, SaaS, apps en AI-oplossingen voor ondernemers. Opgericht in ${site.city} door Robert Rocha, met één doel: technologie die jouw zaak laat groeien en zorgt dat je geen klant mist.`} />

      <section className="wrap grid gap-12 pb-[clamp(96px,12vw,170px)] lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
        <div>
          <p className="eyebrow">Wie we zijn</p>
          <SplitHeading text="Techniek die *werkt* voor je zaak." className="h2 mt-4 text-[clamp(38px,4.4vw,72px)]" />
        </div>
        <Reveal>
          <div className="grid gap-5 text-[17px] leading-[1.75] text-muted">
            <p>Lorvex is een AI tech company en webbureau uit Alkmaar. We ontwerpen en bouwen websites, web apps, SaaS-platformen en apps, en we zetten AI in waar het ondernemers echt tijd en klanten oplevert: een assistent die WhatsApp-berichten beantwoordt, een agent die afspraken in de agenda zet of software die administratie overneemt.</p>
            <p>We werken voor het mkb in Alkmaar en de rest van Noord-Holland: installateurs, bouwbedrijven, salons, coaches, praktijken en startende SaaS-bedrijven. Klein genoeg om direct bereikbaar te zijn, technisch sterk genoeg om ook complexe platformen te bouwen en te beheren.</p>
            <p>Onze werkwijze is simpel. Geen contracten en geen vaste maandkosten. Je krijgt eerst een gratis voorbeeld, daarna een vaste prijs per klus. Werk begint vanaf €100. En na de livegang bel of app je gewoon wanneer je ons nodig hebt.</p>
          </div>
        </Reveal>
      </section>

      <section className="wrap grid items-center gap-14 pb-[clamp(96px,12vw,170px)] lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
        <Reveal>
          <div className="relative aspect-[4/5] max-w-[540px] overflow-hidden rounded-[36px] bg-night shadow-glow">
            <div aria-hidden className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/[.12] blur-3xl" />
            <div className="absolute inset-0 grid place-items-center"><LogoMark className="w-[38%] text-white" title="Lorvex" /></div>
          </div>
        </Reveal>
        <div>
          <p className="eyebrow">De oprichter</p>
          <SplitHeading text="Hoi, ik ben *Robert*." className="h2 mt-4" />
          <Reveal delay={0.15}>
            <p className="lead mt-8">Ik ben 24 en kom uit {site.city}. Ik heb een opleiding als developer en kennis van technische systemen vanuit mijn werk als systeembeheerder. De afgelopen vijf jaar bouwde ik meer dan honderd websites.</p>
            <p className="lead mt-5">Ik ontwerp en bouw zelf. Websites, web apps, SaaS en apps, en de systemen erachter. Ik moderniseer bestaande software, koppel API&apos;s en zet AI-agents in waar dat tijd bespaart.</p>
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
          <p className="eyebrow">Hoe we werken</p>
          <SplitHeading text="Wat je van me kunt *verwachten*." className="h2 mt-4" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.t} delay={(i % 3) * 0.08}>
                <TiltCard>
                  <div className="card flex h-full min-h-[220px] flex-col p-7">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-50 text-accent"><v.icon size={22} strokeWidth={1.7} /></span>
                    <h3 className="h3 mt-auto pt-8 text-[24px]">{v.t}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">{v.d}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap grid gap-12 pt-[clamp(96px,12vw,170px)] lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
        <div>
          <p className="eyebrow">Bedrijfsgegevens</p>
          <SplitHeading text="Lorvex in het *kort*." className="h2 mt-4 text-[clamp(38px,4.4vw,72px)]" />
        </div>
        <Reveal>
          <dl className="divide-y divide-line border-y border-line">
            {facts.map(([k, v]) => (
              <div key={k} className="grid gap-1 py-5 sm:grid-cols-[200px_1fr] sm:gap-6">
                <dt className="font-mono text-[12px] uppercase tracking-[.1em] text-soft">{k}</dt>
                <dd className="text-[16px] font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'Over Lorvex',
        url: `${site.url}/over`,
        about: { '@id': `${site.url}/#organization` },
        mainEntity: { '@type': 'Person', name: site.owner, jobTitle: 'Oprichter van Lorvex', worksFor: { '@id': `${site.url}/#organization` }, address: { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: 'NL' }, knowsAbout: stack }
      }) }} />
    </>
  );
}
