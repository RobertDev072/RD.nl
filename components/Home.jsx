'use client';
import { bySlug, CATEGORIES, img } from '@/lib/menu';
import ProductCard from './ProductCard';
import { SafeImg, ProductImg } from './ui';
import { eur, minPrice, hasRange } from '@/lib/menu';
import { useShop } from './ShopProvider';
import Menu from './Menu';

const CAT_IMG = { maaltijden: 'roti-kip-high.png', 'bbq-kip': 'bbq-kippenbout-high.png', 'broodjes-bara': 'bara-met-beleg-high.png', 'bijgerechten-sauzen': 'kousenband-high.png', 'snacks-zoet': 'file_00000000448882439589f402d44cb3f7-high.png', 'extra-s-mee-naar-huis': 'potje-peper-high.png', dranken: 'dawet-roze-high.png' };
const POPULAR = ['surinaamse-roti', 'surinaamse-bami', 'bara-met-beleg', 'broodje-hete-kip', 'broodje-pom', 'bbq-kippenbout', 'kippastei', 'dawet'];
const SPECIALS = ['moksi-alesi', 'ban-ban-corvina', 'heri-heri', 'teloh-bakkeljauw'];
const Ic = ({ d }) => <i><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{d}</svg></i>;

function MobileHero({ go }) {
  const { openProduct } = useShop();
  return (
    <div className="mhero">
      <div className="mtop">
        <img src="/logo.webp" alt="" width="64" height="62" className="mlogo" />
        <div>
          <h1>Surinaams eten, vers bereid</h1>
          <p>Roti, bami, bara & meer · Oterleek e.o.</p>
        </div>
      </div>
      <div className="mstatus"><span className="dot" />Bezorging vr–zo 11:00–22:00 · vanaf €5</div>
      <div className="mpop">
        <div className="mpop-h"><b>Populair</b><button onClick={() => go('maaltijden')}>Alles bekijken</button></div>
        <div className="mrail">
          {POPULAR.map(s => { const p = bySlug(s); return (
            <button key={s} className="mitem" onClick={() => openProduct(s)}>
              <span className="mi"><ProductImg p={p} w={300} /></span>
              <b>{p.n}</b>
              <span>{hasRange(p) ? 'vanaf ' : ''}{eur(minPrice(p))}</span>
            </button>
          ); })}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const go = s => document.getElementById(`c-${s}`)?.scrollIntoView({ behavior: 'smooth' });
  return (
    <>
      <MobileHero go={go} />
      <div className="hero"><img className="banner" src="/banner.webp" alt="Hewitt & Hewitt – Authentic Surinamese Food" width="1200" height="408" fetchPriority="high" /></div>
      <div className="usp d-only"><div className="wrap">
        <div><Ic d={<><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.5" /><circle cx="17" cy="17.5" r="1.5" /></>} /><span><b>Bezorging vr–zo</b><span>11:00–22:00, vanaf €5</span></span></div>
        <div><Ic d={<path d="M12 3c3 3 5 6 5 9a5 5 0 0 1-10 0c0-3 2-6 5-9z" />} /><span><b>Vers bereid</b><span>Hete peper apart verpakt</span></span></div>
        <div><Ic d={<><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18" /></>} /><span><b>Veilig betalen</b><span>iDEAL of bij ontvangst</span></span></div>
        <div><Ic d={<path d="M21 12a9 9 0 0 1-13.5 7.8L3 21l1.2-4.5A9 9 0 1 1 21 12z" />} /><span><b>Persoonlijk contact</b><span>Bel of app 06-21262725</span></span></div>
      </div></div>

      <section>
        <div className="wrap">
          <div className="shead"><h1 style={{ fontSize: 'clamp(20px,2.4vw,24px)' }}>Wat heb je zin in?</h1></div>
          <div className="cats">
            {CATEGORIES.map(c => (
              <button key={c.slug} className="cat" onClick={() => go(c.slug)}>
                <SafeImg src={img(CAT_IMG[c.slug], 300)} loading="lazy" />
                <span>{c.name}<small>{c.items.length} producten</small></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="d-only" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="shead"><h2>Populair bij onze klanten</h2><button onClick={() => go('maaltijden')}>Hele menu</button></div>
          <div className="grid">{POPULAR.map(s => <ProductCard key={s} p={bySlug(s)} />)}</div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="shead"><h2>Weekend-specials</h2><span className="muted" style={{ fontSize: 14 }}>Bestel op tijd, sommige 24 uur vooraf</span></div>
          <div className="grid">{SPECIALS.map(s => <ProductCard key={s} p={bySlug(s)} />)}</div>
        </div>
      </section>

      <Menu />

      <section id="bezorging" style={{ scrollMarginTop: 120 }}>
        <div className="wrap">
          <div className="shead"><h2>Bezorgen &amp; afhalen</h2></div>
          <div className="info">
            <div className="box"><h3>Bezorgtijden</h3><ul><li>Vrijdag<b>11:00–22:00</b></li><li>Zaterdag<b>11:00–22:00</b></li><li>Zondag<b>11:00–22:00</b></li></ul></div>
            <div className="box"><h3>Bezorgkosten</h3><ul>
              <li><span><i className="zone" style={{ background: '#7b4a9c' }} />Paarse zone</span><b>€5,00</b></li>
              <li><span><i className="zone" style={{ background: '#b40a2d' }} />Rode zone</span><b>€6,50</b></li>
              <li><span><i className="zone" style={{ background: '#3f6ab0' }} />Blauwe zone</span><b>€7,50</b></li>
            </ul><p style={{ fontSize: 13, marginTop: 8 }}>Minimale bestelling €30. Je zone hangt af van je postcode; we bevestigen dit bij je bestelling.</p></div>
            <div className="box"><h3>Afhalen</h3><p>Afhalen kan bij onze foodtruck, tegen dezelfde prijzen. Op de productielocatie is geen afhaal of verkoop.</p><p style={{ marginTop: 10 }}>Binnenkort ook via Thuisbezorgd.nl en Uber Eats.</p></div>
          </div>
        </div>
      </section>

      <section id="over-ons" style={{ scrollMarginTop: 120 }}>
        <div className="wrap">
          <div className="shead"><h2>Wat klanten zeggen</h2></div>
          <div className="revs">
            {[
              ['Richard Sweep', 'Roti besteld en heerlijk gegeten. Fijn dat de hete peper apart zit, zo bepaal je zelf hoe pittig. Op tijd bezorgd met een berichtje vooraf. Topservice!'],
              ['Bianca Mooy', 'Vers bereid en de eigenaren maken er echt een feestje van met lekkere muziek. Genoten van de bara en het broodje.'],
              ['Kim van Parera', 'Veel smaak en je proeft dat het met zorg gemaakt is. Ik ga hier vaker bestellen.'],
              ['Martijn', 'Eerste keer besteld en positief verrast, vooral door de roti met kipfilet. Alles smaakt vers.']
            ].map(([n, t]) => <div className="rev" key={n}><span className="stars" aria-hidden="true">★★★★★</span><p>“{t}”</p><b>{n}<br /><small>Heerhugowaard</small></b></div>)}
          </div>
          <div className="about" style={{ marginTop: 18 }}>
            <img src="https://primary.jwwb.nl/public/t/l/r/temp-hwrajvfwrrzcxaqzpumw/img-20260301-wa0012-standard.jpg" alt="Hewitt & Hewitt" loading="lazy" />
            <div className="t">
              <h2>Twee broers, één passie</h2>
              <p>Hewitt &amp; Hewitt is opgericht door tweelingbroers met één gedeelde liefde: eten, mensen en samen aan tafel zitten. Cleve staat aan het roer, maar het bedrijf draait op het werk en vertrouwen van allebei.</p>
              <p>We koken Surinaams zonder poespas, met verse ingrediënten en respect voor waar het eten vandaan komt. Voor iedereen in Oterleek en omgeving.</p>
              <blockquote>“Ik geloof in het talent en de vastberadenheid van mijn zoon. Dit is nog maar het begin.” <small className="muted">— Ursula Hewitt</small></blockquote>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
