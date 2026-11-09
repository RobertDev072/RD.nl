import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MessageCircle, Phone } from 'lucide-react';
import { projects, services } from '@/lib/content';
import { site } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-900 text-white">
      <div aria-hidden className="absolute -top-40 left-1/2 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-blue/30 blur-[120px]" />
      <div className="wrap relative pt-24">
        <div className="flex flex-wrap items-end justify-between gap-10 border-b border-white/10 pb-16">
          <h2 className="h2 max-w-[14ch] text-white">
            Bel me wanneer je me <span className="script text-[1.15em] text-[#8fb0ff]">nodig</span> hebt.
          </h2>
          <div className="flex flex-wrap gap-3">
            <a href={site.whatsapp} className="btn-blue"><MessageCircle size={18} /> App me direct</a>
            <a href={site.phoneHref} className="btn border border-white/15 bg-white/5 text-white hover:bg-white/10"><Phone size={16} /> {site.phone}</a>
          </div>
        </div>

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/img/logo-white.png" alt="R DEV" width={30} height={38} />
              <span className="text-[17px] font-semibold">R DEV</span>
            </Link>
            <p className="mt-5 text-[15px] leading-relaxed text-white/60">
              Webdesign en development uit {site.city}. Websites, web apps, SaaS, apps en AI-automatisering. Geen contracten, geen vaste kosten, één directe lijn.
            </p>
          </div>
          <FooterCol title="Diensten" items={services.map((s) => ({ href: `/diensten/${s.slug}`, label: s.menu }))} />
          <FooterCol title="Projecten" items={projects.map((p) => ({ href: `/projecten/${p.slug}`, label: p.name }))} />
          <FooterCol
            title="R DEV"
            items={[
              { href: '/automatisering', label: 'AI-automatisering demo' },
              { href: '/over', label: 'Over Robert' },
              { href: '/contact', label: 'Contact' },
              { href: '/diensten', label: 'Alle diensten' }
            ]}
          />
        </div>

        <div className="border-t border-white/10 py-8 text-[13px] text-white/50">
          <p className="mb-4">Website laten maken in {site.areas.join(', ')} en heel {site.region}.</p>
          <div className="flex flex-wrap justify-between gap-4">
            <span>© {new Date().getFullYear()} R DEV · {site.owner} · {site.city}</span>
            <span>Werk vanaf €100 · Geen contracten · Geen vaste kosten</span>
          </div>
        </div>
      </div>
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="wrap -mb-[0.22em] whitespace-nowrap text-[22vw] font-bold leading-none tracking-[-0.06em] text-white/[.04]" style={{ fontStretch: '125%' }}>R DEV</p>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="eyebrow mb-5 text-white/40">{title}</p>
      <ul className="grid gap-3">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="group inline-flex items-center gap-1 text-[15px] text-white/80 transition-colors hover:text-white">
              {i.label}<ArrowUpRight size={13} className="opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
