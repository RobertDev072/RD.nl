import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, MessageCircle } from 'lucide-react';
import PageHero from '@/components/PageHero';
import ProjectCard from '@/components/ProjectCard';
import TiltCard from '@/components/TiltCard';
import Faq from '@/components/Faq';
import CtaBand from '@/components/CtaBand';
import { ServiceIcon } from '@/components/icons';
import { Reveal, SplitHeading } from '@/components/Reveal';
import { getProject, getService, services } from '@/lib/content';
import { site, waLink } from '@/lib/site';

/** Eerste letter klein, behalve bij afkortingen als AI, SEO en SaaS. */
const lower = (t: string) => (/^(AI|SEO|SaaS)/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1));

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  return { title: s.seoTitle, description: s.seoDescription, alternates: { canonical: `/diensten/${s.slug}` }, openGraph: { title: s.seoTitle, description: s.seoDescription } };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const related = s.projects.map(getProject).filter(Boolean);
  const others = services.filter((o) => o.slug !== s.slug);
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Service', name: s.seoTitle, description: s.seoDescription, provider: { '@type': 'ProfessionalService', name: 'Lorvex', url: site.url }, areaServed: site.areas },
      { '@type': 'FAQPage', mainEntity: s.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
    ]
  };
  return (
    <>
      <PageHero eyebrow={`Dienst · ${s.title}`} title={s.headline.replace(/(\S+)\.$/, '*$1*.')} intro={s.intro}>
        <div className="flex flex-wrap gap-3">
          <a href={waLink(`Hoi Robert, ik heb een vraag over: ${s.menu}`)} className="btn-accent"><MessageCircle size={18} /> Bespreek je project</a>
          <Link href="/projecten" className="btn-ghost">Bekijk projecten</Link>
        </div>
      </PageHero>

      <section className="wrap pb-[clamp(80px,10vw,140px)]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {s.features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <TiltCard>
                <div className="card flex h-full min-h-[240px] flex-col p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-50 font-mono text-[14px] text-accent">0{i + 1}</span>
                  <h3 className="h3 mt-auto pt-8 text-[24px]">{f.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{f.text}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-white py-[clamp(80px,10vw,140px)]">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Wat je krijgt</p>
            <SplitHeading text="Alles erin, *niets* vergeten." className="h2 mt-4 text-[clamp(38px,4.4vw,72px)]" />
            <Reveal delay={0.2}><p className="lead mt-6 max-w-[46ch]">Werk begint vanaf €100. Geen contracten en geen vaste kosten: je krijgt vooraf een prijs per klus.</p></Reveal>
          </div>
          <ul className="grid content-start gap-3 sm:grid-cols-2">
            {s.includes.map((x, i) => (
              <Reveal key={x} delay={i * 0.05}>
                <li className="flex items-center gap-3 rounded-2xl border border-line bg-canvas px-5 py-4 text-[16px] font-medium">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-white"><Check size={15} strokeWidth={3} /></span>{x}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {s.body && (
        <section className="wrap grid gap-12 py-[clamp(80px,10vw,140px)] lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Meer weten</p>
            <SplitHeading text={`Alles over ${lower(s.menu)}.`} className="h2 mt-4 text-[clamp(38px,4.4vw,72px)]" />
          </div>
          <div className="grid gap-12">
            {s.body.map((b) => (
              <Reveal key={b.h}>
                <h2 className="h3 text-[clamp(26px,2.4vw,36px)]">{b.h}</h2>
                {b.p.map((t) => <p key={t.slice(0, 24)} className="mt-4 text-[17px] leading-[1.7] text-muted">{t}</p>)}
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="wrap py-[clamp(80px,10vw,140px)]">
          <p className="eyebrow">Gerelateerd werk</p>
          <SplitHeading text="Zo ziet het eruit in de *praktijk*." className="h2 mt-4 text-[clamp(38px,4.4vw,72px)]" />
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {related.map((p) => <Reveal key={p!.slug}><ProjectCard p={p!} /></Reveal>)}
          </div>
        </section>
      )}

      <section className="wrap grid gap-12 py-[clamp(80px,10vw,140px)] lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
        <div>
          <p className="eyebrow">Vragen</p>
          <SplitHeading text={`Over ${lower(s.title)}.`} className="h2 mt-4 text-[clamp(38px,4.4vw,72px)]" />
        </div>
        <Faq items={s.faq} />
      </section>

      <section className="wrap pb-[clamp(80px,10vw,140px)]">
        <p className="eyebrow mb-6">Andere diensten</p>
        <div className="flex flex-wrap gap-3">
          {others.map((o) => (
            <Link key={o.slug} href={`/diensten/${o.slug}`} className="group inline-flex items-center gap-3 rounded-full border border-line bg-white py-2 pl-2 pr-5 text-[15px] font-medium transition-all hover:-translate-y-0.5 hover:border-ink">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-accent-50 text-accent"><ServiceIcon name={o.icon} size={17} /></span>{o.menu}
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>
      <CtaBand />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
