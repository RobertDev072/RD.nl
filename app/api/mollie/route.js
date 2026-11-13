// Mollie-koppeling. Zet MOLLIE_API_KEY in de Vercel-omgeving om echte betalingen aan te zetten.
// Zonder sleutel geeft deze route { demo: true } terug en gebruikt de site de demo-betaalpagina.
import { bySlug, SHIP, SHIP_FREE } from '@/lib/data';
export async function POST(req) {
  const key = process.env.MOLLIE_API_KEY;
  const { lines = [], id, method = 'ideal' } = await req.json().catch(() => ({}));
  // Bedrag altijd op de server opnieuw berekenen, nooit de prijs van de browser vertrouwen.
  const sub = lines.reduce((a, l) => a + (bySlug(l.slug)?.price || 0) * Math.max(1, Math.min(20, l.q | 0)), 0);
  if (!sub) return Response.json({ error: 'Lege bestelling' }, { status: 400 });
  const total = sub + (sub >= SHIP_FREE ? 0 : SHIP);
  if (!key) return Response.json({ demo: true, total });
  const origin = new URL(req.url).origin;
  const r = await fetch('https://api.mollie.com/v2/payments', {
    method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: { currency: 'EUR', value: total.toFixed(2) }, description: `BellaMina bestelling ${id}`, method, redirectUrl: `${origin}/bedankt?id=${encodeURIComponent(id)}`, webhookUrl: `${origin}/api/mollie/webhook`, metadata: { id } })
  });
  const j = await r.json();
  if (!r.ok) return Response.json({ error: j.detail || 'Betaling kon niet worden gestart' }, { status: 502 });
  return Response.json({ checkoutUrl: j._links.checkout.href, total });
}
