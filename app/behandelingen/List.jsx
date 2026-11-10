'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CATS, TREATMENTS } from '@/lib/data';
import TreatmentCard from '@/components/TreatmentCard';

export default function List() {
  const params = useSearchParams();
  const router = useRouter();
  const [cat, setCat] = useState(params.get('cat') || '');
  const pick = c => { setCat(c); router.replace(c ? `/behandelingen?cat=${c}` : '/behandelingen', { scroll: false }); };
  const shown = CATS.filter(c => !cat || c.id === cat);
  return (
    <>
      <div className="chips sticky-chips">
        <button className={`chip ${!cat ? 'on' : ''}`} onClick={() => pick('')}>Alles</button>
        {CATS.map(c => <button key={c.id} className={`chip ${cat === c.id ? 'on' : ''}`} onClick={() => pick(c.id)}>{c.name}</button>)}
      </div>
      {shown.map(c => (
        <section key={c.id} className="tsec">
          <div className="shead"><div><h2>{c.name}</h2><p className="muted">{c.intro}</p></div></div>
          <div className="tgrid">{TREATMENTS.filter(t => t.cat === c.id).map(t => <TreatmentCard key={t.slug} t={t} />)}</div>
        </section>
      ))}
    </>
  );
}
