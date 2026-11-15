/* eslint-disable @next/next/no-img-element -- photos come from the business's own site/CDN */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, CalendarCheck, Check, Clock, MapPin, MessageCircle, Phone, Sparkles, X } from 'lucide-react';
import { rest, crmConfigured } from '@/lib/crm';
import { templateFor } from '@/lib/concept-templates';
import type { Brand } from '@/lib/brand';
import ConceptResponse from '@/components/ConceptResponse';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Voorbeeldontwerp', robots: { index: false, follow: false } };

type Concept = { name: string; category: string | null; city: string | null; address: string | null; website: string | null;
  domain: string | null; findings: { id: string; ok: boolean; title: string }[] | null; site_score: number | null; brand: Brand | null };

function readableOn(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map((v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45 ? '#111111' : '#ffffff';
}

export default async function ConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!crmConfigured() || !/^[a-z0-9-]{3,120}$/.test(slug)) notFound();
  const c = await rest<Concept | null>('rpc/concept_view', { method: 'POST', body: JSON.stringify({ p_slug: slug }) }).catch(() => null);
  if (!c) notFound();

  const t = templateFor(c.category);
  const b = c.brand;
  const primary = b?.colors?.[0] ?? t.accent;
  const second = b?.colors?.[1] ?? primary;
  const onPrimary = readableOn(primary);
  const hero = b?.images?.[0];
  const gallery = (b?.images ?? []).slice(1, 7);
  const city = c.city || 'uw regio';
  const services = b?.services?.length ? b.services.slice(0, 6) : t.features.map((f) => f.title);
  const missing = (c.findings || []).filter((f) => !f.ok).slice(0, 5);
  const phone = b?.phone;

  return (
    <div className="bg-white pt-[76px] text-[#111]">
      <div className="bg-black px-4 py-2.5 text-center text-[12.5px] text-white/90">
        <Sparkles size={13} className="mr-1.5 inline" />
        <b>Voorbeeldontwerp</b> door Lorvex voor {c.name}, gemaakt met de eigen huisstijl, foto’s en teksten van {c.domain ?? 'de huidige website'}. Geen officiële website.
      </div>

      {/* header */}
      <header className="sticky top-[76px] z-20 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-4">
          {b?.logo ? <img src={b.logo} alt={c.name} className="h-10 w-auto max-w-[180px] object-contain" />
            : <span className="text-[20px] font-semibold tracking-tight">{c.name}</span>}
          <nav className="hidden gap-7 text-[14.5px] text-black/70 md:flex"><span>Over ons</span><span>Diensten</span><span>Foto’s</span><span>Contact</span></nav>
          <span className="rounded-full px-5 py-2.5 text-[14px] font-medium" style={{ background: primary, color: onPrimary }}>{t.cta}</span>
        </div>
      </header>

      {/* hero */}
      <section className="relative isolate overflow-hidden">
        {hero && <img src={hero} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />}
        <div className="absolute inset-0 -z-10" style={{ background: hero ? `linear-gradient(100deg, ${primary}f2 0%, ${primary}b3 45%, transparent 100%)` : `linear-gradient(135deg, ${primary}, ${second})` }} />
        <div className="mx-auto max-w-[1180px] px-6 py-[clamp(72px,12vw,160px)]" style={{ color: onPrimary }}>
          <p className="text-[13px] uppercase tracking-[.18em] opacity-80">{c.category ?? 'Lokaal bedrijf'} · {city}</p>
          <h1 className="mt-4 max-w-[14ch] text-[clamp(40px,6.4vw,84px)] font-semibold leading-[0.98] tracking-[-0.035em]">{b?.title || t.heroTitle(c.name, c.city ?? '')}</h1>
          <p className="mt-6 max-w-[48ch] text-[clamp(17px,1.6vw,20px)] opacity-90">{b?.tagline || t.heroText}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-black shadow-lg"><CalendarCheck size={17} /> {t.cta}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-current/40 px-6 py-3.5 text-[15px]"><Phone size={16} /> {phone ?? 'Bel direct'}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-current/40 px-6 py-3.5 text-[15px]"><MessageCircle size={16} /> WhatsApp</span>
          </div>
        </div>
      </section>

      {/* quick facts */}
      <section className="border-b border-black/5">
        <div className="mx-auto grid max-w-[1180px] gap-6 px-6 py-8 text-[15px] sm:grid-cols-3">
          <p className="flex items-center gap-3"><Clock size={18} style={{ color: primary }} /> 24/7 online boeken</p>
          <p className="flex items-center gap-3"><MapPin size={18} style={{ color: primary }} /> {b?.address ?? c.address ?? city}</p>
          <p className="flex items-center gap-3"><Phone size={18} style={{ color: primary }} /> Bellen of appen met één tik</p>
        </div>
      </section>

      {/* about */}
      {b?.about?.length ? (
        <section className="mx-auto grid max-w-[1180px] items-center gap-12 px-6 py-24 md:grid-cols-2">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[.16em]" style={{ color: primary }}>Over {c.name}</p>
            <h2 className="mt-3 text-[clamp(30px,3.6vw,44px)] font-semibold leading-[1.05] tracking-[-0.02em]">Welkom bij {c.name}</h2>
            {b.about.slice(0, 2).map((p, i) => <p key={i} className="mt-5 text-[17px] leading-relaxed text-black/70">{p}</p>)}
          </div>
          {gallery[0] && <img src={gallery[0]} alt="" className="aspect-[4/5] w-full rounded-[28px] object-cover shadow-xl" />}
        </section>
      ) : null}

      {/* services */}
      <section style={{ background: `${primary}0d` }}>
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <p className="text-[13px] font-semibold uppercase tracking-[.16em]" style={{ color: primary }}>Diensten</p>
          <h2 className="mt-3 text-[clamp(30px,3.6vw,44px)] font-semibold tracking-[-0.02em]">Waarmee we u helpen</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s} className="group flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <span className="text-[17px] font-medium">{s}</span>
                <ArrowRight size={18} style={{ color: primary }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* gallery */}
      {gallery.length > 1 && (
        <section className="mx-auto max-w-[1180px] px-6 py-24">
          <h2 className="text-[clamp(30px,3.6vw,44px)] font-semibold tracking-[-0.02em]">Foto’s</h2>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
            {gallery.slice(gallery.length > 3 ? 1 : 0).map((src, i) => (
              <img key={src} src={src} alt="" className={`h-full w-full rounded-2xl object-cover ${i === 0 ? 'row-span-2 aspect-[3/4]' : 'aspect-square'}`} />
            ))}
          </div>
        </section>
      )}

      {/* booking CTA */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-[1180px] rounded-[32px] px-8 py-16 text-center md:px-16" style={{ background: primary, color: onPrimary }}>
          <h2 className="text-[clamp(28px,3.4vw,42px)] font-semibold tracking-[-0.02em]">{t.cta} in een paar tikken</h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-[17px] opacity-85">{t.features[0]?.text}</p>
          <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-black"><CalendarCheck size={17} /> {t.cta}</span>
        </div>
      </section>

      {/* what changes */}
      <section className="border-t border-black/10 bg-[#fafafa]">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-6 py-20 md:grid-cols-2">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[.16em] text-black/50">Van Lorvex, voor {c.name}</p>
            <h2 className="mt-3 text-[30px] font-semibold tracking-[-0.02em]">Wat dit ontwerp verbetert</h2>
            <p className="mt-3 text-[16px] text-black/60">Dezelfde huisstijl, foto’s en teksten, maar sneller, mobielvriendelijk en gemaakt om klanten op te leveren.
              {typeof c.site_score === 'number' && <> Huidige website-score: <b>{c.site_score}/100</b>.</>}</p>
            <ul className="mt-6 grid gap-2.5">
              {missing.map((f) => <li key={f.id} className="flex items-start gap-2.5 text-[15.5px]"><X size={17} className="mt-0.5 shrink-0 text-[#c2410c]" /> Nu ontbreekt: {f.title}</li>)}
              {t.features.map((f) => <li key={f.title} className="flex items-start gap-2.5 text-[15.5px]"><Check size={17} className="mt-0.5 shrink-0 text-[#15803d]" /> {f.title}</li>)}
            </ul>
          </div>
          <ConceptResponse slug={slug} name={c.name} />
        </div>
      </section>
    </div>
  );
}
