import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { services } from '@/lib/content';
import { ServiceIcon } from '../icons';
import TiltCard from '../TiltCard';
import { Reveal, SplitHeading } from '../Reveal';

export default function ServicesGrid({ heading = true }: { heading?: boolean }) {
  return (
    <section className="wrap py-[clamp(96px,12vw,180px)]" aria-labelledby={heading ? 'diensten-title' : undefined}>
      {heading && (
        <div className="mb-14 flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="eyebrow">Diensten</p>
            <SplitHeading text="Alles wat je online nodig *hebt*." className="h2 mt-4 max-w-[16ch]" />
          </div>
          <Reveal><p className="lead max-w-[42ch]">Eén aanspreekpunt voor ontwerp, bouw, techniek en vindbaarheid. Van domein tot mailbox geregeld.</p></Reveal>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {services.map((s, i) => {
          const big = i < 2;
          const dark = s.slug.startsWith('ai-');
          const last = i === services.length - 1;
          return (
            <Reveal key={s.slug} delay={(i % 3) * 0.08} className={big ? 'lg:col-span-3' : last ? 'lg:col-span-6' : 'lg:col-span-2'}>
              <TiltCard max={big ? 6 : 9}>
                <Link href={`/diensten/${s.slug}`} className={'card group/card relative flex h-full [transform-style:preserve-3d] flex-col overflow-hidden p-7 transition-colors duration-500 hover:border-accent/40 ' + (big ? 'min-h-[340px]' : 'min-h-[280px]') + (dark ? ' bg-night text-white' : '')}>
                  {dark && <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/[.12] blur-3xl" />}
                  <div className="relative flex items-start justify-between" style={{ transform: 'translateZ(40px)' }}>
                    <span className={'grid h-14 w-14 place-items-center rounded-2xl transition-all duration-500 group-hover/card:scale-110 ' + (dark ? 'bg-white/10 text-white' : 'bg-accent-50 text-accent group-hover/card:bg-accent group-hover/card:text-white')}>
                      <ServiceIcon name={s.icon} size={24} />
                    </span>
                    <span className={'grid h-11 w-11 place-items-center rounded-full border transition-all duration-500 group-hover/card:rotate-45 ' + (dark ? 'border-white/20' : 'border-line group-hover/card:border-ink group-hover/card:bg-ink group-hover/card:text-white')}>
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                  <div className="relative mt-auto pt-10" style={{ transform: 'translateZ(30px)' }}>
                    <h3 className={'h3 ' + (big ? 'text-[clamp(30px,2.6vw,44px)]' : 'text-[28px]')}>{s.title}</h3>
                    <p className={'mt-3 max-w-[44ch] text-[15.5px] leading-relaxed ' + (dark ? 'text-white/70' : 'text-muted')}>{s.short}</p>
                    {(big || last) && (
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {s.includes.slice(0, 4).map((x) => <li key={x} className={'rounded-full px-3 py-1 text-[12.5px] ' + (dark ? 'bg-white/10' : 'bg-canvas text-muted')}>{x}</li>)}
                      </ul>
                    )}
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
