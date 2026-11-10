'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { eur, pct, SHIPPING } from '@/lib/format';
import { useShop } from './ShopProvider';
import { Icon, PImg, Price, Qty, Stars, ShipCountdown, PayLogos } from './ui';

export default function ProductView({ p, descHtml }) {
  const { add, isWish, toggleWish, seen } = useShop();
  useEffect(() => { seen(p); }, [p.id]); // eslint-disable-line
  const firstAvail = p.options?.find(o => o.inStock) || p.options?.[0];
  const [optId, setOptId] = useState(firstAvail?.id || 0);
  const [q, setQ] = useState(1);
  const [slide, setSlide] = useState(0);
  const mainRef = useRef(null);
  const opt = p.options?.find(o => o.id === optId) || null;

  const price = opt ? opt.price : p.price;
  const regular = opt ? opt.regular : p.regular;
  const inStock = opt ? opt.inStock : p.inStock;
  const off = pct(price, regular);

  const images = useMemo(() => {
    const base = p.images.length ? p.images : [{ src: null, thumb: null, alt: p.name }];
    if (opt?.image && !base.some(i => i.src === opt.image.src)) return [opt.image, ...base];
    return base;
  }, [p.images, opt, p.name]);

  useEffect(() => {
    document.body.classList.add('pdp-page');
    return () => document.body.classList.remove('pdp-page');
  }, []);

  // Bij een andere variant: terug naar de eerste foto (de variantfoto)
  useEffect(() => { goTo(0, 'instant'); }, [optId]);

  function goTo(i, behavior = 'smooth') {
    const el = mainRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior });
    setSlide(i);
  }
  const onScroll = e => {
    const el = e.currentTarget;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== slide) setSlide(i);
  };

  const onAdd = () => add({
    pid: p.id, oid: opt?.id || 0, slug: p.slug, name: p.name, opt: opt?.label || '',
    price, regular, img: (opt?.image || p.images[0])?.thumb
  }, q);

  const freeLeft = SHIPPING.NL.free;

  return (
    <div className="pdp">
      <div className={`gallery ${images.length > 1 ? '' : 'one'}`}>
        {images.length > 1 && (
          <div className="thumbs">
            {images.map((im, i) => (
              <button key={im.src || i} className={slide === i ? 'on' : ''} onClick={() => goTo(i)} aria-label={`Foto ${i + 1}`}>
                <PImg src={im.thumb} alt="" />
              </button>
            ))}
          </div>
        )}
        <div>
          <div className="main" ref={mainRef} onScroll={onScroll} aria-label="Productfoto's">
            {images.map((im, i) => (
              <div className="slide" key={im.src || i}><PImg src={im.src} alt={im.alt || p.name} eager={i === 0} /></div>
            ))}
          </div>
          {images.length > 1 && <div className="dots" aria-hidden="true">{images.map((_, i) => <i key={i} className={slide === i ? 'on' : ''} />)}</div>}
        </div>
      </div>

      <div className="info">
        {p.brand && <span className="brand">{p.brand.name}</span>}
        <h1>{p.name}</h1>
        {p.reviews > 0 && <div style={{ marginBottom: 8 }}><Stars value={p.rating} count={p.reviews} /> <span className="muted" style={{ fontSize: 13.5 }}>Gewaardeerd {p.rating.toFixed(2).replace('.', ',')} uit 5</span></div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Price price={price} regular={regular} />
          {off > 0 && <span className="save">Je bespaart {eur(regular - price)}</span>}
        </div>
        <div className={`stock ${inStock ? '' : 'no'}`}><i />{inStock ? (p.lowStock ? 'Op voorraad · nog maar een paar stuks' : 'Op voorraad') : 'Tijdelijk uitverkocht'}</div>
        {p.short && <p className="short">{p.short}</p>}

        {p.options && (
          <>
            <div className="optlabel">{p.attrName}: <b>{opt?.label}</b></div>
            <div className="opts" role="radiogroup" aria-label={p.attrName}>
              {p.options.map(o => (
                <button key={o.id} role="radio" aria-checked={o.id === optId} className={`opt ${o.id === optId ? 'on' : ''} ${o.inStock ? '' : 'oos'}`} onClick={() => setOptId(o.id)}>
                  {o.label}{o.price !== p.price && p.options.some(x => x.price !== o.price) ? ` · ${eur(o.price)}` : ''}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="buyrow">
          <Qty value={q} onChange={v => setQ(Math.max(1, v))} />
          <button className="btn btn-primary" onClick={onAdd} disabled={!inStock}>
            {Icon.bag(20)} {inStock ? `In winkelmand · ${eur(price * q)}` : 'Uitverkocht'}
          </button>
          <button className={`iconbtn wishbtn big ${isWish(p.id) ? 'on' : ''}`} onClick={() => toggleWish(p)} aria-label="Op verlanglijst" aria-pressed={isWish(p.id)}>{Icon.heart(22)}</button>
        </div>
        {inStock && <div className="shipnote">{Icon.truck(19)} <ShipCountdown /></div>}

        <div className="perks">
          <div>{Icon.truck()} Gratis verzending vanaf {eur(freeLeft)} (NL)</div>
          <div>{Icon.return()} 14 dagen bedenktijd</div>
          <div>{Icon.scissors()} Advies vanuit de kapsalon, via WhatsApp of e-mail</div>
          <div>{Icon.lock()} Veilig betalen via Mollie</div>
          <PayLogos />
        </div>

        {descHtml && (
          <details className="acc" open>
            <summary>Productinformatie</summary>
            <div className="desc" dangerouslySetInnerHTML={{ __html: descHtml }} />
          </details>
        )}
        <details className="acc">
          <summary>Verzending &amp; retour</summary>
          <div className="desc">
            <p>Nederland: {eur(SHIPPING.NL.cost)}, gratis vanaf {eur(SHIPPING.NL.free)}. Meestal de volgende werkdag in huis.</p>
            <p>België: {eur(SHIPPING.BE.cost)}, gratis vanaf {eur(SHIPPING.BE.free)}. Meestal binnen 2 werkdagen.</p>
            <p>Bestel je op een werkdag vóór 16:00 uur, dan proberen we je bestelling dezelfde dag nog te verzenden met PostNL.</p>
            <p>Je hebt 14 dagen bedenktijd na ontvangst. <a href="/retourneren" style={{ textDecoration: 'underline' }}>Lees meer over retourneren</a>.</p>
          </div>
        </details>
        <details className="acc">
          <summary>Advies nodig?</summary>
          <div className="desc">
            <p>Twijfel je welke keuze bij jouw haar past? Stel je vraag via WhatsApp of e-mail, we helpen je graag verder.</p>
            <p><a href="https://wa.me/31682068054" target="_blank" rel="noopener" style={{ textDecoration: 'underline' }}>WhatsApp 06-82068054</a> · <a href="mailto:info@jehaarwinkel.nl" style={{ textDecoration: 'underline' }}>info@jehaarwinkel.nl</a></p>
          </div>
        </details>
      </div>

      <div className="stickybuy">
        <button className={`iconbtn wishbtn ${isWish(p.id) ? 'on' : ''}`} onClick={() => toggleWish(p)} aria-label="Op verlanglijst" aria-pressed={isWish(p.id)}>{Icon.heart(21)}</button>
        <Qty value={q} onChange={v => setQ(Math.max(1, v))} />
        <button className="btn btn-primary" onClick={onAdd} disabled={!inStock}>
          {inStock ? <>{Icon.bag(18)} In mand · {eur(price * q)}</> : 'Uitverkocht'}
        </button>
      </div>
    </div>
  );
}
