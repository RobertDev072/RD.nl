// Haalt bij het bouwen de presentatie-PDF op, zodat hij vast op de site staat (/JeHaarwinkel-webshop-preview.pdf).
// Lukt dat niet, dan gaat de build gewoon door zonder PDF.
import fs from 'fs';
const src = process.env.PREVIEW_PDF_SRC || 'https://sb-4drcn5rc1q1l.vercel.run/JeHaarwinkel-webshop-preview.pdf';
try {
  const r = await fetch(src, { signal: AbortSignal.timeout(30000) });
  if (r.ok && (r.headers.get('content-type') || '').includes('pdf')) {
    fs.mkdirSync('public', { recursive: true });
    fs.writeFileSync('public/JeHaarwinkel-webshop-preview.pdf', Buffer.from(await r.arrayBuffer()));
    console.log('preview-pdf opgehaald');
  } else console.log('preview-pdf overgeslagen', r.status);
} catch (e) { console.log('preview-pdf overgeslagen', e.message); }
