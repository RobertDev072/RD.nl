import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { formatDate, type Article } from '@/lib/kennisbank';

export default function ArticleCard({ a, big = false }: { a: Article; big?: boolean }) {
  return (
    <Link href={`/kennisbank/${a.slug}`} className={'card group flex h-full flex-col p-7 transition-all duration-500 hover:-translate-y-1 hover:border-ink/30 ' + (big ? 'min-h-[340px] bg-night text-white' : 'min-h-[300px]')}>
      <div className="flex items-center justify-between gap-4">
        <span className={'rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[.1em] ' + (big ? 'bg-white/10 text-white/80' : 'bg-canvas text-muted')}>{a.category}</span>
        <span className={'grid h-10 w-10 place-items-center rounded-full border transition-all duration-500 group-hover:rotate-45 ' + (big ? 'border-white/20' : 'border-line group-hover:border-ink group-hover:bg-ink group-hover:text-white')}><ArrowUpRight size={17} /></span>
      </div>
      <h3 className={'h3 mt-auto pt-10 ' + (big ? 'text-[clamp(30px,2.8vw,44px)]' : 'text-[26px]')}>{a.title}</h3>
      <p className={'mt-3 line-clamp-3 text-[15px] leading-relaxed ' + (big ? 'text-white/65' : 'text-muted')}>{a.description}</p>
      <p className={'mt-5 font-mono text-[12px] ' + (big ? 'text-white/45' : 'text-soft')}><time dateTime={a.date}>{formatDate(a.date)}</time> · {a.minutes} min lezen</p>
    </Link>
  );
}
