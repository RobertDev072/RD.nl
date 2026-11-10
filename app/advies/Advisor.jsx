'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useShop } from '@/components/ShopProvider';
import { PImg, Price, Icon } from '@/components/ui';

// Inhoud overgenomen van jehaarwinkel.nl/advies
const GOALS = [
  { id: 'verzorging', title: 'Haarverzorging', text: 'Shampoo, conditioner, masker, leave-in, kleur en hoofdhuid.' },
  { id: 'styling', title: 'Styling', text: 'Volume, kruldefinitie, textuur, hold, glans en hittebescherming.' },
  { id: 'tools', title: 'Tools', text: 'Krultang, stijltang, föhn, airstyler, stijlborstel of warmteborstel.' },
  { id: 'accessoires', title: 'Accessoires', text: 'Borstels, kammen, satijn en haarhanddoeken.' }
];
const C = { shampoo: ['shampoo', 'Shampoo'], conditioner: ['conditioner', 'Conditioner'], masker: ['haarmasker', 'Haarmasker'], leavein: ['leave-in-verzorging', 'Leave-in verzorging'], olie: ['haarolie-serum', 'Haarolie & serum'], hitte: ['hittebescherming', 'Hittebescherming'], mousse: ['haarmousse', 'Haarmousse'], volume: ['volume-textuur', 'Volume & textuur'], gel: ['gel-stylingcreme', 'Gel & stylingcrème'], zilver: ['zilvershampoo-zilvermasker', 'Zilvershampoo & zilvermasker'], kleur: ['kleurshampoo', 'Kleurshampoo'], wax: ['wax-paste-pomade', 'Wax, paste & pomade'], spray: ['haarspray-haarlak', 'Haarspray & haarlak'], fohn: ['fohns', 'Föhns'], air: ['airstylers', 'Airstylers'], krul: ['krultangen', 'Krultangen'], warmte: ['warmteborstels', 'Warmteborstels'], stijl: ['stijltangen', 'Stijltangen'], stijlb: ['stijlborstels', 'Stijlborstels'], borstel: ['borstels-kammen', 'Borstels & kammen'], satijn: ['satijnen-accessoires', 'Satijnen accessoires'], handdoek: ['haarhanddoeken', 'Haarhanddoeken'] };
const NEEDS = {
  verzorging: [
    { t: 'Droog haar', d: 'Droog haar voelt vaak ruwer, stugger of minder soepel aan en kan dof ogen. Droog betekent niet automatisch beschadigd: ook verder gezond haar kan uitdrogen door veel wassen, warmte, zon of een van nature drogere haarstructuur. Begin meestal met een verzorgende shampoo en conditioner. Heeft het haar meer nodig, voeg dan een masker of leave-in toe.', c: ['shampoo', 'conditioner', 'masker', 'leavein', 'olie'] },
    { t: 'Beschadigd of chemisch behandeld haar', d: 'Beschadigd haar is meer dan alleen droog. Het kan kwetsbaar, poreus, breekbaar of minder elastisch aanvoelen, bijvoorbeeld na blonderen, veelvuldig kleuren, permanenten of intensief gebruik van warmte.', c: ['shampoo', 'conditioner', 'masker', 'leavein', 'hitte'] },
    { t: 'Fijn haar en weinig volume', d: 'Fijn haar heeft vaak wel verzorging nodig, maar kan snel slap worden wanneer een product te rijk is. Het doel is dus niet om verzorging weg te laten, maar om licht te doseren en alleen daar te verzorgen waar het nodig is.', c: ['shampoo', 'conditioner', 'mousse', 'volume'] },
    { t: 'Krullend of golvend haar', d: 'Krullen en slag hebben vaak meer behoefte aan vocht en verzorging dan steil haar, maar de balans is belangrijk. Te weinig verzorging kan pluis versterken, terwijl een te zware routine de krul juist kan laten uitzakken.', c: ['shampoo', 'conditioner', 'masker', 'leavein', 'gel'] },
    { t: 'Gekleurd haar en kleurbehoud', d: 'Gekleurd haar vraagt om verzorging die de haarconditie ondersteunt en helpt kleur en glans zo lang mogelijk mooi te houden. Combineer een passende shampoo met conditioner of masker.', c: ['shampoo', 'conditioner', 'masker', 'kleur'] },
    { t: 'Blond, grijs of opgelicht haar met gele gloed', d: 'Zilverproducten bevatten pigmenten die ongewenste gele of warme tonen optisch helpen neutraliseren. Ze zijn bedoeld voor toning en vervangen gewone verzorging niet.', c: ['zilver', 'shampoo', 'conditioner', 'masker'] },
    { t: 'Snel vet haar of een hoofdhuid uit balans', d: 'Bij een snel vette aanzet kijk je eerst naar de hoofdhuid. Gebruik een shampoo die goed reinigt en breng rijkere verzorging niet onnodig op de hoofdhuid aan.', c: ['shampoo', 'conditioner'] },
    { t: 'Pluizig haar en een onrustige haarstructuur', d: 'Pluis heeft niet altijd dezelfde oorzaak. Het haar kan droog of beschadigd zijn, maar sommige haarstructuren reageren van nature sterker op vocht en weersomstandigheden.', c: ['conditioner', 'masker', 'leavein', 'olie', 'gel'] },
    { t: 'Roos of zichtbare schilfers', d: 'Bij roos en schilfers staat de hoofdhuid centraal. Kies een gerichte reiniging en houd verzorgende producten voor de lengtes apart.', c: ['shampoo', 'leavein'] }
  ],
  styling: [
    { t: 'Volume', d: 'Bij styling bepaalt vooral het gewenste resultaat de keuze. Voor volume passen mousse, root lift en volumeproducten goed.', c: ['mousse', 'volume', 'spray'] },
    { t: 'Kruldefinitie', d: 'Krullen en slag vragen om de juiste balans tussen vocht en houvast, zodat de krul mooi gedefinieerd blijft zonder uit te zakken.', c: ['gel', 'mousse', 'leavein'] },
    { t: 'Textuur en houvast', d: 'Voor textuur, grip en een kapsel dat de hele dag blijft zitten.', c: ['wax', 'volume', 'spray'] },
    { t: 'Hittebescherming', d: 'Gebruik je regelmatig een föhn, stijltang of krultang, dan is een passend hittebeschermend product een logische stap. Breng het aan vóór het gebruik van warmte en volg de gebruiksaanwijzing van het product.', c: ['hitte', 'leavein', 'olie'] }
  ],
  tools: [
    { t: 'Krullen of waves', d: 'Kies een tool op basis van het kapsel dat je wilt maken. Een kleinere krultang geeft een compactere, stevigere krul; een grotere diameter geeft lossere krullen of waves.', c: ['krul', 'air', 'warmte'] },
    { t: 'Glad en steil', d: 'Voor een strak, glad resultaat met glans.', c: ['stijl', 'stijlb'] },
    { t: 'Snel drogen en volume', d: 'Föhnen, drogen en tegelijk volume of een mooie blowout maken.', c: ['fohn', 'air', 'warmte'] }
  ],
  accessoires: [
    { t: 'Na het wassen', d: 'Een accessoire kies je vooral op gebruik. Een microvezel haarhanddoek helpt vocht opnemen zonder hard droogwrijven.', c: ['handdoek', 'borstel'] },
    { t: "Voor 's nachts", d: 'Satijnen accessoires helpen je haar te beschermen terwijl je slaapt.', c: ['satijn'] },
    { t: 'Ontwarren en stylen', d: 'De juiste borstel of kam maakt ontwarren en stylen makkelijker.', c: ['borstel'] }
  ]
};

export default function Advisor() {
  const params = useSearchParams();
  const router = useRouter();
  const { index } = useShop();
  const [goal, setGoal] = useState(params.get('doel') || '');
  const [need, setNeed] = useState(null);
  useEffect(() => { setNeed(null); }, [goal]);
  const choose = g => { setGoal(g); router.replace(g ? `/advies?doel=${g}` : '/advies', { scroll: false }); };
  const needs = NEEDS[goal] || [];
  const n = needs[need];
  const recs = useMemo(() => {
    if (!n) return [];
    const names = n.c.map(k => C[k][1].toLowerCase());
    return index.filter(p => p.inStock && names.some(x => p.cats.toLowerCase().includes(x))).slice(0, 8);
  }, [n, index]);

  return (
    <div className="adv">
      <div className="adv-steps"><span className={!goal ? 'on' : 'done'}>1. Doel</span><span className={goal && !n ? 'on' : n ? 'done' : ''}>2. Behoefte</span><span className={n ? 'on' : ''}>3. Advies</span></div>
      {!goal && (
        <>
          <h2>Waar zoek je advies voor?</h2>
          <p className="muted">Begin bij je doel. Zo krijg je alleen vragen die voor jouw keuze relevant zijn.</p>
          <div className="adv-grid">
            {GOALS.map(g => <button key={g.id} className="adv-card" onClick={() => choose(g.id)}><b>{g.title}</b><span>{g.text}</span>{Icon.arrow()}</button>)}
          </div>
        </>
      )}
      {goal && !n && (
        <>
          <button className="adv-back" onClick={() => choose('')}>← Andere categorie kiezen</button>
          <h2>Wat past het best bij jouw haar?</h2>
          <div className="adv-grid">
            {needs.map((x, i) => <button key={x.t} className="adv-card" onClick={() => setNeed(i)}><b>{x.t}</b>{Icon.arrow()}</button>)}
          </div>
        </>
      )}
      {n && (
        <>
          <button className="adv-back" onClick={() => setNeed(null)}>← Terug</button>
          <div className="adv-res">
            <div>
              <span className="eyebrow">Jouw haaradvies</span>
              <h2>{n.t}</h2>
              <p>{n.d}</p>
              <h4>Geschikte productsoorten</h4>
              <div className="chips">{n.c.map(k => <Link key={k} href={`/categorie/${C[k][0]}`} className="chip">{C[k][1]}</Link>)}</div>
            </div>
          </div>
          {recs.length > 0 && (
            <>
              <h3 style={{ margin: '26px 0 12px' }}>Producten die hierbij passen</h3>
              <ul className="adv-list">
                {recs.map(p => (
                  <li key={p.id}><Link href={`/product/${p.slug}`}><span className="si"><PImg src={p.thumb} alt="" /></span><span className="sn"><small>{p.brand}</small>{p.name}</span><Price price={p.price} regular={p.regular > p.price ? p.regular : 0} /></Link></li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}
