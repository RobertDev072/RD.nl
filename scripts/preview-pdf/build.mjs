// Presentatie-PDF (A4 liggend) van de House of Nails-preview
import { chromium } from 'playwright';
import QRCode from 'qrcode';
import fs from 'fs';
const LIVE = 'https://house-of-nails-concept.vercel.app';
const LOGO = 'https://primary.jwwb.nl/public/i/c/q/temp-wiegpodytlkvonnxoysj/image-high-2egkau.png?enable-io=true&enable=upscale&height=320';
const has = n => fs.existsSync(`/vercel/p/h/${n}.jpg`);
const qr = await QRCode.toDataURL(LIVE, { margin: 1, width: 360, color: { dark: '#141110', light: '#ffffff' } });
const D = (n, cls = '') => has(n) ? `<div class="bw ${cls}"><div class="bar"><i></i><i></i><i></i><span>house-of-nails-by-jasmina.nl</span></div><img src="h/${n}.jpg"></div>` : '';
const M = (n, cls = '') => has(n) ? `<div class="ph ${cls}"><img src="h/${n}.jpg"></div>` : '';
let num = 1;
const page = (eyebrow, title, text, visual) => `<section class="pg"><div class="tx"><span class="eb">${eyebrow}</span><h2>${title}</h2>${text}</div><div class="vis">${visual}</div><footer><img src="${LOGO}"><span>Ontwerpvoorstel website · Lorvex · ${++num}</span></footer></section>`;
const ul = a => `<ul>${a.map(x => `<li>${x}</li>`).join('')}</ul>`;
const pages = [
`<section class="pg cover"><div class="tx"><img class="lg" src="${LOGO}"><span class="eb">Ontwerpvoorstel · november 2026</span><h1>Een nieuwe website voor <em>House of Nails</em></h1><p class="lead">Luxe en rustig, met jouw eigen logo, teksten, prijzen, foto's en reviews. Klanten boeken zelf hun behandeling en kopen online een cadeaubon.</p><div class="by">Gemaakt door <b>Lorvex</b> · Alkmaar</div></div><div class="vis">${D('d-home', 'big')}${M('m-home', 'over')}</div></section>`,
page('In het kort', 'Wat de nieuwe website doet', ul([
  '<b>Jouw eigen uitstraling</b>: het gouden logo, je teksten en je foto\'s, in zwart, ivoor en goud.',
  '<b>Zelf een behandeling kiezen</b>: BIAB naturel of kleur, verlenging en extra\'s zoals french, chrome of design, met direct de juiste prijs.',
  '<b>Datum en tijd kiezen</b> binnen jouw openingstijden. Te koppelen aan je huidige boekingssysteem, of als vervanging ervan.',
  '<b>Betalen in de salon of vooraf met iDEAL</b>, net wat jij wilt.',
  '<b>Cadeaubonnen online verkopen</b> met eigen bedrag, ontwerp en persoonlijke tekst.',
  '<b>Prijzen 2026, BIAB-uitleg, fotogalerij en reviews</b> overzichtelijk bij elkaar.',
  '<b>Werkt als een app op de telefoon</b>, met onderbalk en een vaste boekknop.'
]), `${M('m-home2', 'solo')}${M('m-menu', 'solo')}`),
page('Homepage', 'Een luxe eerste indruk', '<p>Je welkomsttekst, wat jouw salon bijzonder maakt (sinds 1995, eigen vijlenset, meer dan 1000 kleuren, gratis parkeren) en direct de populaire behandelingen met prijs.</p>', `${D('d-home2', 'big')}${M('m-home2', 'over')}`),
page('Behandeling kiezen', 'Kiezen, aanvullen en zien wat het kost', '<p>De klant kiest de behandeling, vinkt eventueel verlenging of extra\'s aan en ziet meteen de totaalprijs. Op de telefoon blijft de knop "Kies datum & tijd" altijd in beeld.</p>', `${D('d-detail', 'big')}${M('m-detail', 'over')}`),
page('Online boeken', 'Zelf een datum en tijd kiezen', '<p>Alleen de dagen en tijden waarop de salon open is zijn te kiezen, op zondag niet. Daarna naam, e-mail en telefoon, en betalen in de salon of vooraf.</p>', `${D('d-checkout', 'big')}${M('m-checkout', 'over')}`),
page('Cadeaubonnen', 'Een cadeaubon als webshop', '<p>Bedrag kiezen of zelf invullen, ontwerp in zwart en goud of nude, naam en persoonlijke tekst erbij. Afleveren per e-mail als PDF of ophalen in de salon.</p>', `${D('d-gift', 'big')}${M('m-gift', 'over')}`),
page('Impressie & reviews', 'Laat je werk zien', '<p>Al je foto\'s in een mooie galerij die je kunt vergroten en doorswipen, en de echte reviews van je klanten via Facebook.</p>', `${D('d-impressie', 'half t')}${D('d-home4', 'half b')}${M('m-gallery', 'over')}`),
page('Prijzen & informatie', 'Alles duidelijk op een rij', '<p>De prijslijst 2026 per categorie, waar elke regel direct naar boeken leidt. Plus openingstijden, contact via bellen of WhatsApp en je Instagram en Facebook.</p>', `${D('d-prijzen', 'half t')}${D('d-home5', 'half b')}${M('m-reviews', 'over')}`),
`<section class="pg end"><div class="tx"><span class="eb">Volgende stap</span><h2>Bekijk de preview zelf</h2><p class="lead">Open de link of scan de code met je telefoon. Alles is klikbaar, van behandeling kiezen tot afrekenen. In de preview wordt niets echt geboekt of betaald.</p><a class="link">${LIVE.replace('https://', '')}</a>
<ol><li>Preview bekijken en feedback geven</li><li>Laatste aanpassingen in tekst en beeld</li><li>Koppelen aan je agenda en iDEAL</li><li>Live op house-of-nails-by-jasmina.nl</li></ol>
<div class="ct"><b>Lorvex</b> · Robert · 06 28669488 · lorvex.nl</div></div><div class="vis qr"><img src="${qr}"><span>Scan om de preview te openen</span></div><footer><img src="${LOGO}"><span>Ontwerpvoorstel website · Lorvex · ${++num}</span></footer></section>`
];
const css = `
@page{size:297mm 210mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Jost',sans-serif;color:#efe6db;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:297mm;height:210mm;position:relative;overflow:hidden;background:radial-gradient(900px 500px at 85% 15%,#2a221d,#141110 65%);display:grid;grid-template-columns:96mm 1fr;gap:10mm;padding:16mm 14mm 18mm 16mm;break-after:page}
.pg:nth-child(even){background:#f8f4ee;color:#2a2421}
.tx{display:flex;flex-direction:column;justify-content:center;gap:5mm}
.eb{font-size:8.5pt;letter-spacing:.24em;text-transform:uppercase;color:#c6a15b;font-weight:500}
.pg:nth-child(even) .eb{color:#a7833d}
h1,h2{font-family:'Cormorant Garamond',serif;font-weight:500;line-height:1.05;color:#fff}
.pg:nth-child(even) h2{color:#141110}
h1{font-size:36pt}h2{font-size:28pt}
h1 em{color:#c6a15b}
p{font-size:10.5pt;line-height:1.6;color:#cfc4b8}
.pg:nth-child(even) p{color:#5d534d}
.lead{font-size:12pt}
ul{list-style:none;display:grid;gap:2.8mm}
ul li{font-size:9.8pt;line-height:1.45;color:#5d534d;padding-left:5mm;position:relative}
ul li:before{content:'';position:absolute;left:0;top:1.8mm;width:2mm;height:2mm;border-radius:50%;background:#c6a15b}
ul b{color:#141110;font-weight:600}
.vis{position:relative;display:flex;align-items:center;justify-content:center}
.bw{border-radius:3mm;overflow:hidden;background:#fff;box-shadow:0 8mm 16mm -6mm rgba(0,0,0,.55);border:.3mm solid rgba(198,161,91,.4)}
.bw .bar{height:7mm;background:#1d1917;display:flex;align-items:center;gap:1.4mm;padding:0 3mm}
.bw .bar i{width:2.2mm;height:2.2mm;border-radius:50%;background:#4a403a}
.bw .bar span{margin-left:4mm;background:#2c2622;border-radius:3mm;font-size:6.5pt;color:#b8ac9f;padding:.6mm 6mm}
.bw img{display:block;width:100%}
.bw.big{width:100%;margin-right:20mm}
.bw.half{position:absolute;width:78%}
.bw.half.t{left:0;top:0}.bw.half.b{right:12mm;bottom:0}
.ph{width:44mm;border-radius:7mm;overflow:hidden;border:2.2mm solid #000;background:#000;box-shadow:0 8mm 16mm -5mm rgba(0,0,0,.6)}
.ph img{display:block;width:100%;border-radius:4.6mm}
.ph.over{position:absolute;right:0;bottom:-6mm;z-index:2}
.ph.solo{margin:0 4mm;width:52mm}
.cover{grid-template-columns:110mm 1fr}
.cover .lg{width:70mm;margin-bottom:4mm}
.cover .by{font-size:10pt;color:#b8ac9f;margin-top:4mm}.cover .by b{color:#fff}
footer{position:absolute;left:16mm;right:14mm;bottom:7mm;display:flex;justify-content:space-between;align-items:center;font-size:7.5pt;color:#8e8277}
footer img{height:6mm}
.end .link{font-family:'Cormorant Garamond',serif;font-size:20pt;color:#c6a15b;border-bottom:.4mm solid #c6a15b;align-self:flex-start}
.end ol{padding-left:5mm;display:grid;gap:2mm;font-size:10.5pt;color:#cfc4b8}
.end .ct{margin-top:4mm;font-size:10.5pt;background:#1d1917;border-radius:3mm;padding:4mm 5mm;border:.3mm solid rgba(198,161,91,.4);color:#efe6db}
.qr{flex-direction:column;gap:5mm}
.qr img{width:70mm;border-radius:4mm;background:#fff;padding:4mm}
.qr span{font-size:10pt;color:#b8ac9f}
`;
const html = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;1,500&family=Jost:wght@400;500;600&display=swap" rel="stylesheet"><style>${css}</style></head><body>${pages.join('')}</body></html>`;
fs.writeFileSync('/vercel/p/hdeck.html', html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1123, height: 794 } });
await p.goto('file:///vercel/p/hdeck.html', { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
const chk = await p.evaluate(() => [...document.querySelectorAll('.pg')].map((pg, i) => { const R = pg.getBoundingClientRect(); const tx = pg.querySelector('.tx'); const bad = []; if (tx.scrollHeight > tx.clientHeight + 2) bad.push('tx'); pg.querySelectorAll('.bw,.ph').forEach(e => { const r = e.getBoundingClientRect(); if (r.right > R.right + 1 || r.bottom > R.bottom + 1 || r.top < R.top - 1) bad.push(e.className); }); const broken = [...pg.querySelectorAll('img')].filter(i => !i.naturalWidth).length; return i + ':' + broken + ':' + bad.join(','); }).join(' '));
fs.mkdirSync('/vercel/p/out', { recursive: true });
await p.pdf({ path: '/vercel/p/out/House-of-Nails-website-preview.pdf', width: '297mm', height: '210mm', printBackground: true, preferCSSPageSize: true });
await b.close();
console.log('check', chk, 'pdf', fs.statSync('/vercel/p/out/House-of-Nails-website-preview.pdf').size);
