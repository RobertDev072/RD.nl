import type { Metadata } from 'next';
import { ExternalLink, MessageCircle, Phone } from 'lucide-react';
import { crmConfigured } from '@/lib/crm';
import { getCallList, getInbound, getOpportunities, getRanking, getStats, waNumber, whatsappReply, type Lead } from '@/lib/admin-data';
import { site } from '@/lib/site';
import { latestGscReport } from '@/lib/gsc-agent';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Lorvex admin', robots: { index: false, follow: false } };

const fmt = (d: string | null) => (d ? new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }) : '');

function StatusButtons({ id, actions }: { id: string; actions: [string, string][] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map(([action, label]) => (
        <form key={action} action="/api/admin/lead" method="post">
          <input type="hidden" name="id" value={id} /><input type="hidden" name="action" value={action} />
          <button className="rounded-full border border-line px-3 py-1.5 text-[13px] hover:border-ink">{label}</button>
        </form>
      ))}
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-[24px] font-semibold">{title}</h2>
      <p className="mt-1 text-[14px] text-muted">{hint}</p>
      <div className="mt-5 grid gap-4">{children}</div>
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-2xl border border-dashed border-line p-6 text-[15px] text-muted">{text}</p>;
}

export default async function Admin() {
  if (!crmConfigured()) return <main className="wrap pt-32">CRM niet geconfigureerd.</main>;
  const [stats, inbound, opps, calls, ranking] = await Promise.all([getStats(), getInbound(), getOpportunities(), getCallList(), getRanking()]);
  const gsc = await latestGscReport().catch(() => null);

  return (
    <main className="wrap max-w-[1100px] pb-24 pt-[120px]">
      <h1 className="text-[40px] font-semibold tracking-[-0.03em]">Lorvex admin</h1>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {([['Ontdekt', stats.discovered], ['Geverifieerd actief', stats.verified], ['Kansen', stats.qualified], ['Reacties', stats.responded], ['Klanten', stats.won]] as const).map(([l, n]) => (
          <div key={l} className="rounded-2xl bg-canvas p-4"><p className="text-[13px] text-muted">{l}</p><p className="text-[28px] font-semibold tabular-nums">{n}</p></div>
        ))}
      </div>


      <Section title="Ranking: bedrijven om te benaderen" hint="Kansscore 0–100: hoe groter de kans dat dit bedrijf een nieuwe website nodig heeft. Klik voor de volledige analyse en de kant-en-klare tekst.">
        {ranking.length === 0 ? <Empty text="Nog geen geverifieerde bedrijven." /> : (
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full text-left text-[14.5px]">
              <thead className="bg-canvas text-[12.5px] uppercase tracking-[.08em] text-muted">
                <tr><th className="p-3">#</th><th className="p-3">Score</th><th className="p-3">Bedrijf</th><th className="p-3">Plaats</th><th className="p-3">Website</th><th className="p-3">Grootste problemen</th><th className="p-3">Status</th></tr>
              </thead>
              <tbody>
                {ranking.map((l, i) => {
                  const s = Number(l.score ?? 0);
                  const c = s >= 80 ? '#15803d' : s >= 60 ? '#65a30d' : s >= 40 ? '#ca8a04' : '#9ca3af';
                  const isNew = l.qualified_at && Date.now() - new Date(l.qualified_at).getTime() < 86_400_000;
                  return (
                    <tr key={l.id} className="border-t border-line hover:bg-canvas">
                      <td className="p-3 text-muted">{i + 1}</td>
                      <td className="p-3"><span className="inline-block min-w-[44px] rounded-full px-2.5 py-1 text-center font-semibold text-white" style={{ background: c }}>{s}</span></td>
                      <td className="p-3"><a href={`/admin/lead/${l.id}`} className="font-semibold underline-offset-2 hover:underline">{l.business_name}</a>{isNew && <span className="ml-2 rounded bg-[#dcfce7] px-1.5 py-0.5 text-[11px] font-semibold text-[#15803d]">NIEUW</span>}<p className="text-[12.5px] text-muted">{l.category}</p></td>
                      <td className="p-3">{l.city ?? '–'}</td>
                      <td className="p-3">{l.audit?.score ?? '–'}/100</td>
                      <td className="p-3 text-[13px] text-muted">{(l.audit?.findings ?? []).filter((f) => !f.ok).slice(0, 2).map((f) => f.title).join(' · ') || '–'}</td>
                      <td className="p-3 text-[13px]">{l.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title="1. Reacties en aanvragen" hint="Deze mensen vroegen zelf om contact (formulier, website-check of voorbeeldpagina). WhatsApp is hier toegestaan.">
        {inbound.length === 0 ? <Empty text="Nog geen aanvragen." /> : inbound.map((l) => <InboundCard key={l.id} l={l} />)}
      </Section>

      <Section title="2. Kansen (door de agents gevonden)" hint="Geverifieerde bedrijven met de hoogste score. Contact alleen telefonisch, en alleen bij B.V./N.V.">
        {opps.length === 0 ? <Empty text="Nog geen kansen. De lead engine draait elke ochtend." /> : opps.map((l) => <OppCard key={l.id} l={l} />)}
      </Section>

      <Section title="3. Bellijst (alleen B.V./N.V.)" hint="Rechtspersonen mogen gebeld worden. Script: stel je voor, noem 1 concreet verbeterpunt van hun site, bied het gratis voorbeeld aan. Wil iemand niet gebeld worden? Klik 'Niet meer benaderen'.">
        {calls.length === 0 ? <Empty text="Nog geen B.V./N.V. met telefoonnummer gevonden." /> : calls.map((l) => (
          <div key={l.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
            <div><p className="font-semibold">{l.business_name}</p><p className="text-[14px] text-muted">{l.category} · {l.city} · score {l.score ?? '–'}</p>
              {l.score_reasons && <p className="mt-1 text-[13px] text-muted">Verbeterpunten: {l.score_reasons.slice(0, 3).join(', ')}</p>}</div>
            <div className="flex flex-wrap items-center gap-2">
              <a href={`tel:${l.business_phone}`} className="btn-accent"><Phone size={16} /> {l.business_phone}</a>
              <StatusButtons id={l.id} actions={[['contacted', 'Gebeld'], ['lost', 'Niet meer benaderen']]} />
            </div>
          </div>
        ))}
      </Section>

      <Section title="SEO: Google Search Console" hint="Wekelijks rapport van de Search Console-agent (maandag). Alleen echte data uit Google.">
        {!gsc ? <Empty text="Nog geen rapport." /> : (
          <div className="card p-5">
            <p className="text-[13px] text-muted">Laatste 28 dagen · {new Date(gsc.at).toLocaleDateString('nl-NL')}</p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {([['Kliks', gsc.totals.clicks], ['Vertoningen', gsc.totals.impressions], ['CTR', `${gsc.totals.ctr}%`], ['Gem. positie', gsc.totals.position]] as const).map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-canvas p-3"><p className="text-[12px] text-muted">{k}</p><p className="text-[22px] font-semibold">{v}</p></div>))}
            </div>
            <p className="mt-5 font-semibold">Acties</p>
            <ul className="mt-2 grid gap-2 text-[14.5px]">{gsc.actions.length === 0 ? <li className="text-muted">Geen acties deze week.</li> : gsc.actions.map((a, i) => (
              <li key={i} className="rounded-xl border border-line p-3"><b>{a.target}</b> <span className="text-muted">· {a.why}</span><br />{a.todo}</li>))}</ul>
            <p className="mt-5 font-semibold">Zoekopdrachten</p>
            <table className="mt-2 w-full text-[14px]"><tbody>{gsc.top_queries.map((q) => (
              <tr key={q.query} className="border-t border-line"><td className="py-1.5">{q.query}</td><td className="text-right">{q.clicks} kliks</td><td className="text-right">{q.impressions} vert.</td><td className="text-right">pos. {q.position}</td></tr>))}</tbody></table>
          </div>
        )}
      </Section>
      <p className="mt-16 text-[13px] text-muted">Alleen zichtbaar voor Robert. {site.url}</p>
    </main>
  );
}

function InboundCard({ l }: { l: Lead }) {
  const wa = waNumber(l.contact_phone);
  return (
    <div className="card grid gap-3 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[18px] font-semibold">{l.contact_name} {l.business_name ? <span className="font-normal text-muted">· {l.business_name}</span> : null}</p>
          <p className="text-[14px] text-muted">{fmt(l.created_at)} · via {l.source === 'contact_form' ? 'contactformulier' : l.source === 'website_check' ? 'website-check' : 'voorbeeldpagina'} · status: {l.status}</p>
        </div>
        {typeof l.score === 'number' && <span className="rounded-full bg-canvas px-3 py-1 text-[13px]">site-score {l.audit?.score ?? l.score}</span>}
      </div>
      <p className="text-[15px]">{l.contact_email}{l.contact_phone ? ` · ${l.contact_phone}` : ''}{l.website ? ` · ${l.domain}` : ''}</p>
      {l.message && <p className="rounded-xl bg-canvas p-3 text-[15px]">{l.message}</p>}
      <div className="flex flex-wrap items-center gap-2">
        {wa && <a href={`https://wa.me/${wa}?text=${encodeURIComponent(whatsappReply(l))}`} target="_blank" rel="noopener" className="btn-accent"><MessageCircle size={16} /> WhatsApp (bericht klaar)</a>}
        <a href={`mailto:${l.contact_email}?subject=${encodeURIComponent('Je aanvraag bij Lorvex')}&body=${encodeURIComponent(whatsappReply(l))}`} className="rounded-full border border-line px-4 py-2 text-[14px]">E-mail (klaar)</a>
        <StatusButtons id={l.id} actions={[['contacted', 'Gecontacteerd'], ['proposal', 'Offerte gestuurd'], ['won', 'Klant!'], ['lost', 'Afgevallen']]} />
      </div>
    </div>
  );
}

function OppCard({ l }: { l: Lead }) {
  const missing = (l.audit?.findings || []).filter((f) => !f.ok).map((f) => f.title);
  return (
    <div className="card grid gap-3 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[18px] font-semibold">{l.business_name}</p>
          <p className="text-[14px] text-muted">{l.category} · {[l.address, l.postcode, l.city].filter(Boolean).join(', ')}{l.legal_form ? ' · B.V./N.V.' : ''}</p>
        </div>
        <span className="rounded-full bg-ink px-3 py-1 text-[13px] text-white">kans {l.score}/100</span>
      </div>
      <p className="text-[14px]">Website: <a href={l.website ?? '#'} target="_blank" rel="noopener" className="underline">{l.domain}</a> · site-score {l.audit?.score ?? '–'}/100</p>
      {missing.length > 0 && <p className="text-[14px] text-muted">Problemen: {missing.join(' · ')}</p>}
      {l.score_reasons && <p className="text-[13px] text-muted">Waarom deze kans: {l.score_reasons.join(' · ')}</p>}
      <div className="flex flex-wrap items-center gap-2">
        {l.slug && <a href={`/voor/${l.slug}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1 rounded-full border border-line px-4 py-2 text-[14px]"><ExternalLink size={14} /> Voorbeeldontwerp ({l.concept_views}× bekeken)</a>}
        {l.letter_delivered_at ? <span className="text-[13px] text-muted">Brief bezorgd op {fmt(l.letter_delivered_at)}</span>
          : <StatusButtons id={l.id} actions={[['letter_delivered', 'Brief bezorgd'], ['lost', 'Afvallen']]} />}
      </div>
    </div>
  );
}
