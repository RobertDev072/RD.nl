'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, Phone, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { services } from '@/lib/content';
import { site } from '@/lib/site';
import { ServiceIcon } from './icons';
import { LogoCompact } from './Logo';

const links = [
  { href: '/prijscheck', label: 'Prijscheck' },
  { href: '/projecten', label: 'Projecten' },
  { href: '/automatisering', label: 'Automatisering' },
  { href: '/kennisbank', label: 'Kennisbank' },
  { href: '/over', label: 'Over' },
  { href: '/contact', label: 'Contact' }
];

const ease = [0.2, 0.7, 0.2, 1] as const;

export default function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const last = useRef(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useMotionValueEvent(scrollY, 'change', (y) => {
    setSolid(y > 24);
    setHidden(y > 420 && y > last.current && !mega && !mobile);
    last.current = y;
  });

  useEffect(() => { setMega(false); setMobile(false); }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMega(false); setMobile(false); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => { document.documentElement.style.overflow = mobile ? 'hidden' : ''; }, [mobile]);

  const openMega = () => { clearTimeout(closeTimer.current); setMega(true); };
  const closeMega = () => { closeTimer.current = setTimeout(() => setMega(false), 120); };

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.5, ease }}
        className="fixed inset-x-0 top-0 z-50"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        onMouseLeave={closeMega}
      >
        <div className={'absolute inset-0 -z-10 transition-all duration-500 ' + (solid || mega ? 'border-b border-line/80 bg-white/80 backdrop-blur-xl' : 'bg-transparent')} />
        <div className="wrap flex h-[76px] items-center gap-8">
          <Link href="/" className="flex shrink-0 items-center text-ink" aria-label="Lorvex, naar de homepage">
            <LogoCompact className="h-[22px] w-auto sm:h-[24px]" />
          </Link>

          <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Hoofdmenu">
            <button
              type="button"
              onMouseEnter={openMega}
              onFocus={openMega}
              onClick={() => setMega((v) => !v)}
              aria-expanded={mega}
              aria-controls="mega"
              className={'flex items-center gap-1.5 rounded-full px-4 py-2 text-[14.5px] font-medium transition-colors ' + (mega || pathname.startsWith('/diensten') ? 'bg-ink/[.05] text-ink' : 'text-ink/75 hover:text-ink')}
            >
              Diensten <ChevronDown size={15} className={'transition-transform duration-300 ' + (mega ? 'rotate-180' : '')} />
            </button>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onMouseEnter={closeMega}
                className={'relative rounded-full px-4 py-2 text-[14.5px] font-medium transition-colors ' + (pathname.startsWith(l.href) ? 'text-ink' : 'text-ink/75 hover:text-ink')}
              >
                {l.label}
                {pathname.startsWith(l.href) && <motion.span layoutId="navdot" className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <a href={site.phoneHref} className="hidden items-center gap-2 whitespace-nowrap text-[14px] font-medium text-ink/75 hover:text-ink 2xl:flex">
              <Phone size={15} /> {site.phone}
            </a>
            <Link href="/contact" className="btn-primary hidden min-h-[44px] px-5 text-[14px] sm:inline-flex">
              Plan een gesprek <ArrowRight size={16} />
            </Link>
            <button type="button" onClick={() => setMobile(true)} className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white lg:hidden" aria-label="Menu openen">
              <Menu size={20} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mega && (
            <motion.div
              id="mega"
              onMouseEnter={openMega}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease }}
              className="absolute inset-x-0 top-full hidden border-b border-line bg-white/95 shadow-[0_40px_80px_-40px_rgba(10,10,10,.35)] backdrop-blur-xl lg:block"
            >
              <div className="wrap grid grid-cols-[1fr_360px] gap-10 py-10">
                <div>
                  <p className="eyebrow mb-5">Diensten</p>
                  <ul className="grid grid-cols-2 gap-2 xl:grid-cols-3">
                    {services.map((s, i) => (
                      <motion.li key={s.slug} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i, duration: 0.4, ease }}>
                        <Link href={`/diensten/${s.slug}`} className="group flex gap-4 rounded-2xl p-4 transition-colors hover:bg-canvas">
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-50 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                            <ServiceIcon name={s.icon} size={20} />
                          </span>
                          <span>
                            <span className="flex items-center gap-1.5 text-[15px] font-semibold">{s.menu}<ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" /></span>
                            <span className="mt-1 block text-[13.5px] leading-snug text-muted">{s.short}</span>
                          </span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <Link href="/automatisering" className="group relative flex flex-col justify-end overflow-hidden rounded-3xl bg-night p-7 text-white">
                  <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/[.12] blur-3xl transition-transform duration-700 group-hover:scale-125" />
                  <span className="eyebrow relative text-white/60">Nieuw</span>
                  <span className="h3 relative mt-3 text-[30px]">Mis nooit meer een <span className="script text-[1.25em] text-white/70">klant</span></span>
                  <span className="relative mt-3 text-[14px] leading-relaxed text-white/70">Zie hoe een AI-agent je WhatsApp beantwoordt en afspraken in je agenda zet.</span>
                  <span className="relative mt-6 inline-flex items-center gap-2 text-[14px] font-semibold">Bekijk de demo <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AnimatePresence>
        {mobile && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-white lg:hidden"
            initial={{ clipPath: 'circle(0% at calc(100% - 44px) 38px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 44px) 38px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 44px) 38px)' }}
            transition={{ duration: 0.6, ease }}
            style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            <div className="wrap flex h-[76px] items-center justify-between">
              <Link href="/" className="text-ink" aria-label="Lorvex, naar de homepage"><LogoCompact className="h-[22px] w-auto" /></Link>
              <button type="button" onClick={() => setMobile(false)} className="grid h-11 w-11 place-items-center rounded-full border border-line" aria-label="Menu sluiten"><X size={20} /></button>
            </div>
            <nav className="wrap flex-1 overflow-y-auto pb-8 pt-4" aria-label="Mobiel menu">
              <p className="eyebrow mb-3">Diensten</p>
              <ul className="mb-8 grid gap-1">
                {services.map((s, i) => (
                  <motion.li key={s.slug} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.04, ease }}>
                    <Link href={`/diensten/${s.slug}`} className="flex items-center gap-3 rounded-xl py-2.5">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-50 text-accent"><ServiceIcon name={s.icon} size={17} /></span>
                      <span className="text-[17px] font-medium">{s.menu}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <ul className="grid gap-1 border-t border-line pt-6">
                {[{ href: '/', label: 'Home' }, ...links].map((l, i) => (
                  <motion.li key={l.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.05, ease }}>
                    <Link href={l.href} className="h3 block py-1.5 text-[38px]">{l.label}</Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="wrap grid gap-3 border-t border-line py-5">
              <a href={site.whatsapp} className="btn-accent w-full">App me via WhatsApp</a>
              <a href={site.phoneHref} className="btn-ghost w-full"><Phone size={16} /> {site.phone}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
