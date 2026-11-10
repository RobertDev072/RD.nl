import Link from 'next/link';
import { SITE, HOURS } from '@/lib/data';
import Logo from './Logo';
import { Icon } from './icons';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="fgrid">
          <div>
            <Logo h={64} />
            <p style={{ marginTop: 14, maxWidth: 320 }}>Sinds 1995 een gecertificeerd Natural Nail Treatment salon in {SITE.place}, voor professionele verzorging van uw natuurlijke nagels en handen.</p>
            <div className="fsoc"><a href={SITE.instagram} target="_blank" rel="noopener" aria-label="Instagram">{Icon.insta()}</a><a href={SITE.facebook} target="_blank" rel="noopener" aria-label="Facebook">{Icon.fb()}</a></div>
          </div>
          <div><h4>Salon</h4><ul>
            <li><Link href="/behandelingen">Behandelingen</Link></li><li><Link href="/prijzen">Prijzen 2026</Link></li><li><Link href="/biab">Wat is BIAB?</Link></li>
            <li><Link href="/impressie">Kleine impressie</Link></li><li><Link href="/reviews">Reviews</Link></li><li><Link href="/cadeaubon">Cadeaubon</Link></li>
          </ul></div>
          <div><h4>Openingstijden</h4><ul className="fhours">{HOURS.map(([d, t]) => <li key={d}><span>{d}</span><span>{t}</span></li>)}</ul></div>
          <div><h4>Contact</h4><ul>
            <li><a href={`tel:${SITE.tel}`}>{Icon.phone(16)} {SITE.phone}</a></li>
            <li><a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener">{Icon.chat(16)} WhatsApp</a></li>
            <li>{Icon.pin(16)} {SITE.place}</li>
            <li className="muted2">KVK {SITE.kvk}</li>
          </ul></div>
        </div>
        <div className="fbot"><span>© 2022 – 2026 House of Nails by Jasmina</span><span>Concept &amp; ontwerp: <a href="https://lorvex.nl" target="_blank" rel="noopener">Lorvex</a></span></div>
      </div>
    </footer>
  );
}
