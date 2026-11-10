import Link from 'next/link';
import { getData, firstImageIn, inCat } from '@/lib/catalog';
import { lite } from '@/lib/woo';
import { eur, pct, SITE } from '@/lib/format';
import ProductCard from '@/components/ProductCard';
import HeroSlider from '@/components/HeroSlider';
import RecentRail from '@/components/RecentRail';

export const revalidate = 3600;

const check = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12l5 5L20 7" /></svg>;
const ic = d => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{d}</svg>;

// Teksten zoals ze op jehaarwinkel.nl staan
const LINES = [
  { re: /core\s*lab/i, eyebrow: 'Artistique', title: 'Core Lab van Artistique', text: 'Gerichte haarverzorging voor krullen, kleur, herstel, volume en hoofdhuid.', cta: 'Bekijk Core Lab' },
  { re: /orchid/i, eyebrow: 'Artistique', title: 'Artistique Orchid', text: 'Verzorgende haarproducten voor glans, herstel, hydratatie en makkelijk kambaar.', cta: 'Bekijk Orchid' },
  { re: /youstyle|\bys\b/i, eyebrow: 'Artistique', title: 'Artistique YouStyle (YS)', text: 'Stylingproducten voor grip, volume, textuur, krullen en langdurige controle.', cta: 'Bekijk YouStyle (YS)' }
];

export default async function Home() {
  const d = await getData();
  const lineOf = re => d.lines.find(l => re.test(l.name) || re.test(l.slug));
  const prodsIn = (cat, n) => cat ? d.products.filter(p => p.inStock && p.images[0] && inCat(d, p, cat.id)).slice(0, n) : [];
  const card = p => ({ id: p.id, slug: p.slug, name: p.name, img: p.images[0].src, price: eur(p.price) });

  const lines = LINES.map(L => {
    const cat = lineOf(L.re);
    return { ...L, href: cat ? `/categorie/${cat.slug}` : '/merk/artistique', cat, products: prodsIn(cat, 3) };
  });
  const slides = lines.map((L, k) => ({
    eyebrow: L.eyebrow, title: L.title, text: L.text, cta: L.cta, href: L.href,
    ...(k === 0 ? { href2: '/shop', cta2: 'Shop alle producten', photo: { desk: SITE.img.heroDesk, mob: SITE.img.heroMob, alt: 'Artistique Core Lab' } } : {}),
    products: L.products.map(card)
  })).filter((s, k) => k === 0 || s.products.length >= 2);

  const top = s => d.tops.find(t => t.slug === s);
  const bigTiles = [
    { t: top('haarverzorging'), img: SITE.img.verzorging },
    { t: top('haarstyling'), img: SITE.img.styling },
    { t: top('kleur-toning'), img: SITE.img.kleur }
  ].filter(x => x.t);
  const smallTiles = ['tools', 'haaraccessoires'].map(top).filter(Boolean);
  const maxOff = Math.max(...d.products.map(p => pct(p.price, p.regular)), 0);

  const popular = [...d.products].filter(p => p.inStock).sort((a, b) => (b.reviews - a.reviews) || (Number(b.onSale) - Number(a.onSale))).slice(0, 12).map(lite);
  const sale = d.products.filter(p => p.onSale && p.inStock).sort((a, b) => pct(b.price, b.regular) - pct(a.price, a.regular)).slice(0, 12).map(lite);
  const toolsTop = top('tools');
  const tools = toolsTop ? d.products.filter(p => p.inStock && inCat(d, p, toolsTop.id)).slice(0, 10).map(lite) : [];

  return (
    <>
      <HeroSlider slides={slides} />

      <div className="uspbar"><div className="wrap">
        <div><i>{ic(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>)}</i><span><b>Voor 16:00 besteld</b><span>Zelfde werkdag verzonden</span></span></div>
        <div><i>{ic(<><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.5" /><circle cx="17" cy="17.5" r="1.5" /></>)}</i><span><b>Gratis verzending</b><span>Vanaf €30 in Nederland</span></span></div>
        <div><i>{ic(<><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12" /></>)}</i><span><b>Advies vanuit de kapsalon</b><span>Via WhatsApp of e-mail</span></span></div>
        <div><i>{ic(<><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>)}</i><span><b>Veilig betalen</b><span>iDEAL | Wero, Klarna, creditcard</span></span></div>
      </div></div>

      <section>
        <div className="wrap">
          <div className="shead"><div><span className="eyebrow">Categorieën</span><h2>Shop op categorie</h2></div><Link href="/shop" className="more">Alle producten</Link></div>
          <div className="ptiles">
            {bigTiles.map(({ t, img }) => (
              <Link key={t.slug} href={`/categorie/${t.slug}`} className="ptile">
                <span className="pi"><img src={img} alt="" loading="lazy" /></span>
                <span className="pt"><b>{t.label}</b><small>{t.children.slice(0, 3).map(c => c.name).join(' · ')}</small></span>
              </Link>
            ))}
          </div>
          <div className="cats">
            {smallTiles.map(t => (
              <Link key={t.slug} href={`/categorie/${t.slug}`} className="cat">
                <span className="ci">{firstImageIn(d, t.id) && <img src={firstImageIn(d, t.id)} alt="" loading="lazy" />}</span>
                <span><b>{t.label}</b><small>{t.count} producten</small></span>
              </Link>
            ))}
            {d.brands.slice(0, 2).map(b => (
              <Link key={b.slug} href={`/merk/${b.slug}`} className="cat">
                <span className="ci brandci"><span>{b.name[0]}</span></span>
                <span><b>{b.name}</b><small>{b.count} producten</small></span>
              </Link>
            ))}
            <Link href="/aanbiedingen" className="cat">
              <span className="ci saleci"><span>Tot<b>−{maxOff}%</b></span></span>
              <span><b>Aanbiedingen</b><small>{d.products.filter(p => p.onSale).length} producten</small></span>
            </Link>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="shead"><div><span className="eyebrow">Favorieten</span><h2>Populaire producten</h2></div><Link href="/shop" className="more">Bekijk alles</Link></div>
          <div className="rail">{popular.map(p => <ProductCard key={p.id} p={p} />)}</div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="shead"><div><span className="eyebrow">Artistique</span><h2>Populaire lijnen</h2></div><Link href="/merk/artistique" className="more">Alle Artistique</Link></div>
          <div className="lines3">
            {lines.map(L => (
              <Link key={L.title} href={L.href} className="linecard">
                <span className="lp">{L.products.slice(0, 3).map(p => <img key={p.id} src={p.images[0].thumb} alt="" loading="lazy" />)}</span>
                <h3>{L.title}</h3>
                <p>{L.text}</p>
                <span className="go">{L.cta} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {sale.length > 0 && (
        <section style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="shead"><div><span className="eyebrow">Nu in de aanbieding</span><h2>Aanbiedingen</h2></div><Link href="/aanbiedingen" className="more">Alle aanbiedingen</Link></div>
            <div className="rail">{sale.map(p => <ProductCard key={p.id} p={p} />)}</div>
          </div>
        </section>
      )}

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="advice">
            <div className="t">
              <span className="eyebrow">Advies vanuit de kapsalon</span>
              <h2>Welk haarproduct past bij jou?</h2>
              <p>Kies waar je advies over wilt. Je krijgt in een paar korte stappen een praktisch haaradvies voor verzorging, styling, warmtetools of accessoires, met uitleg waarom de keuze past en directe links naar producten die je kunt bestellen.</p>
              <div className="advgo">
                <Link href="/advies?doel=verzorging">Haarverzorging</Link>
                <Link href="/advies?doel=styling">Styling</Link>
                <Link href="/advies?doel=tools">Tools</Link>
                <Link href="/advies?doel=accessoires">Accessoires</Link>
              </div>
              <ul>
                <li>{check} In een paar korte stappen</li>
                <li>{check} Gebaseerd op haartype en behoefte</li>
                <li>{check} Direct door naar passende producten</li>
              </ul>
            </div>
            <div className="v"><img src={SITE.img.verzorging} alt="" loading="lazy" /></div>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="shead"><div><span className="eyebrow">Onze merken</span><h2>Merken</h2></div><Link href="/merken" className="more">Alle merken</Link></div>
          <div className="brands">
            <Link href="/merk/artistique" className="brandcard b1">
              <div className="lines">{d.lines.slice(0, 8).map(l => <span key={l.slug}>{l.name.replace(/^Artistique\s+/, '')}</span>)}</div>
              <h3>Artistique</h3><p>Professionele haarproducten waar veel praktijkervaring mee is opgebouwd.</p><span className="go">Shop Artistique</span>
            </Link>
            <Link href="/merk/max-pro" className="brandcard b2">
              <h3>Max Pro</h3><p>Föhns, airstylers, krultangen, warmteborstels, stijltangen en stijlborstels.</p><span className="go">Shop Max Pro</span>
            </Link>
            <Link href="/merk/mohi" className="brandcard b3">
              <h3>MOHI</h3><p>Borstels, satijnen accessoires en haarhanddoeken.</p><span className="go">Shop MOHI</span>
            </Link>
          </div>
        </div>
      </section>

      {tools.length > 0 && (
        <section style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="shead"><div><span className="eyebrow">Tools</span><h2>Föhns, tangen &amp; stylers</h2></div><Link href="/categorie/tools" className="more">Alle tools</Link></div>
            <div className="rail">{tools.map(p => <ProductCard key={p.id} p={p} />)}</div>
          </div>
        </section>
      )}

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="about">
            <div>
              <span className="eyebrow">Over JeHaarwinkel</span>
              <h2>Professionele haarproducten met duidelijke uitleg</h2>
              <p>Het assortiment is samengesteld met kennis van professionele haarproducten en ervaring uit de kapperspraktijk. Daardoor kijken we niet alleen naar wat een product belooft, maar vooral naar voor welk haar het geschikt is, wat het doet en hoe je het op de juiste manier gebruikt.</p>
              <Link href="/over-jehaarwinkel" className="more">Lees meer over ons</Link>
            </div>
            <div className="about-c">
              <div><b>Persoonlijke service</b><span>Heb je een vraag over een product of twijfel je welke keuze bij jouw haar past? We helpen je graag.</span></div>
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn btn-primary">WhatsApp {SITE.phone}</a>
              <a href={`mailto:${SITE.email}`} className="btn btn-line">{SITE.email}</a>
              <a href={SITE.wwkUrl} target="_blank" rel="noopener" className="wwk dark"><img src={SITE.wwk} alt="WebwinkelKeur" loading="lazy" /></a>
            </div>
          </div>
          <RecentRail />
        </div>
      </section>
    </>
  );
}
