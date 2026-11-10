import Link from 'next/link';
import { SITE, USPS, TREATMENTS, GALLERY, REVIEWS, BRANDS, HOURS, TECHNIQUES, sq, img } from '@/lib/data';
import TreatmentCard from '@/components/TreatmentCard';
import Reviews from '@/components/Reviews';
import { Icon } from '@/components/icons';

export default function Home() {
  const popular = TREATMENTS.filter(t => t.popular);
  return (
    <>
      <section className="hero">
        <div className="wrap hero-in">
          <div className="hero-t">
            <span className="eyebrow">Natural Nail Treatment salon · sinds 1995</span>
            <h1>Welkom bij <em>House of Nails</em></h1>
            <p className="lead">House of Nails is sinds 1995 een gecertificeerd Natural Nail Treatment salon in Heerhugowaard (de Noord) waar u terecht kunt voor professionele verzorging van uw natuurlijke nagels en handen.</p>
            <div className="cta">
              <Link href="/behandelingen" className="btn btn-gold">{Icon.cal(18)} Boek je afspraak</Link>
              <Link href="/prijzen" className="btn btn-ghost">Prijzen 2026</Link>
            </div>
            <div className="hero-r"><span className="stars">{[1, 2, 3, 4, 5].map(i => <span key={i}>{Icon.star(15)}</span>)}</span> {REVIEWS.length}+ lovende reviews via Facebook</div>
          </div>
          <div className="hero-v" aria-hidden="true">
            <div className="arch main"><img src={SITE.welcome} alt="" loading="eager" fetchPriority="high" /></div>
            <div className="arch s1"><img src={sq(GALLERY[0], 400)} alt="" /></div>
            <div className="arch s2"><img src={sq(GALLERY[5], 400)} alt="" /></div>
            <span className="ring" />
          </div>
        </div>
      </section>

      <div className="usps"><div className="wrap">
        {USPS.map(([b, s]) => <div key={b}><span className="ui">{Icon.spark(18)}</span><span><b>{b}</b><small>{s}</small></span></div>)}
      </div></div>

      <section>
        <div className="wrap">
          <div className="shead"><div><span className="eyebrow">Behandelingen</span><h2>Kies je behandeling</h2></div><Link href="/behandelingen" className="more">Alle behandelingen</Link></div>
          <div className="tgrid">{popular.map(t => <TreatmentCard key={t.slug} t={t} />)}</div>
        </div>
      </section>

      <section className="dark">
        <div className="wrap split">
          <div className="split-v"><img src={img(GALLERY[13], 'width=900')} alt="BIAB nagels" loading="lazy" /></div>
          <div>
            <span className="eyebrow">Wat is BIAB?</span>
            <h2>Sterke, natuurlijke nagels met BIAB</h2>
            <p>BIAB is simpel gezegd de afkorting van Builder In A Bottle. Gel in een flesje op basis van rubber met een extreme hechting en wat flexibeler is dan Acryl, maar stukken steviger dan gellac.</p>
            <p>Met deze gel kan je de natuurlijke nagel opbouwen zodat deze er weer prachtig en natuurlijk uitziet. Het biedt stevigheid en het breken of scheuren van je nagels zal minimaal tot niet zijn.</p>
            <ul className="ticks">
              <li>{Icon.check()} Elke klant heeft een eigen vijlenset</li>
              <li>{Icon.check()} Er wordt hygiënisch gewerkt</li>
              <li>{Icon.check()} Ruim 20 kleuren BIAB, meer dan 1000 kleuren gellac</li>
              <li>{Icon.check()} Er wordt niet met Acryl gewerkt</li>
            </ul>
            <div className="cta"><Link href="/biab" className="btn btn-gold">Lees meer over BIAB</Link><Link href="/behandelingen/biab-nieuwe-set" className="btn btn-ghost">Boek BIAB</Link></div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="shead"><div><span className="eyebrow">Kleine impressie</span><h2>Uit de salon</h2></div><Link href="/impressie" className="more">Bekijk alle foto's</Link></div>
          <div className="mosaic">
            {GALLERY.slice(6, 14).map((g, i) => <Link key={g} href={`/impressie#${i + 6}`} className={`mo m${i}`}><img src={sq(g, 500)} alt="Nagels van House of Nails" loading="lazy" /></Link>)}
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="giftband">
            <div>
              <span className="eyebrow">Cadeau geven</span>
              <h2>Verras iemand met een cadeaubon</h2>
              <p>Te besteden aan alle behandelingen in de salon. Direct online te bestellen, per e-mail of op te halen in de salon.</p>
              <Link href="/cadeaubon" className="btn btn-gold">{Icon.gift(18)} Bestel een cadeaubon</Link>
            </div>
            <div className="giftcard"><img src={SITE.logo} alt="" /><span>Cadeaubon</span><b>€ 50,-</b></div>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="shead"><div><span className="eyebrow">Reviews via Facebook</span><h2>Wat klanten zeggen</h2></div><Link href="/reviews" className="more">Alle reviews</Link></div>
          <Reviews items={REVIEWS.slice(0, 8)} />
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="info3">
            <div className="ibox">
              <span className="eyebrow">Behandelingen</span>
              <h3>Er zijn diverse behandelingen mogelijk</h3>
              <ul className="dots">{TECHNIQUES.map(t => <li key={t}>{t}</li>)}</ul>
              <p className="muted">Er wordt niet met Acryl gewerkt.</p>
              <div className="brands">{BRANDS.map(b => <span key={b}>{b}</span>)}</div>
            </div>
            <div className="ibox">
              <span className="eyebrow">Openingstijden</span>
              <h3>Wanneer ben je welkom?</h3>
              <ul className="hours">{HOURS.map(([d, t]) => <li key={d} className={t === 'Gesloten' ? 'closed' : ''}><span>{d}</span><span>{t}</span></li>)}</ul>
            </div>
            <div className="ibox gold">
              <span className="eyebrow">Tot snel in de salon!</span>
              <h3>Weet je nog niet precies wat je wilt?</h3>
              <p>Stel je vraag via WhatsApp of bel. Een vriendelijke groet, Jasmina</p>
              <div className="ibtns">
                <Link href="/behandelingen" className="btn btn-dark btn-block">{Icon.cal(18)} Boek je afspraak</Link>
                <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn btn-line btn-block">{Icon.chat(18)} WhatsApp</a>
                <a href={`tel:${SITE.tel}`} className="btn btn-line btn-block">{Icon.phone(18)} {SITE.phone}</a>
              </div>
              <p className="small">{Icon.pin(15)} {SITE.place} · Gratis parkeren voor de deur</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
