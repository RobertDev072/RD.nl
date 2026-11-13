// Haalt bij het bouwen de foto's van de huidige BellaMina-site op (daar staan ze inline als data-URI) en zet ze in public/img/0..13.jpg.
// Lukt dat niet, dan gaat de build door en tonen de kaarten een nette kleurvlak-fallback.
import fs from 'fs';
const src = process.env.BELLAMINA_SRC || 'https://bellamina-vercel.vercel.app/';
try {
  const h = await (await fetch(src, { signal: AbortSignal.timeout(30000) })).text();
  const m = [...h.matchAll(/<img[^>]*?src="data:image\/(\w+);base64,([^"]+)"/g)];
  fs.mkdirSync('public/img', { recursive: true });
  m.forEach(([, , b], i) => fs.writeFileSync(`public/img/${i}.jpg`, Buffer.from(b, 'base64')));
  console.log('fotos opgehaald:', m.length);
} catch (e) { console.log('fotos overgeslagen', e.message); }
