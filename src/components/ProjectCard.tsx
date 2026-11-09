import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/lib/content';
import { BrowserFrame, ScreenCard } from './Frames';
import TiltCard from './TiltCard';

export default function ProjectCard({ p }: { p: Project }) {
  return (
    <TiltCard max={5}>
      <Link href={`/projecten/${p.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-[30px] p-[clamp(18px,3vw,40px)] pb-0 ring-1 ring-inset ring-black/[.06]" style={{ background: `radial-gradient(120% 90% at 85% 0%, ${p.accent}30, transparent 60%), linear-gradient(180deg,#fff,#eef2f8)` }}>
          <div className="transition-transform duration-700 group-hover:-translate-y-2">
            <BrowserFrame src={p.desktop} alt={`${p.name} op desktop`} url={p.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')} className="rounded-b-none" />
          </div>
          <div className="absolute bottom-[-8%] right-[6%] w-[20%] min-w-[84px] transition-transform duration-700 group-hover:-translate-y-5 group-hover:rotate-[-3deg]">
            <ScreenCard src={p.mobile} alt={`${p.name} op mobiel`} />
          </div>
        </div>
        <div className="mt-5 flex items-start justify-between gap-5">
          <div>
            <p className="eyebrow">{p.type} · {p.sector}</p>
            <h3 className="h3 mt-2 text-[clamp(24px,2.2vw,34px)]">{p.name}</h3>
          </div>
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line bg-white transition-all duration-500 group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-white"><ArrowUpRight size={20} /></span>
        </div>
      </Link>
    </TiltCard>
  );
}
