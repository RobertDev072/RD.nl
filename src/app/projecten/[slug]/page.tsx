import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { BrowserFrame, ScreenCard } from '@/components/Frames';
import CtaBand from '@/components/CtaBand';
import { Reveal, SplitHeading } from '@/components/Reveal';
import { ServiceIcon } from '@/components/icons';
import { getProject, getService, projects } from '@/lib/content';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  const title = `${p.name}: ${p.type.toLowerCase()} voor ${p.sector.toLowerCase()}`;
  return { title, description: p.summary, alternates: { canonical: `/projecten/${p.slug}` }, openGraph: { title, description: p.summary, images: [{ url: p.desktop }] } };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const idx = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(idx + 1) % projects.length];
  const host = p.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  return (
    <>
      <section className="relative overflow-hidden pt-[76px]">
        <div aria-hidden className="absolute inset-0 bg-grid" />
        <div aria-hidden className="absolute -top-40 right-[-10%] h-[80vh] w-[80vh] rounded-full blur-[140px]" style={{ background: `${p.accent}40` }} />
        <div className="wrap relative pt-[clamp(48px,8vw,110px)]">
          <Reveal><Link href="/projecten" className="inline-flex items-center gap-2 text-[14px] text-muted hover:text-ink"><ArrowLeft size={15} /> Alle projecten</Link></Reveal>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-8">
            <div>
              <Reveal><p className="eyebrow">{p.type} · {p.sector}</p></Reveal>
              <SplitHeading as="h1" text={p.name} className="display mt-4 text-[clamp(56px,9vw,160px)]" />
            </div>
            <Reveal delay={0.2}><a href={p.url} target="_blank" rel="noopener" className="btn-primary">Bekijk live: {host} <ArrowUpRight size={17} /></a></Reveal>
          </div>
          <Reveal delay={0.25} className="relative mt-14">
            <BrowserFrame src={p.desktop} alt={`${p.name} op desktop`} url={host} priority />
            <div className="absolute -bottom-10 right-[5%] w-[17%] min-w-[110px]"><ScreenCard src={p.mobile} alt={`${p.name} op mobiel`} priority /></div>
          </Reveal>
        </div>
      </section>

      <section className="wrap grid gap-14 py-[clamp(96px,12vw,170px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <p className="eyebrow">Het doel</p>
          <Reveal><p className="h3 mt-5 text-[clamp(28px,3vw,46px)] leading-[1.12]">{p.goal}</p></Reveal>
          <Reveal delay={0.15}><p className="lead mt-6">{p.summary}</p></Reveal>
        </div>
        <div>
          <p className="eyebrow">Wat ik heb gebouwd</p>
          <ul className="mt-6 grid gap-3">
            {p.built.map((b, i) => (
              <Reveal key={b} delay={i * 0.06}>
                <li className="card flex items-center gap-4 rounded-2xl px-5 py-4 text-[16.5px] font-medium">
                  <span className="grid h-8 w-8 place-items-center rounded-full text-white" style={{ background: '#1F5CFF' }}><Check size={16} strokeWidth={3} /></span>{b}
                </li>
              </Reveal>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-2">
            {p.services.map(getService).filter(Boolean).map((s) => (
              <Link key={s!.slug} href={`/diensten/${s!.slug}`} className="chip hover:border-ink"><ServiceIcon name={s!.icon} size={15} className="text-blue" />{s!.menu}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <Link href={`/projecten/${next.slug}`} className="wrap group flex flex-wrap items-center justify-between gap-6 py-16">
          <span>
            <span className="eyebrow">Volgend project</span>
            <span className="h2 mt-3 block transition-colors group-hover:text-blue">{next.name}</span>
          </span>
          <span className="grid h-20 w-20 place-items-center rounded-full border border-line transition-all duration-500 group-hover:translate-x-2 group-hover:border-ink group-hover:bg-ink group-hover:text-white"><ArrowRight size={28} /></span>
        </Link>
      </section>
      <CtaBand title="Ook zo’n project?" />
    </>
  );
}
