// Gedeelde helpers (veilig in browser en server)
export const eur = c => '€ ' + (c / 100).toFixed(2).replace('.', ',');
export const pct = (price, regular) => regular > price ? Math.round((1 - price / regular) * 100) : 0;

// Verzending zoals op jehaarwinkel.nl/verzending
export const SHIPPING = {
  NL: { label: 'Nederland', cost: 489, free: 3000, eta: 'Meestal de volgende werkdag in huis' },
  BE: { label: 'België', cost: 899, free: 7500, eta: 'Meestal binnen 2 werkdagen in huis' }
};
export const shippingFor = (country, subtotal) => {
  const s = SHIPPING[country] || SHIPPING.NL;
  return subtotal >= s.free ? 0 : s.cost;
};

export const PAYMENTS = [
  { id: 'ideal', label: 'iDEAL | Wero', sub: 'Direct betalen via je eigen bank' },
  { id: 'card', label: 'Creditcard of debitcard', sub: 'Visa, Mastercard, Maestro' },
  { id: 'klarna', label: 'Klarna', sub: 'Achteraf betalen, afhankelijk van je bestelling' },
  { id: 'bancontact', label: 'Bancontact', sub: 'Alleen met een Belgische bankrekening', country: 'BE' }
];

const UP = 'https://www.jehaarwinkel.nl/wp-content/uploads/2026/09/';
export const SITE = {
  name: 'JeHaarwinkel',
  email: 'info@jehaarwinkel.nl',
  phone: '06-82068054',
  whatsapp: '31682068054',
  company: 'Rietveld E-commerce',
  street: 'Wytemalaan 2',
  zip: '1814 GW Alkmaar',
  address: 'Wytemalaan 2, 1814 GW Alkmaar',
  kvk: '42082682',
  btw: 'NL002967150B17',
  live: 'https://www.jehaarwinkel.nl',
  logo: UP + 'cropped-Logo-jehaarwinkel-900x191.png',
  logoSet: `${UP}cropped-Logo-jehaarwinkel-300x64.png 300w, ${UP}cropped-Logo-jehaarwinkel-768x163.png 768w, ${UP}cropped-Logo-jehaarwinkel-900x191.png 900w`,
  icon32: UP + 'cropped-ChatGPT-Image-14-sep-2026-19_01_15-32x32.png',
  icon180: UP + 'cropped-ChatGPT-Image-14-sep-2026-19_01_15-180x180.png',
  icon192: UP + 'cropped-ChatGPT-Image-14-sep-2026-19_01_15-192x192.png',
  wwk: 'https://dashboard.webwinkelkeur.nl/banners/67/1211559/1786746691000.svg',
  wwkUrl: 'https://www.webwinkelkeur.nl/webshop/jehaarwinkel_1211559',
  img: {
    heroDesk: UP + 'artistique-core-lab-hero-jehaarwinkel-desktop.webp',
    heroMob: UP + 'artistique-core-lab-hero-jehaarwinkel-mobile-768x960.webp',
    verzorging: UP + 'haarverzorging-desktop-900x600.webp',
    styling: UP + 'haarstyling-desktop-900x600.webp',
    kleur: UP + 'kleur-toning-desktop-900x600.webp'
  }
};
export const USPS = ['Voor 16:00 besteld, zelfde werkdag verzonden', 'Gratis verzending vanaf €30', 'Advies vanuit de kapsalon'];
