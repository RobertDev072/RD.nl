import type { Metadata } from 'next';
import { MessageCircle } from 'lucide-react';
import PageHero from '@/components/PageHero';
import FlowStory from '@/components/home/FlowStory';
import TiltCard from '@/components/TiltCard';
import Faq from '@/components/Faq';
import CtaBand from '@/components/CtaBand';
import { Reveal, SplitHeading } from '@/components/Reveal';
import { getService } from '@/lib/content';
import { waLink } from '@/lib/site';

const s = getService('ai-automatisering')!;

export const metadata: Metadata = {
  title: 'AI-automatisering: mis nooit meer een klant',
  description: s.seoDescription,
  alternates: { canonical: '/automatisering' }
};

export default function Automatisering() {
  return (
    <>
      <PageHero eyebrow="AI en automatisering" title="Mis nooit meer een *klant*." intro={s.intro}>
        <a href={waLink('Hoi Robert, ik wil meer weten over AI-automatisering voor mijn zaak.')} className="btn-accent"><MessageCircle size={18} /> Vraag een demo aan</a>
      </PageHero>
      <section className="border-y border-line bg-white"><FlowStory /></section>
      <section className="wrap py-[clamp(96px,12vw,170px)]">
        <p className="eyebrow">Wat de agent doet</p>
        <SplitHeading text="Jij werkt, de agent *plant*." className="h2 mt-4" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {s.features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <TiltCard>
                <div className={'card flex h-full min-h-[230px] flex-col p-7 ' + (i === 0 ? 'bg-night text-white' : '')}>
                  <span className={'font-mono text-[13px] ' + (i === 0 ? 'text-white/50' : 'text-accent')}>0{i + 1}</span>
                  <h3 className="h3 mt-auto pt-8 text-[24px]">{f.title}</h3>
                  <p className={'mt-2 text-[15px] leading-relaxed ' + (i === 0 ? 'text-white/70' : 'text-muted')}>{f.text}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="wrap grid gap-12 pb-[clamp(96px,12vw,170px)] lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
        <div><p className="eyebrow">Vragen</p><SplitHeading text="Hoe werkt het *precies*?" className="h2 mt-4 text-[clamp(38px,4.4vw,72px)]" /></div>
        <Faq items={s.faq} />
      </section>
      <CtaBand title="Benieuwd wat het voor jouw zaak doet?" />
    </>
  );
}
