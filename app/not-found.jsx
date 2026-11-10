import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="wrap" style={{ padding: '60px 16px' }}>
      <div className="empty">
        <h2>Deze pagina bestaat niet (meer)</h2>
        <p>Misschien is het product verplaatst. Zoek verder in de shop.</p>
        <Link href="/shop" className="btn btn-primary">Naar de shop</Link>
      </div>
    </div>
  );
}
