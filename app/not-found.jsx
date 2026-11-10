import Link from 'next/link';
export default function NotFound() {
  return <div className="wrap" style={{ padding: '70px 16px' }}><div className="empty"><h2>Deze pagina bestaat niet</h2><p>Bekijk onze behandelingen of ga terug naar home.</p><Link href="/behandelingen" className="btn btn-gold">Behandelingen</Link></div></div>;
}
