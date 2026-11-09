export const site = {
  name: 'Lorvex',
  legalName: 'Lorvex',
  slogan: 'AI Tech Company',
  owner: 'Robert Rocha',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://lorvex.nl').replace(/\/$/, ''),
  phone: '+31 6 28669488',
  phoneHref: 'tel:+31628669488',
  whatsapp: 'https://wa.me/31628669488',
  city: 'Alkmaar',
  region: 'Noord-Holland',
  areas: ['Alkmaar', 'Heiloo', 'Heerhugowaard', 'Castricum', 'Bergen', 'Langedijk', 'Schagen', 'Den Helder'],
  tagline: 'Websites, web apps, SaaS, apps en AI-automatisering uit Alkmaar',
  description: 'Lorvex is een AI tech company uit Alkmaar. We bouwen websites, web apps, SaaS, apps en AI-oplossingen voor ondernemers in Noord-Holland. Werk vanaf €100, geen contracten.',
  geo: { lat: 52.6324, lng: 4.7534 }
};

export const waLink = (text: string) => `${site.whatsapp}?text=${encodeURIComponent(text)}`;
