import type { ReactNode } from 'react';
import { SplitHeading, Reveal } from './Reveal';

export default function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pt-[76px]">
      <div aria-hidden className="absolute inset-0 bg-grid" />
      <div aria-hidden className="absolute -top-40 right-[-10%] h-[70vh] w-[70vh] rounded-full bg-haze/50 blur-[130px]" />
      <div className="wrap relative pb-[clamp(56px,8vw,120px)] pt-[clamp(64px,10vw,150px)]">
        <Reveal><p className="eyebrow">{eyebrow}</p></Reveal>
        <SplitHeading as="h1" text={title} className="display mt-6 max-w-[18ch] text-[clamp(48px,7vw,124px)]" />
        {intro && <Reveal delay={0.3}><p className="lead mt-8 max-w-[58ch]">{intro}</p></Reveal>}
        {children && <Reveal delay={0.45} className="mt-10">{children}</Reveal>}
      </div>
    </section>
  );
}
