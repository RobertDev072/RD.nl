'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Icon } from './ui';

export default function HeroSlider({ slides }) {
  const ref = useRef(null);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = n => {
    const el = ref.current; if (!el) return;
    const k = (n + slides.length) % slides.length;
    el.scrollTo({ left: k * el.clientWidth, behavior: 'smooth' });
  };
  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setTimeout(() => go(i + 1), 6500);
    return () => clearTimeout(t);
  }, [i, paused]); // eslint-disable-line
  const onScroll = e => { const el = e.currentTarget; const k = Math.round(el.scrollLeft / el.clientWidth); if (k !== i) setI(k); };

  return (
    <section className="hs" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)} aria-roledescription="carrousel">
      <div className="hs-track" ref={ref} onScroll={onScroll}>
        {slides.map((s, k) => (
          <div className={`hs-slide ${s.photo ? 'withphoto' : ''}`} key={s.title} aria-roledescription="dia" aria-label={`${k + 1} van ${slides.length}`}>
            <div className="wrap hs-in">
              <div className="hs-t">
                <span className="eyebrow">{s.eyebrow}</span>
                {k === 0 ? <h1>{s.title}</h1> : <h2 className="h1">{s.title}</h2>}
                <p className="lead">{s.text}</p>
                <div className="cta">
                  <Link href={s.href} className="btn btn-primary">{s.cta}</Link>
                  {s.href2 && <Link href={s.href2} className="btn btn-line">{s.cta2}</Link>}
                </div>
              </div>
              <div className="hs-v">
                {s.photo ? (
                  <picture>
                    <source media="(max-width: 700px)" srcSet={s.photo.mob} />
                    <img src={s.photo.desk} alt={s.photo.alt} loading={k === 0 ? 'eager' : 'lazy'} fetchPriority={k === 0 ? 'high' : 'auto'} />
                  </picture>
                ) : (
                  <div className="collage" aria-hidden="true">
                    {s.products.map((p, j) => (
                      <Link key={p.id} href={`/product/${p.slug}`} className={`arch a${j + 1}`} tabIndex={-1}>
                        <span className="im"><img src={p.img} alt="" loading="lazy" /></span>
                        {j < 2 && <span className="cap"><b>{p.name}</b>{p.price}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <div className="hs-ctrl wrap">
          <div className="hs-dots">{slides.map((s, k) => <button key={k} className={k === i ? 'on' : ''} onClick={() => go(k)} aria-label={`Naar dia ${k + 1}`} />)}</div>
          <div className="hs-arrows">
            <button className="iconbtn" onClick={() => go(i - 1)} aria-label="Vorige">{Icon.left()}</button>
            <button className="iconbtn" onClick={() => go(i + 1)} aria-label="Volgende">{Icon.right()}</button>
          </div>
        </div>
      )}
    </section>
  );
}
