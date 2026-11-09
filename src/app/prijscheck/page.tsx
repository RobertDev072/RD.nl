import type { Metadata } from 'next';
import PrijsCheck from '@/components/PrijsCheck';
import Faq from '@/components/Faq';
import { Reveal, SplitHeading } from '@/components/Reveal';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Wat kost mijn nieuwe website? Gratis AI-prijscheck',
  description: 'Plak de link van je huidige website en zie direct wat een nieuwe site kost. De AI-agent van Lorvex leest je site, geeft een prijsindicatie en ontwerpt een preview.',
  alternates: { canonical: '/prijscheck' }
};

const faq = [
  { q: 'Hoe werkt de prijscheck?', a: 'De agent leest de openbare pagina van je huidige website, kijkt naar techniek, inhoud en vindbaarheid, kiest het pakket dat past en ontwerpt met AI een voorbeeld van een nieuwe homepage.' },
  { q: 'Wat kost een website bij Lorvex?', a: 'Een simpele site tot 3 pagina’s kost €100. Een complete website maximaal €250. Een webshop ongeveer €500 en een web app of SaaS ongeveer €750. Geen contracten en geen vaste kosten.' },
  { q: 'Is de prijs definitief?', a: 'Het is een indicatie op basis van een automatische scan. Na een kort gesprek krijg je een vaste prijs per klus, voordat we beginnen.' },
  { q: 'Wat gebeurt er met mijn gegevens?', a: 'We lezen alleen de openbare pagina van de link die je invult. We slaan je scan niet op en je hoeft geen naam of e-mailadres achter te laten.' },
  { q: 'Is de preview mijn nieuwe website?', a: 'Het is een eerste ontwerp om je te laten zien wat er kan. De echte site maken we samen met jou, met je eigen foto’s, teksten en wensen.' }
];

export default function Prijscheck() {
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebApplication', name: 'Lorvex AI-prijscheck', url: `${site.url}/prijscheck`, applicationCategory: 'BusinessApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' }, provider: { '@id': `${site.url}/#organization` } },
      { '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
    ]
  };
  return (
    <>
      <section className="relative overflow-hidden pt-[76px]">
        <div aria-hidden className="absolute inset-0 bg-grid" />
        <div aria-hidden className="absolute -top-40 right-[-10%] h-[70vh] w-[70vh] rounded-full bg-haze/50 blur-[130px]" />
        <div className="wrap relative pb-[clamp(64px,8vw,120px)] pt-[clamp(56px,8vw,120px)]">
          <PrijsCheck
            intro={
              <>
                <Reveal><p className="eyebrow">Gratis AI-prijscheck</p></Reveal>
                <SplitHeading as="h1" text="Wat kost jouw nieuwe *website*?" className="display mt-6 text-[clamp(46px,6vw,104px)]" />
                <Reveal delay={0.3}>
                  <p className="lead mt-8 max-w-[46ch]">Plak de link van je huidige site en vertel wat je wilt. Onze AI-agent leest je website, geeft direct een eerlijke prijsindicatie en ontwerpt een preview van je nieuwe site.</p>
                  <ul className="mt-8 grid gap-2 text-[15px]">
                    {['Simpele site tot 3 pagina’s: €100', 'Complete website: maximaal €250', 'Webshop: ongeveer €500', 'Web app of SaaS: ongeveer €750'].map((t) => (
                      <li key={t} className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-ink" />{t}</li>
                    ))}
                  </ul>
                </Reveal>
              </>
            }
          />
        </div>
      </section>
      <section className="wrap grid gap-12 py-[clamp(80px,10vw,140px)] lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
        <div>
          <p className="eyebrow">Vragen</p>
          <SplitHeading text="Over de *prijscheck*." className="h2 mt-4 text-[clamp(38px,4.4vw,72px)]" />
        </div>
        <Reveal><Faq items={faq} /></Reveal>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
