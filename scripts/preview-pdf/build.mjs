// Bouwt een presentatie-PDF (A4 liggend) van de preview
import { chromium } from 'playwright';
import QRCode from 'qrcode';
import fs from 'fs';
const LIVE = 'https://jehaarwinkel-concept.vercel.app';
const LOGO = 'https://www.jehaarwinkel.nl/wp-content/uploads/2026/09/cropped-Logo-jehaarwinkel-900x191.png';
const has = n => fs.existsSync(`/vercel/p/s/${n}.jpg`);
const qr = await QRCode.toDataURL(LIVE, { margin: 1, width: 360, color: { dark: '#1d1718', light: '#ffffff' } });
const D = (n, cls = '') => has(n) ? `<div class="bw ${cls}"><div class="bar"><i></i><i></i><i></i><span>jehaarwinkel.nl</span></div><img src="s/${n}.jpg"></div>` : '';
const M = (n, cls = '') => has(n) ? `<div class="ph ${cls}"><img src="s/${n}.jpg"></div>` : '';
const page = (num, eyebrow, title, text, visual, extra = '') => `
<section class="pg"><div class="tx"><span class="eb">${eyebrow}</span><h2>${title}</h2>${text}${extra}</div><div class="vis">${visual}</div><footer><img src="${LOGO}"><span>Ontwerpvoorstel webshop · Lorvex · ${num}</span></footer></section>`;
const ul = a => `<ul>${a.map(x => `<li>${x}</li>`).join('')}</ul>`;
const pages = [
`<section class="pg cover"><div class="tx"><img class="lg" src="${LOGO}"><span class="eb">Ontwerpvoorstel · november 2026</span><h1>Een nieuwe webshop voor <em>JeHaarwinkel</em></h1><p class="lead">Modern, rustig en vrouwelijk, met jullie eigen logo, teksten en producten. Gebouwd om op mobiel net zo makkelijk te bestellen als in een app.</p><div class="by">Gemaakt door <b>Lorvex</b> · Alkmaar</div></div><div class="vis">${D('d-home', 'big')}${M('m-home', 'over')}</div></section>`,
page(2, 'In het kort', 'Wat de nieuwe webshop doet', ul([
  '<b>Jullie eigen huisstijl</b>: het logo en de teksten van jehaarwinkel.nl, in een rustig en vrouwelijk design.',
  '<b>Live gekoppeld aan jullie WooCommerce</b>: producten, prijzen, voorraad en aanbiedingen worden automatisch bijgewerkt.',
  '<b>Werkt als een app op mobiel</b>: onderbalk, vaste koopknop en winkelmand die van onder omhoog schuift.',
  '<b>Zoeken met directe suggesties</b> en filters op categorie, merk, prijs, aanbieding en voorraad.',
  '<b>Snel bekijken en varianten kiezen</b> zonder de pagina te verlaten, plus verlanglijst en recent bekeken.',
  '<b>Haaradvies vanuit de kapsalon</b> in een paar stappen, met directe links naar passende producten.',
  '<b>Afrekenen op één overzichtelijke pagina</b> met iDEAL | Wero, Klarna, creditcard en Bancontact via Mollie.',
  '<b>Snel en goed vindbaar</b>: pagina\'s worden vooraf opgebouwd, wat prettig is voor bezoekers en voor Google.'
]), `${M('m-home2', 'solo')}${M('m-shop', 'solo')}`),
page(3, 'Homepage', 'Een sterke eerste indruk', '<p>Grote beelden van Artistique Core Lab, duidelijke categorieën en direct de populaire producten. De vaste voordelen staan meteen in beeld: voor 16:00 besteld, zelfde dag verzonden en gratis verzending vanaf €30.</p>', `${D('d-home2', 'big')}${M('m-home2', 'over')}`),
page(4, 'Navigatie & zoeken', 'Alles snel te vinden', '<p>Een overzichtelijk menu per categorie met alle productlijnen. Tijdens het typen verschijnen direct producten met foto en prijs, op desktop en op mobiel.</p>', `${D('d-mega', 'half t')}${D('d-search', 'half b')}${M('m-search', 'over')}`),
page(5, 'Shop', 'Filteren zoals de klant dat wil', '<p>Filter op categorie, merk, prijs, aanbiedingen en voorraad. Op mobiel opent het filter als een paneel van onderen, met in één tik het aantal resultaten.</p>', `${D('d-shop', 'big')}${M('m-filter', 'over')}`),
page(6, 'Productpagina', 'Alle informatie, één duidelijke knop', '<p>Grote foto\'s, varianten als knoppen, voorraad, een aftelklok tot 16:00 en de productinformatie uit WooCommerce. Op mobiel blijft de koopknop altijd in beeld.</p>', `${D('d-pdp', 'big')}${M('m-pdp', 'over')}`),
page(7, 'Snel bekijken', 'Bestellen zonder zoeken', '<p>Vanuit elke productlijst een variant kiezen en toevoegen, zonder de pagina te verlaten. Met het hartje bewaart de klant producten op de verlanglijst.</p>', `${D('d-quick', 'big')}${M('m-quick', 'over')}`),
page(8, 'Winkelmand & afrekenen', 'Kort en duidelijk naar de betaling', '<p>De winkelmand laat zien hoeveel er nog nodig is voor gratis verzending. Afrekenen gebeurt op één pagina met Nederland of België, verzendkosten volgens jullie tarieven en betalen via Mollie.</p>', `${D('d-cart', 'half t')}${D('d-checkout', 'half b')}${M('m-checkout', 'over')}`),
page(9, 'Haaradvies', 'Advies vanuit de kapsalon, online', '<p>De klant kiest een doel en een behoefte en krijgt jullie advies met de passende productsoorten en producten. Zo wordt jullie vakkennis direct omzet.</p>', `${D('d-advies', 'big')}${M('m-menu', 'over')}`),
`<section class="pg end"><div class="tx"><span class="eb">Volgende stap</span><h2>Bekijk de preview zelf</h2><p class="lead">Open de link of scan de code met je telefoon. Alles is klikbaar, van zoeken tot afrekenen. Bestellingen worden in de preview niet verwerkt.</p><a class="link">${LIVE.replace('https://', '')}</a>
<ol><li>Preview bekijken en feedback geven</li><li>Laatste aanpassingen in tekst en beeld</li><li>Koppelen aan jullie WooCommerce en Mollie</li><li>Live op jehaarwinkel.nl</li></ol>
<div class="ct"><b>Lorvex</b> · Robert · 06 28669488 · lorvex.nl</div></div><div class="vis qr"><img src="${qr}"><span>Scan om de preview te openen</span></div><footer><img src="${LOGO}"><span>Ontwerpvoorstel webshop · Lorvex · 10</span></footer></section>`
];
const css = `
@page{size:297mm 210mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Jost',sans-serif;color:#1d1718;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:297mm;height:210mm;position:relative;overflow:hidden;background:#fbf7f3;display:grid;grid-template-columns:96mm 1fr;gap:10mm;padding:16mm 14mm 18mm 16mm;page-break-after:always;break-after:page}
.pg:nth-child(even){background:#f4e8e1}
.tx{display:flex;flex-direction:column;justify-content:center;gap:5mm}
.eb{font-size:8.5pt;letter-spacing:.24em;text-transform:uppercase;color:#9c6457;font-weight:500}
h1,h2{font-family:'Cormorant Garamond',serif;font-weight:600;line-height:1.05}
h1{font-size:36pt}h2{font-size:27pt}
h1 em{color:#9c6457}
p{font-size:10.5pt;line-height:1.6;color:#4f4542}
.lead{font-size:12pt}
ul{list-style:none;display:grid;gap:2.6mm}
ul li{font-size:9.6pt;line-height:1.45;color:#4f4542;padding-left:5mm;position:relative}
ul li:before{content:'';position:absolute;left:0;top:1.8mm;width:2mm;height:2mm;border-radius:50%;background:#c08a7d}
ul b{color:#1d1718;font-weight:600}
.vis{position:relative;display:flex;align-items:center;justify-content:center}
.bw{border-radius:3mm;overflow:hidden;background:#fff;box-shadow:0 6mm 14mm -6mm rgba(29,23,24,.35);border:.3mm solid #e6dbd3}
.bw .bar{height:7mm;background:#f1ebe6;display:flex;align-items:center;gap:1.4mm;padding:0 3mm}
.bw .bar i{width:2.2mm;height:2.2mm;border-radius:50%;background:#d9cdc5}
.bw .bar span{margin-left:4mm;background:#fff;border-radius:3mm;font-size:6.5pt;color:#8a7d78;padding:.6mm 6mm}
.bw img{display:block;width:100%}
.bw.big{width:100%;margin-right:20mm}
.bw.half{position:absolute;width:78%}
.bw.half.t{left:0;top:0}.bw.half.b{right:12mm;bottom:0}
.ph{width:44mm;border-radius:7mm;overflow:hidden;border:2.2mm solid #1d1718;background:#1d1718;box-shadow:0 6mm 14mm -5mm rgba(0,0,0,.45)}
.ph img{display:block;width:100%;border-radius:4.6mm}
.ph.over{position:absolute;right:0;bottom:-6mm;z-index:2}
.ph.solo{margin:0 4mm;width:52mm}
.cover{grid-template-columns:110mm 1fr;background:#fbf7f3!important}
.cover .lg{width:62mm;mix-blend-mode:multiply;margin-bottom:6mm}
.cover .by{font-size:10pt;color:#7a6d69;margin-top:4mm}
.cover .by b{color:#1d1718}
footer{position:absolute;left:16mm;right:14mm;bottom:7mm;display:flex;justify-content:space-between;align-items:center;font-size:7.5pt;color:#8a7d78}
footer img{height:4mm;mix-blend-mode:multiply}
.end .link{font-family:'Cormorant Garamond',serif;font-size:20pt;color:#9c6457;border-bottom:.4mm solid #c08a7d;align-self:flex-start}
.end ol{padding-left:5mm;display:grid;gap:2mm;font-size:10.5pt;color:#4f4542}
.end .ct{margin-top:4mm;font-size:10.5pt;background:#fff;border-radius:3mm;padding:4mm 5mm;border:.3mm solid #e6dbd3}
.qr{flex-direction:column;gap:5mm}
.qr img{width:70mm;border-radius:4mm;background:#fff;padding:4mm;box-shadow:0 6mm 14mm -6mm rgba(29,23,24,.35)}
.qr span{font-size:10pt;color:#7a6d69}
`;
const html = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&family=Jost:wght@400;500;600&display=swap" rel="stylesheet"><style>${css}</style></head><body>${pages.join('')}</body></html>`;
fs.writeFileSync('/vercel/p/deck.html', html);
const b = await chromium.launch(); const p = await b.newPage();
await p.goto('file:///vercel/p/deck.html', { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
fs.mkdirSync('/vercel/p/out', { recursive: true });
await p.pdf({ path: '/vercel/p/out/JeHaarwinkel-webshop-preview.pdf', width: '297mm', height: '210mm', printBackground: true, preferCSSPageSize: true });
await p.setViewportSize({ width: 1123, height: 794 });
for (const i of [0, 3]) { await p.evaluate(k => document.querySelectorAll('.pg')[k].scrollIntoView(), i); await p.screenshot({ path: `/vercel/p/out/pg${i}.jpg`, type: 'jpeg', quality: 35, clip: await p.evaluate(k => { const r = document.querySelectorAll('.pg')[k].getBoundingClientRect(); return { x: 0, y: r.top + scrollY, width: r.width, height: r.height }; }, i), fullPage: true }); }
await b.close();
console.log('pdf', fs.statSync('/vercel/p/out/JeHaarwinkel-webshop-preview.pdf').size);
