import Link from 'next/link';
import { CATS, LOOKS, PRODUCTS, SITE, HOURS, im, STORE, bySlug } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { Icon, Img } from '@/components/icons';
import { eur } from '@/lib/format';
export default function Home() {
  const nieuw = PRODUCTS.filter(p => p.tag === 'Nieuw' || p.tag === 'Bestseller' || p.tag === 'Favoriet').slice(0, 8);
  return (
    <>
      <section className="hero">
        <div className="wrap hero-in">
          <div className="hero-t">
            <span className="eyebrow">Nieuwe collectie · najaar</span>
            <h1>Jouw nieuwe <em>favoriete</em> look</h1>
            <p className="lead">{SITE.tagline}. Elke week nieuwe items, nu ook online te shoppen.</p>
            <div className="cta"><Link href="/shop" className="btn btn-dark">Shop de collectie {Icon.arrow(18)}</Link><Link href="/shop?cat=blazers-jasjes" className="btn btn-line">Blazers</Link></div>
            <ul className="hero-u"><li>{Icon.truck(16)} Morgen in huis</li><li>{Icon.return(16)} 14 dagen retour</li><li><span className="ideal sm">iDEAL</span> Veilig betalen</li></ul>
          </div>
          <div className="hero-v">
            <Img src={im(7)} alt="Blazer in taupe" eager className="h1" />
            <Img src={im(4)} alt="Beige jasje & jeans" eager className="h2" />
            <span className="hero-badge"><b>Nieuw binnen</b><small>elke week</small></span>
          </div>
        </div>
      </section>

      <section className="cats-s"><div className="wrap">
        <div className="cats">{CATS.map(c => <Link key={c.slug} href={`/shop?cat=${c.slug}`} className="cat"><Img src={im(c.img)} alt="" /><span>{c.name}</span></Link>)}</div>
      </div></section>

      <section><div className="wrap">
        <div className="shead"><div><span className="eyebrow">Net binnen</span><h2>Nieuw in de boetiek</h2></div><Link href="/shop" className="more">Alles bekijken {Icon.arrow(16)}</Link></div>
        <div className="pgrid">{nieuw.map(p => <ProductCard key={p.slug} p={p} />)}</div>
      </div></section>

      <section className="looks-s"><div className="wrap">
        <div className="shead"><div><span className="eyebrow">Shop the look</span><h2>Complete outfits</h2></div></div>
        <div className="looks">{LOOKS.map(l => {
          const it = l.items.map(bySlug); const sum = it.reduce((a, p) => a + p.price, 0);
          return (
            <Link key={l.title} href={`/product/${l.items[0]}`} className="look">
              <Img src={im(l.img)} alt={l.title} />
              <div><b>{l.title}</b><small>{it.map(p => p.name).join(' + ')} · {eur(sum)}</small></div>
            </Link>);
        })}</div>
      </div></section>

      <section><div className="wrap split">
        <Img src={STORE} alt="Binnenkant van de BellaMina boetiek" className="split-v" />
        <div>
          <span className="eyebrow">Over BellaMina</span>
          <h2>Mode met een vrouwelijke touch</h2>
          <p>Bij BellaMina vind je bijzondere damesmode vol stijl en vrouwelijkheid. Elke week komen er nieuwe items binnen, zorgvuldig uitgekozen zodat je altijd iets unieks vindt.</p>
          <ul className="ticks"><li>{Icon.check()} Elke week nieuwe items</li><li>{Icon.check()} Persoonlijk stijladvies</li><li>{Icon.check()} Uniek en vrouwelijk</li><li>{Icon.check()} Privé shoppen op afspraak</li></ul>
          <div className="cta"><Link href="/over" className="btn btn-dark">Bezoek de boetiek</Link><a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn btn-line">{Icon.chat(18)} Stijladvies via WhatsApp</a></div>
        </div>
      </div></section>

      <section className="insta-s"><div className="wrap">
        <div className="shead"><div><span className="eyebrow">Volg ons</span><h2>{SITE.insta}</h2></div><a href={SITE.instagram} target="_blank" rel="noopener" className="more">Instagram {Icon.arrow(16)}</a></div>
        <div className="insta">{[8, 9, 10, 11, 12, 13].map(i => <a key={i} href={SITE.instagram} target="_blank" rel="noopener"><Img src={im(i)} alt="BellaMina op Instagram" /></a>)}</div>
      </div></section>

      <section className="usp-s"><div className="wrap usps">
        <div>{Icon.truck(26)}<b>Gratis verzending</b><small>vanaf € 75, anders € 4,95</small></div>
        <div>{Icon.return(26)}<b>14 dagen bedenktijd</b><small>ruilen kan ook in de boetiek</small></div>
        <div><span className="ideal">iDEAL</span><b>Veilig betalen</b><small>iDEAL, Wero, Bancontact, Klarna</small></div>
        <div>{Icon.chat(26)}<b>Persoonlijk advies</b><small>app ons op {SITE.phone}</small></div>
      </div></section>
    </>
  );
}
