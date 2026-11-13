'use client';
import Link from 'next/link';
import { useState } from 'react';
import { CATS, PRODUCTS, LOOKS, im, bySlug } from '@/lib/data';
import { eur } from '@/lib/format';
import { useShop } from '@/components/ShopProvider';
import { Icon, Img } from '@/components/icons';
import ProductCard from '@/components/ProductCard';
export default function Buy({ p }) {
  const { add, openCart, wish, toggleWish } = useShop();
  const [ph, setPh] = useState(0); const [color, setColor] = useState(p.colors[0].id);
  const [size, setSize] = useState(p.sizes.length === 1 ? p.sizes[0] : null); const [err, setErr] = useState(false);
  const cat = CATS.find(c => c.slug === p.cat); const on = wish.includes(p.slug);
  const look = LOOKS.find(l => l.items.includes(p.slug));
  const pair = look ? look.items.filter(s => s !== p.slug).map(bySlug) : [];
  const more = PRODUCTS.filter(x => x.cat === p.cat && x.slug !== p.slug).slice(0, 4);
  const buy = () => { if (!size) { setErr(true); document.querySelector('.sizes')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; } add(p.slug, size, color); openCart(); };
  return (
    <div className="wrap">
      <div className="crumbs"><Link href="/shop">Shop</Link> / <Link href={`/shop?cat=${p.cat}`}>{cat?.name}</Link> / <span>{p.name}</span></div>
      <div className="pdp">
        <div className="gal">
          <div className="gal-m" onScroll={e => setPh(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
            {p.imgs.map((i, n) => <Img key={n} src={im(i)} alt={n ? '' : p.name} eager={n === 0} />)}
          </div>
          <div className="dots">{p.imgs.map((_, n) => <i key={n} className={ph === n ? 'on' : ''} />)}</div>
        </div>
        <div className="pinfo">
          {p.tag && <span className="eyebrow">{p.tag}</span>}
          <h1>{p.name}</h1>
          <div className="pprice">{eur(p.price)} <small>incl. btw</small></div>
          <p className="lead">{p.desc}</p>
          <div className="plabel">Kleur: <b>{p.colors.find(c => c.id === color).label}</b></div>
          <div className="colors">{p.colors.map(c => <button key={c.id} className={color === c.id ? 'on' : ''} style={{ '--c': c.hex }} onClick={() => setColor(c.id)} aria-label={c.label} />)}</div>
          {p.sizes.length > 1 && <>
            <div className="plabel">Maat {err && <span className="err">Kies eerst je maat</span>}</div>
            <div className={`sizes ${err ? 'bad' : ''}`}>{p.sizes.map(s => <button key={s} className={size === s ? 'on' : ''} onClick={() => { setSize(s); setErr(false); }}>{s}</button>)}</div>
            <p className="muted small">Twijfel je over je maat? App ons gerust, we denken graag mee.</p>
          </>}
          <div className="pbuy">
            <button className="btn btn-dark big" onClick={buy}>{Icon.bag(19)} In mijn tas</button>
            <button className={`btn btn-line sq ${on ? 'on' : ''}`} onClick={() => toggleWish(p.slug)} aria-label="Favoriet">{Icon.heart(20, on)}</button>
          </div>
          <ul className="perks"><li>{Icon.truck(18)} Voor 16:00 besteld, morgen in huis</li><li>{Icon.return(18)} 14 dagen bedenktijd, ruilen ook in de boetiek</li><li>{Icon.lock(18)} Veilig betalen met iDEAL</li></ul>
          <details className="acc" open><summary>Productinformatie</summary><p>{p.desc} Valt normaal op maat. Model draagt maat S.</p></details>
          <details className="acc"><summary>Verzenden & retourneren</summary><p>Gratis verzending vanaf € 75, daaronder € 4,95. Niet goed? Je hebt 14 dagen bedenktijd. Ruilen kan ook gewoon in de boetiek in Heerhugowaard.</p></details>
          {pair.length > 0 && <div className="pair"><div className="plabel">Maak de look compleet</div>{pair.map(x => <Link key={x.slug} href={`/product/${x.slug}`} className="pair-i"><Img src={im(x.imgs[0])} alt="" /><span><b>{x.name}</b><small>{eur(x.price)}</small></span>{Icon.arrow(18)}</Link>)}</div>}
        </div>
      </div>
      {more.length > 0 && <section><div className="shead"><h2>Meer {cat?.name.toLowerCase()}</h2></div><div className="pgrid">{more.map(x => <ProductCard key={x.slug} p={x} />)}</div></section>}
      <div className="stickybuy"><div><small>{p.name}</small><b>{eur(p.price)}</b></div><button className="btn btn-dark" onClick={buy}>{Icon.bag(18)} In mijn tas</button></div>
    </div>
  );
}
