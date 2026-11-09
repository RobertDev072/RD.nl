import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import ArticleCard from '@/components/ArticleCard';
import CtaBand from '@/components/CtaBand';
import { Reveal } from '@/components/Reveal';
import { getArticles } from '@/lib/kennisbank';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Kennisbank: websites, SEO en AI voor ondernemers',
  description: 'Praktische artikelen van Lorvex over website laten maken, vindbaarheid in Google en AI-automatisering voor ondernemers in Alkmaar en Noord-Holland.',
  alternates: { canonical: '/kennisbank' }
};

export default function Kennisbank() {
  const articles = getArticles();
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Lorvex Kennisbank',
    url: `${site.url}/kennisbank`,
    publisher: { '@id': `${site.url}/#organization` },
    blogPost: articles.map((a) => ({ '@type': 'BlogPosting', headline: a.title, url: `${site.url}/kennisbank/${a.slug}`, datePublished: a.date }))
  };
  return (
    <>
      <PageHero eyebrow="Kennisbank" title="Slimmer online *ondernemen*." intro="Eerlijke uitleg over websites, vindbaarheid in Google en AI-automatisering. Geschreven voor ondernemers, zonder vakjargon." />
      <section className="wrap -mt-6 grid gap-4 pb-[clamp(80px,10vw,150px)] md:grid-cols-2 lg:grid-cols-3">
        {articles.map((a, i) => (
          <Reveal key={a.slug} delay={(i % 3) * 0.08} className={i === 0 ? 'md:col-span-2' : ''}>
            <ArticleCard a={a} big={i === 0} />
          </Reveal>
        ))}
      </section>
      <CtaBand title="Liever direct een antwoord?" text="Bel of app ons met je vraag. Je krijgt snel en eerlijk antwoord, zonder verkooppraatje." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
