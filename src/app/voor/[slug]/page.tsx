import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Check, MessageCircle, Phone, X } from 'lucide-react';
import { rest, crmConfigured } from '@/lib/crm';
import { templateFor } from '@/lib/concept-templates';
import ConceptResponse from '@/components/ConceptResponse';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Voorbeeldontwerp', robots: { index: false, follow: false } };

type Concept = { name: string; category: string | null; city: string | null; website: string | null; domain: string | null;
  findings: { id: string; ok: boolean; title: string }[] | null; site_score: number | null };

export default async function ConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!crmConfigured() || !/^[a-z0-9-]{3,120}$/.test(slug)) notFound();
  const c = await rest<Concept | null>('rpc/concept_view', { method: 'POST', body: JSON.stringify({ p_slug: slug }) }).catch(() => null);
  if (!c) notFound();
  const t = templateFor(c.category);
  const city = c.city || 'uw regio';
  const missing = (c.findings || []).filter((f) => !f.ok).slice(0, 4);

  return (
    <div className="pt-[76px]">
      <div className="bg-ink px-4 py-3 text-center text-[13px] text-white">
        Dit is een <b>voorbeeldontwerp</b> dat Lorvex heeft gemaakt voor {c.name}. Het is geen officiële website van {c.name}.
      </div>

      <section style={{ background: t.accent }} className="px-6 py-[clamp(56px,9vw,120px)] text-white">
        <div className="mx-auto max-w-[1000px]">
          <p className="text-[13px] uppercase tracking-[.14em] opacity-80">{c.category ?? 'Lokaal bedrijf'} · {city}</p>
          <h1 className="mt-4 text-[clamp(36px,6vw,72px)] font-semibold leading-[1.02] tracking-[-0.03em]">{t.heroTitle(c.name, c.city ?? '')}</h1>
          <p className="mt-5 max-w-[46ch] text-[19px] opacity-90">{t.heroText}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-white px-6 py-3 text-[15px] font-medium" style={{ color: t.accent }}>{t.cta}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-[15px]"><Phone size={16} /> Bel direct</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-[15px]"><MessageCircle size={16} /> WhatsApp</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1000px] gap-5 px-6 py-16 sm:grid-cols-3">
        {t.features.map((f) => (
          <div key={f.title} className="card p-6">
            <span className="grid h-10 w-10 place-items-center rounded-xl text-white" style={{ background: t.accent }}><Check size={18} /></span>
            <p className="mt-4 text-[18px] font-semibold">{f.title}</p>
            <p className="mt-2 text-[15px] text-muted">{f.text}</p>
          </div>
        ))}
      </section>

      {missing.length > 0 && (
        <section className="mx-auto max-w-[1000px] px-6 pb-16">
          <div className="card p-6">
            <p className="text-[20px] font-semibold">Wat dit ontwerp oplost op {c.domain ?? 'uw huidige website'}</p>
            {typeof c.site_score === 'number' && <p className="mt-1 text-[14px] text-muted">Huidige website-score: {c.site_score}/100 (gratis website-check van Lorvex)</p>}
            <ul className="mt-4 grid gap-2">
              {missing.map((f) => <li key={f.id} className="flex items-center gap-2 text-[15px]"><X size={16} className="text-[#c2410c]" /> {f.title}</li>)}
            </ul>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1000px] px-6 pb-24">
        <ConceptResponse slug={slug} name={c.name} />
      </section>
    </div>
  );
}
