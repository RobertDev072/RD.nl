import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="stripe" />
      <div className="wrap">
        <div className="fgrid">
          <div>
            <div className="logo" style={{ marginBottom: 10 }}>
              <img src="/logo.webp" alt="" width="50" height="48" />
              <span><b>Hewitt &amp; Hewitt</b><small>Authentic Surinamese Food</small></span>
            </div>
            <p style={{ fontSize: 14 }}>Authentiek Surinaams eten uit onze foodtruck, voor Oterleek en omgeving.</p>
          </div>
          <div><h4>Contact</h4><ul>
            <li><a href="tel:+31621262725">06-21262725</a></li>
            <li><a href="https://wa.me/31621262725" target="_blank" rel="noopener">WhatsApp</a></li>
            <li><a href="mailto:info@hewitt-hewitt.nl">info@hewitt-hewitt.nl</a></li>
          </ul></div>
          <div><h4>Bestellen</h4><ul>
            <li><Link href="/#menu">Menu</Link></li>
            <li><Link href="/#bezorging">Bezorgen &amp; afhalen</Link></li>
            <li><Link href="/afrekenen">Afrekenen</Link></li>
          </ul></div>
          <div><h4>Bezorgtijden</h4><ul><li>Vrijdag 11:00–22:00</li><li>Zaterdag 11:00–22:00</li><li>Zondag 11:00–22:00</li></ul></div>
        </div>
        <div className="fbot"><span>© 2026 Hewitt &amp; Hewitt Authentic Surinamese Food</span><span>Ontwerp &amp; ontwikkeling: <a href="https://lorvex.nl" target="_blank" rel="noopener">Lorvex</a></span></div>
      </div>
    </footer>
  );
}
