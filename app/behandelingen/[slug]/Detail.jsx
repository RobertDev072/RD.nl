'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { eur } from '@/lib/format';
import { TREATMENTS, EXTRA_SLUGS, GALLERY, sq, img, fromPrice } from '@/lib/data';
import { useShop } from '@/components/ShopProvider';
import { Icon, Img } from '@/components/ui';

export default function Detail({ t }) {
  const { add, openCart } = useShop();
  const router = useRouter();
  const [v, setV] = useState(t.variants?.[0]?.id || null);
  const [addons, setAddons] = useState([]);
  const [extras, setExtras] = useState([]);
  const variant = t.variants?.find(x => x.id === v);
  const base = variant ? variant.price : t.price;
  const addonSum = (t.addons || []).filter(a => addons.includes(a.id)).reduce((s, a) => s + a.price, 0);
  const extraList = t.cat === 'nieuwe-set' || t.cat === 'nabehandeling' ? EXTRA_SLUGS.map(s => TREATMENTS.find(x => x.slug === s)).filter(x => x && !x.variants) : [];
  const extraSum = extraList.filter(x => extras.includes(x.slug)).reduce((s, x) => s + x.price, 0);
  const total = base + addonSum + extraSum;
  const photos = t.noimg ? [] : [t.img, ...GALLERY.filter(g => g !== t.img).slice(15, 18)];
  const [ph, setPh] = useState(0);

  useEffect(() => { document.body.classList.add('pdp-page'); return () => document.body.classList.remove('pdp-page'); }, []);

  const book = go => {
    const opt = [variant?.label, ...(t.addons || []).filter(a => addons.includes(a.id)).map(a => `+ ${a.label}`)].filter(Boolean).join(' ');
    add({ kind: 'treatment', id: t.slug + (v ? ':' + v : ''), slug: t.slug, name: t.name, opt, price: base + addonSum, img: t.img ? sq(t.img, 300) : null });
    extraList.filter(x => extras.includes(x.slug)).forEach(x => add({ kind: 'treatment', id: x.slug, slug: x.slug, name: x.name, opt: '', price: x.price, img: x.img ? sq(x.img, 300) : null }));
    if (go) router.push('/afrekenen'); else openCart();
  };
  const toggle = (list, set, id) => set(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);

  return (
    <div className="pdp">
      <div className="pgal">
        {t.noimg ? (
          <div className="pmono"><img src={img('image-high-2egkau.png', 'height=240')} alt="" /><b>{t.name}</b></div>
        ) : (
          <>
            <div className="pmain"><Img src={img(photos[ph], 'crop=1%3A1&width=1000')} alt={t.name} eager /></div>
            <div className="pthumbs">{photos.map((p, i) => <button key={p} className={ph === i ? 'on' : ''} onClick={() => setPh(i)} aria-label={`Foto ${i + 1}`}><img src={sq(p, 200)} alt="" loading="lazy" /></button>)}</div>
          </>
        )}
      </div>
      <div className="pinfo">
        <span className="eyebrow">{t.cat === 'brow-lash' ? 'Brow & lashbar' : 'Nagels'}</span>
        <h1>{t.name}</h1>
        <div className="pprice">{eur(total)}{t.variants && total === fromPrice(t) && <small> vanaf</small>}</div>
        <p className="lead">{t.short}</p>

        {t.variants && (
          <div className="pblock">
            <div className="plabel">Kies je behandeling</div>
            {t.variants.map(x => (
              <label key={x.id} className={`choice ${v === x.id ? 'on' : ''}`}>
                <input type="radio" name="variant" checked={v === x.id} onChange={() => setV(x.id)} />
                <span><b>{x.label}</b></span><span className="ic">{eur(x.price)}</span>
              </label>
            ))}
          </div>
        )}
        {t.addons && (
          <div className="pblock">
            <div className="plabel">Optie</div>
            {t.addons.map(a => (
              <label key={a.id} className={`choice ${addons.includes(a.id) ? 'on' : ''}`}>
                <input type="checkbox" checked={addons.includes(a.id)} onChange={() => toggle(addons, setAddons, a.id)} />
                <span><b>{a.label}</b></span><span className="ic">+ {eur(a.price)}</span>
              </label>
            ))}
          </div>
        )}
        {extraList.length > 0 && (
          <div className="pblock">
            <div className="plabel">Maak het compleet <span className="muted">(optioneel)</span></div>
            <div className="xgrid">
              {extraList.map(x => (
                <label key={x.slug} className={`xopt ${extras.includes(x.slug) ? 'on' : ''}`}>
                  <input type="checkbox" checked={extras.includes(x.slug)} onChange={() => toggle(extras, setExtras, x.slug)} />
                  <span>{x.name}</span><b>+ {eur(x.price)}</b>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="pbuy">
          <button className="btn btn-gold" onClick={() => book(true)}>{Icon.cal(18)} Kies datum &amp; tijd · {eur(total)}</button>
          <button className="btn btn-line" onClick={() => book(false)}>{Icon.plus(17)} Aan afspraak toevoegen</button>
        </div>
        <ul className="pperks">
          <li>{Icon.check()} Elke klant heeft een eigen vijlenset</li>
          <li>{Icon.check()} Er wordt hygiënisch gewerkt</li>
          <li>{Icon.check()} Gratis parkeren voor de deur</li>
        </ul>
        {t.desc && (
          <details className="acc" open>
            <summary>Over deze behandeling</summary>
            <div className="desc">{t.desc.map((p, i) => <p key={i}>{p}</p>)}</div>
          </details>
        )}
        <details className="acc">
          <summary>Goed om te weten</summary>
          <div className="desc">
            <p>Vergeet niet, dat je jouw natuurlijke nagels ook moet blijven verzorgen, dit ondanks dat er een product op zit. Dit doe je door je handen regelmatig in te smeren met een goede handcrème en je nagelriemen dagelijks met nagelriemolie in te masseren.</p>
            <p>Er wordt niet met Acryl gewerkt.</p>
          </div>
        </details>
      </div>
      <div className="stickybuy">
        <div><small>Totaal</small><b>{eur(total)}</b></div>
        <button className="btn btn-gold" onClick={() => book(true)}>{Icon.cal(18)} Kies datum &amp; tijd</button>
      </div>
    </div>
  );
}
