import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import CtaBand from '@/components/CtaBand';
import { ServiceIcon } from '@/components/icons';
import { Reveal } from '@/components/Reveal';
import { getService } from '@/lib/content';
import { formatDate, getArticle, getArticles } from '@/lib/kennisbank';
import { site, waLink } from '@/lib/site';

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getArticle((await params).slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: `/kennisbank/${a.slug}` },
    openGraph: { type: 'article', title: a.title, description: a.description, publishedTime: a.date, modifiedTime: a.updated || a.date, authors: [site.owner] }
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const service = a.service ? getService(a.service) : undefined;
  const more = getArticles().filter((x) => x.slug !== a.slug).slice(0, 3);
  const url = `${site.url}/kennisbank/${a.slug}`;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: a.title,
        description: a.description,
        datePublished: a.date,
        dateModified: a.updated || a.date,
        wordCount: a.words,
        keywords: a.keyword,
        inLanguage: 'nl-NL',
        mainEntityOfPage: url,
        image: `${site.url}/brand/og-lorvex.png`,
        author: { '@type': 'Person', name: site.owner, url: `${site.url}/over` },
        publisher: { '@id': `${site.url}/#organization` }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          { '@type': 'ListItem', position: 2, name: 'Kennisbank', item: `${site.url}/kennisbank` },
          { '@type': 'ListItem', position: 3, name: a.title, item: url }
        ]
      }
    ]
  };

  return (
    <>
      <article className="relative pt-[76px]">
        <div aria-hidden className="absolute inset-x-0 top-0 h-[520px] bg-grid" />
        <header className="wrap relative max-w-[1100px] pb-12 pt-[clamp(56px,8vw,120px)]">
          <Reveal>
            <nav aria-label="Kruimelpad" className="flex flex-wrap items-center gap-2 font-mono text-[12px] uppercase tracking-[.1em] text-muted">
              <Link href="/kennisbank" className="inline-flex items-center gap-1.5 hover:text-ink"><ArrowLeft size={13} /> Kennisbank</Link>
              <span>/</span><span>{a.category}</span>
            </nav>
          </Reveal>
          <Reveal delay={0.1}><h1 className="display mt-6 text-[clamp(40px,5.4vw,84px)]">{a.title}</h1></Reveal>
          <Reveal delay={0.2}>
            <p className="lead mt-6 max-w-[60ch]">{a.description}</p>
            <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-muted">
              <span className="font-semibold text-ink">{site.owner}</span><span>·</span>
              <time dateTime={a.date}>{formatDate(a.date)}</time><span>·</span><span>{a.minutes} min lezen</span>
            </p>
          </Reveal>
        </header>

        <div className="wrap relative grid max-w-[1100px] gap-12 pb-[clamp(80px,10vw,140px)] lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="prose-lorvex" dangerouslySetInnerHTML={{ __html: a.html }} />
          <aside className="hidden lg:block">
            <div className="sticky top-28 grid gap-4">
              {a.headings.length > 2 && (
                <nav aria-label="Inhoud" className="card p-6">
                  <p className="eyebrow mb-4">Inhoud</p>
                  <ol className="grid gap-2.5 text-[14px] leading-snug">
                    {a.headings.map((h) => <li key={h.id}><a href={`#${h.id}`} className="text-muted transition-colors hover:text-ink">{h.text}</a></li>)}
                  </ol>
                </nav>
              )}
              {service && (
                <Link href={`/diensten/${service.slug}`} className="card group block bg-night p-6 text-white">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10"><ServiceIcon name={service.icon} size={20} /></span>
                  <p className="mt-6 text-[18px] font-semibold leading-snug">{service.menu}</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-white/65">{service.short}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold">Bekijk dienst <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></span>
                </Link>
              )}
              <a href={waLink(`Hoi Robert, ik las "${a.title}" en heb een vraag.`)} className="btn-accent w-full"><MessageCircle size={17} /> Stel je vraag</a>
            </div>
          </aside>
        </div>
      </article>

      {more.length > 0 && (
        <section className="border-t border-line bg-white py-[clamp(80px,10vw,140px)]">
          <div className="wrap">
            <p className="eyebrow">Verder lezen</p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {more.map((m) => <Reveal key={m.slug}><ArticleCard a={m} /></Reveal>)}
            </div>
          </div>
        </section>
      )}
      <CtaBand />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
