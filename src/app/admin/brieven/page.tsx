import type { Metadata } from 'next';
import QRCode from 'qrcode';
import { crmConfigured } from '@/lib/crm';
import { getLettersToDeliver } from '@/lib/admin-data';
import { legal } from '@/lib/legal';
import { site } from '@/lib/site';
import PrintButton from '@/components/PrintButton';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Brieven', robots: { index: false, follow: false } };

export default async function Letters() {
  if (!crmConfigured()) return null;
  const leads = await getLettersToDeliver();
  const date = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  const letters = await Promise.all(leads.filter((l) => l.slug).map(async (l) => ({
    l, url: `${site.url}/voor/${l.slug}`,
    qr: await QRCode.toString(`${site.url}/voor/${l.slug}`, { type: 'svg', margin: 1, width: 120 })
  })));

  return (
    <main className="bg-white text-black">
      <style>{`@media print { header, footer, .no-print { display: none !important } .letter { page-break-after: always; border: 0 !important; margin: 0 !important } main { padding: 0 !important } }`}</style>
      <div className="no-print wrap pt-[110px]">
        <h1 className="text-[32px] font-semibold">Brieven om te bezorgen ({letters.length})</h1>
        <p className="mt-1 text-[15px] text-muted">Gesorteerd op postcode en straat, voor één bezorgronde. Print en markeer daarna in de admin als &quot;Brief bezorgd&quot;.</p>
        <div className="my-6"><PrintButton /></div>
        {letters.length === 0 && <p className="text-muted">Geen brieven klaar. Nieuwe kansen komen elke ochtend binnen.</p>}
      </div>
      {letters.map(({ l, url, qr }) => {
        const missing = (l.audit?.findings || []).filter((f) => !f.ok).slice(0, 3);
        return (
          <article key={l.id} className="letter mx-auto my-8 max-w-[720px] border border-line p-[56px] text-[15px] leading-[1.6]">
            <div className="flex justify-between"><b className="text-[22px]">Lorvex</b><span className="text-right text-[13px]">{site.url.replace('https://', '')} · {site.phone}<br />{legal.email}</span></div>
            <p className="mt-8 text-[14px]">{l.business_name}<br />{l.address}<br />{[l.postcode, l.city].filter(Boolean).join(' ')}</p>
            <p className="mt-6 text-[13px]">{legal.city}, {date}</p>
            <p className="mt-6">Beste ondernemer van {l.business_name},</p>
            <p className="mt-3">Ik ben Robert van Lorvex, webdesigner uit Alkmaar. Ik heb uw website <b>{l.domain}</b> bekeken{missing.length ? ' en zag een paar dingen die u klanten kunnen kosten:' : '.'}</p>
            {missing.length > 0 && (
              <div className="mt-3 rounded-lg border border-line p-4">
                <p className="font-semibold">Uw website-score: {l.audit?.score ?? '–'} / 100</p>
                <ul className="mt-1 list-disc pl-5">{missing.map((f) => <li key={f.id}>{f.title}: ontbreekt of kan beter</li>)}</ul>
              </div>
            )}
            <p className="mt-3">Daarom heb ik alvast een <b>gratis voorbeeld</b> gemaakt van hoe uw website eruit kan zien. U zit nergens aan vast: eerst zien, dan beslissen.</p>
            <div className="mt-4 flex items-center gap-5 rounded-lg bg-[#f5f5f4] p-4">
              <div className="h-[120px] w-[120px] shrink-0" dangerouslySetInnerHTML={{ __html: qr }} />
              <div><b>Scan om uw voorbeeld te zien</b><br /><span className="text-[13px]">of ga naar {url.replace('https://', '')}</span></div>
            </div>
            <p className="mt-4">Bevalt het? Op die pagina vraagt u met één klik of ik contact opneem. Liever geen contact? Ook dat kunt u daar aangeven, dan hoort u niets meer van mij.</p>
            <p className="mt-6">Met vriendelijke groet,<br /><b>Robert Rocha</b><br />Lorvex</p>
            {(legal.kvk || legal.btw) && <p className="mt-6 text-[11px] text-[#666]">{[legal.kvk && `KvK ${legal.kvk}`, legal.btw && `Btw ${legal.btw}`].filter(Boolean).join(' · ')}</p>}
          </article>
        );
      })}
    </main>
  );
}
