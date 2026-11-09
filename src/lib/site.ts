export const site = {
  name: 'R DEV',
  owner: 'Robert Rocha',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://rd-main-project-2026-site.vercel.app').replace(/\/$/, ''),
  phone: '+31 6 28669488',
  phoneHref: 'tel:+31628669488',
  whatsapp: 'https://wa.me/31628669488',
  city: 'Alkmaar',
  region: 'Noord-Holland',
  areas: ['Alkmaar', 'Heiloo', 'Heerhugowaard', 'Castricum', 'Bergen', 'Langedijk', 'Schagen', 'Den Helder'],
  tagline: 'Websites, web apps, SaaS en apps uit Alkmaar'
};

export const waLink = (text: string) => `${site.whatsapp}?text=${encodeURIComponent(text)}`;
