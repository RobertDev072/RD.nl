'use client';
import Link from 'next/link';
import { useState } from 'react';
import Logo from './Logo';
import { SITE } from '@/lib/format';
import { useShop } from './ShopProvider';
import { Icon, PayLogos } from './ui';

function Newsletter() {
  const { notify } = useShop();
  const [v, setV] = useState('');
  return (
    <section className="news">
      <div className="wrap">
        <div>
          <h2>Blijf op de hoogte</h2>
          <p>Ontvang als eerste kortingen en aanbiedingen, productnieuws en praktisch haaradvies van JeHaarwinkel.</p>
        </div>
        <form onSubmit={e => { e.preventDefault(); setV(''); notify('Preview: aanmelden werkt in de echte webshop, er is niets verstuurd.'); }}>
          <label className="sr" htmlFor="nl">E-mailadres</label>
          <input id="nl" className="input" type="email" value={v} onChange={e => setV(e.target.value)} placeholder="E-mailadres" autoComplete="off" />
          <button className="btn btn-primary">Aanmelden</button>
        </form>
      </div>
    </section>
  );
}

export default function Footer({ nav }) {
  return (
    <>
      <Newsletter />
      <footer className="footer">
        <div className="wrap">
          <div className="fgrid">
            <div>
              <Logo h={26} light />
              <p style={{ marginTop: 16, maxWidth: 330 }}>Nederlandse webshop voor professionele haarverzorging, styling en kleurproducten. Vanuit Alkmaar geleverd in heel Nederland en België.</p>
              <div className="fcontact">
                <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener">{Icon.chat(18)} WhatsApp {SITE.phone}</a>
                <a href={`mailto:${SITE.email}`}>{Icon.mail(18)} {SITE.email}</a>
              </div>
              <a href={SITE.wwkUrl} target="_blank" rel="noopener" className="wwk"><img src={SITE.wwk} alt="WebwinkelKeur" loading="lazy" /></a>
            </div>
            <div><h4>Shop</h4><ul>
              <li><Link href="/shop">Alle producten</Link></li>
              {nav.tops.map(t => <li key={t.slug}><Link href={`/categorie/${t.slug}`}>{t.label}</Link></li>)}
              <li><Link href="/merken">Merken</Link></li>
              <li><Link href="/aanbiedingen">Aanbiedingen</Link></li>
            </ul></div>
            <div><h4>Klantenservice</h4><ul>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/verzending">Verzending</Link></li>
              <li><Link href="/retourneren">Retourneren</Link></li>
              <li><Link href="/betaalmethodes">Betaalmethodes</Link></li>
              <li><Link href="/garantie-klachten">Garantie &amp; klachten</Link></li>
            </ul></div>
            <div><h4>JeHaarwinkel</h4><ul>
              <li><Link href="/over-jehaarwinkel">Over JeHaarwinkel</Link></li>
              <li><Link href="/advies">Haaradvies</Link></li>
              <li><a href={`${SITE.live}/algemene-voorwaarden/`} target="_blank" rel="noopener">Algemene voorwaarden</a></li>
              <li><a href={`${SITE.live}/privacybeleid/`} target="_blank" rel="noopener">Privacybeleid</a></li>
            </ul></div>
            <div><h4>Bedrijfsgegevens</h4>
              <p className="fcomp">{SITE.company}<br />JeHaarwinkel.nl<br />{SITE.street}<br />{SITE.zip}<br />KvK: {SITE.kvk}<br />BTW: {SITE.btw}</p>
            </div>
          </div>
          <PayLogos />
          <div className="fbot">
            <span>© 2026 JeHaarwinkel.nl</span>
            <span>Concept &amp; ontwerp: <a href="https://lorvex.nl" target="_blank" rel="noopener" style={{ color: '#fff' }}>Lorvex</a></span>
          </div>
        </div>
      </footer>
    </>
  );
}
