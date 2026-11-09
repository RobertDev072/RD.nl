import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import ProjectCard from '@/components/ProjectCard';
import CtaBand from '@/components/CtaBand';
import { Reveal } from '@/components/Reveal';
import { projects } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Projecten: websites, web apps en SaaS',
  description: 'Een selectie uit 100+ projecten van R DEV: websites, web apps en SaaS-platformen voor ondernemers in Alkmaar en daarbuiten.',
  alternates: { canonical: '/projecten' }
};

export default function Projecten() {
  return (
    <>
      <PageHero eyebrow="Projecten" title="Een selectie uit *100+* projecten." intro="Websites, web apps en SaaS die live staan en elke dag werken voor hun eigenaar." />
      <section className="wrap -mt-8 grid gap-x-10 gap-y-20 pb-[clamp(80px,10vw,150px)] md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 0.12} className={i % 2 ? 'md:mt-24' : ''}>
            <ProjectCard p={p} />
          </Reveal>
        ))}
      </section>
      <CtaBand title="Jouw project hier?" />
    </>
  );
}
