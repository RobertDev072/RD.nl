import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, ExternalLink, Phone, X } from 'lucide-react';
import { getActivities, getLead, pitchMessage } from '@/lib/admin-data';
import CopyButton from '@/components/CopyButton';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Lead | Lorvex admin', robots: { index: false, follow: false } };

const band = (s: number) => (s >= 80 ? ['Zeer hoog', '#15803d'] : s >= 60 ? ['Hoog', '#65a30d'] : s >= 40 ? ['Gemiddeld', '#ca8a04'] : ['Laag', '#9ca3af']);

function Action({ id, action, label, tone }: { id: string; action: string; label: string; tone?: string }) {
  return (
    <form action="/api/admin/lead" method="post">
      <input type="hidden" name="id" value={id} /><input type="hidden" name="action" value={action} />
      <input type="hidden" name="back" value={`/admin/lead/${id}`} />
      <button className="rounded-full px-5 py-2.5 text-[14px] font-medium" style={{ background: tone ?? '#f3f4f6', color: tone ? '#fff' : '#111' }}>{label}</button>
    </form>
  );
}

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const l = await getLead(id);
  if (!l) notFound();
  const acts = await getActivities(id).catch(() => []);
  const score = Number(l.score ?? 0);
  const [label, color] = band(score);
  const a = l.audit;
  const findings = [...(a?.findings ?? [])].sort((x, y) => Number(x.ok) - Number(y.ok) || y.weight - x.weight);
  const msg = pitchMessage(l);

  return (
    <main className="wrap max-w-[1000px] pb-24 pt-28">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-[14px] text-muted"><ArrowLeft size={15} /> Terug naar ranking</Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-[13px] uppercase tracking-[.14em] text-muted">{l.category} · {l.city ?? 'onbekende plaats'}</p>
          <h1 className="mt-1 text-[36px] font-semibold tracking-tight">{l.business_name}</h1>
          <p className="mt-1 text-[15px] text-muted">{[l.address, l.postcode, l.city].filter(Boolean).join(', ') || 'Adres onbekend'}</p>
          {l.website && <a href={l.website} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-[15px] underline">{l.domain} <ExternalLink size={14} /></a>}
        </div>
        <div className="rounded-3xl border border-line p-5 text-center">
          <p className="text-[12px] uppercase tracking-[.14em] text-muted">Kansscore</p>
          <p className="text-[48px] font-semibold leading-none" style={{ color }}>{score}</p>
          <p className="mt-1 text-[13px] font-medium" style={{ color }}>{label}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Action id={l.id} action="interested" label="✓ Geïnteresseerd" tone="#15803d" />
        <Action id={l.id} action="contacted" label="Gebeld / brief gestuurd" />
        <Action id={l.id} action="not_interested" label="✗ Geen interesse" tone="#b91c1c" />
        <span className="self-center text-[13px] text-muted">Status: <b>{l.status}</b></span>
      </div>

      <section className="card mt-8 p-6">
        <h2 className="text-[22px] font-semibold">Website-analyse</h2>
        <div className="mt-4 grid gap-3 text-[14px] sm:grid-cols-4">
          <div><p className="text-muted">Website-score</p><p className="text-[22px] font-semibold">{a?.score ?? '–'}/100</p></div>
          <div><p className="text-muted">Laadtijd</p><p className="text-[22px] font-semibold">{a?.loadMs ? `${(a.loadMs / 1000).toFixed(1)} s` : '–'}</p></div>
          <div><p className="text-muted">Paginagrootte</p><p className="text-[22px] font-semibold">{a?.pageKb ? `${a.pageKb} KB` : '–'}</p></div>
          <div><p className="text-muted">Gemaakt met</p><p className="text-[22px] font-semibold">{a?.platform ?? '–'}</p></div>
        </div>
        <ul className="mt-6 grid gap-3">
          {findings.map((f) => (
            <li key={f.id} className="flex gap-3 rounded-2xl p-4" style={{ background: f.ok ? '#f0fdf4' : '#fef2f2' }}>
              {f.ok ? <Check size={20} className="mt-0.5 shrink-0 text-[#15803d]" /> : <X size={20} className="mt-0.5 shrink-0 text-[#b91c1c]" />}
              <div><p className="font-semibold">{f.title}</p><p className="mt-0.5 text-[14.5px] text-muted">{f.detail}</p></div>
            </li>
          ))}
        </ul>
      </section>

      <section className="card mt-6 p-6">
        <h2 className="text-[22px] font-semibold">Waarom deze score</h2>
        <ul className="mt-3 grid gap-1.5 text-[15px]">{(l.score_reasons ?? []).map((r) => <li key={r}>• {r}</li>)}</ul>
        <p className="mt-4 text-[13px] text-muted">Geverifieerd {l.verified_at ? new Date(l.verified_at).toLocaleString('nl-NL') : ''} · bron: OpenStreetMap + eigen website ({a?.finalUrl ?? l.website})</p>
      </section>

      <section className="card mt-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[22px] font-semibold">Tekst voor telefoon of brief</h2>
          <CopyButton text={msg} />
        </div>
        <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-[#f7f7f5] p-5 font-sans text-[15px] leading-relaxed">{msg}</pre>
        <p className="mt-3 text-[13px] text-muted">
          {l.business_phone ? <><Phone size={13} className="inline" /> Bellen: <b>{l.business_phone}</b> (B.V./N.V.). </> : 'Geen telefoonnummer opgeslagen (geen B.V./N.V.): gebruik een brief. '}
          E-mail of WhatsApp alleen naar wie zelf om contact heeft gevraagd.
        </p>
      </section>

      {l.slug && (
        <section className="card mt-6 p-6">
          <h2 className="text-[22px] font-semibold">Voorbeeldontwerp</h2>
          <p className="mt-1 text-[14px] text-muted">Alleen delen met geïnteresseerden. Gemaakt zonder AI-kosten met hun eigen logo, kleuren, foto’s en teksten.</p>
          <a href={`/voor/${l.slug}`} target="_blank" className="mt-3 inline-flex items-center gap-1.5 text-[15px] underline">lorvex.nl/voor/{l.slug} <ExternalLink size={14} /></a>
        </section>
      )}

      <section className="mt-6">
        <h2 className="text-[18px] font-semibold">Geschiedenis</h2>
        <ul className="mt-2 grid gap-1 text-[14px] text-muted">
          {acts.map((x, i) => <li key={i}>{new Date(x.created_at).toLocaleString('nl-NL')} · {x.actor} · {x.type}{x.data?.note ? ` · ${x.data.note}` : ''}</li>)}
        </ul>
      </section>
    </main>
  );
}
