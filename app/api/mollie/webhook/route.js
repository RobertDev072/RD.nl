// Mollie roept dit aan bij een statuswijziging. Hier haal je de betaling op en zet je de bestelling op 'betaald'.
export async function POST(req) {
  const id = (await req.formData().catch(() => null))?.get('id');
  const key = process.env.MOLLIE_API_KEY;
  if (id && key) {
    const p = await (await fetch(`https://api.mollie.com/v2/payments/${id}`, { headers: { Authorization: `Bearer ${key}` } })).json();
    console.log('mollie', p.id, p.status, p.metadata?.id); // koppel hier je ordersysteem / e-mail
  }
  return new Response('ok');
}
