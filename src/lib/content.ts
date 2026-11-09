export type IconName = 'monitor' | 'app' | 'layers' | 'phone' | 'sparkles' | 'search' | 'server';

export type Service = {
  slug: string;
  icon: IconName;
  title: string;
  menu: string;
  short: string;
  seoTitle: string;
  seoDescription: string;
  headline: string;
  intro: string;
  features: { title: string; text: string }[];
  includes: string[];
  faq: { q: string; a: string }[];
  projects: string[];
};

export const services: Service[] = [
  {
    slug: 'websites-laten-maken',
    icon: 'monitor',
    title: 'Websites',
    menu: 'Website laten maken',
    short: 'Snelle, strakke sites die bezoekers laten bellen, boeken of kopen.',
    seoTitle: 'Website laten maken in Alkmaar',
    seoDescription: 'Website laten maken in Alkmaar? R DEV bouwt snelle, moderne websites die goed vindbaar zijn in Google. Werk vanaf €100, geen contracten.',
    headline: 'Een website die klanten oplevert.',
    intro: 'Geen sjabloon met jouw logo erop, maar een site die past bij je zaak. Mobiel eerst, razendsnel en gebouwd om van bezoekers klanten te maken.',
    features: [
      { title: 'Mobiel eerst', text: 'De meeste bezoekers komen via hun telefoon. Daar ontwerp ik eerst voor.' },
      { title: 'Eén duidelijke actie', text: 'Bellen, appen, boeken of een offerte. Bezoekers zien direct wat ze moeten doen.' },
      { title: 'Vindbaar in Google', text: 'Snelle laadtijd, goede titels en structuur, gekoppeld aan je Google Bedrijfsprofiel.' },
      { title: 'Zelf aanpassen', text: 'Teksten en foto’s wijzig je zelf, of je appt mij en ik doe het.' }
    ],
    includes: ['Ontwerp op maat', 'Mobiel en desktop', 'SEO-basis', 'WhatsApp- of belknop', 'Domein, mail en hosting', 'Statistieken'],
    faq: [
      { q: 'Wat kost een website laten maken?', a: 'Werk begint vanaf €100. Je krijgt vooraf een prijs per klus, zonder contract of vaste maandkosten.' },
      { q: 'Hoe snel staat mijn site live?', a: 'Een eenvoudige site staat vaak binnen een paar weken online. Je ziet eerst een voorbeeld.' },
      { q: 'Kan mijn bestaande site vernieuwd worden?', a: 'Ja. Je domein blijft gewoon, ik verbeter ontwerp, snelheid, teksten en foto’s.' }
    ],
    projects: ['sg-onderneming', 'bn-elektra']
  },
  {
    slug: 'web-apps',
    icon: 'app',
    title: 'Web apps',
    menu: 'Web app laten maken',
    short: 'Klantportalen, boekingssystemen en dashboards op maat.',
    seoTitle: 'Web app laten maken',
    seoDescription: 'Web app op maat: klantportalen, boekingssystemen en dashboards met API-koppelingen. Gebouwd met React en Node.js door R DEV uit Alkmaar.',
    headline: 'Software die precies past bij hoe jij werkt.',
    intro: 'Excel-lijsten, losse formulieren en handwerk vervangen door één systeem dat in de browser draait, op elk scherm.',
    features: [
      { title: 'Inloggen en rollen', text: 'Klanten, medewerkers en beheerders zien elk wat voor hen bedoeld is.' },
      { title: 'Koppelingen', text: 'Agenda, betalingen, boekhouding of je eigen systemen via API’s.' },
      { title: 'Realtime', text: 'Live data, meldingen en statussen zonder te verversen.' },
      { title: 'Veilig opgeslagen', text: 'Data in Europa, met back-ups en duidelijke rechten.' }
    ],
    includes: ['React en Node.js', 'Database en beheer', 'API-koppelingen', 'Accounts en rollen', 'Testen en livegang', 'Doorontwikkeling'],
    faq: [
      { q: 'Wat is het verschil met een website?', a: 'Een website laat zien wie je bent. Een web app doet werk voor je: plannen, beheren, berekenen of automatiseren.' },
      { q: 'Kan het later uitgebreid worden?', a: 'Ja. Ik bouw modulair, zodat nieuwe functies erbij kunnen wanneer je groeit.' }
    ],
    projects: ['goaltje', 'veripasso']
  },
  {
    slug: 'saas-ontwikkeling',
    icon: 'layers',
    title: 'SaaS',
    menu: 'SaaS-ontwikkeling',
    short: 'Van idee tot product met accounts, abonnementen en betalingen.',
    seoTitle: 'SaaS laten ontwikkelen',
    seoDescription: 'Van idee tot SaaS-product: accounts, abonnementen, betalingen en een beheeromgeving. R DEV bouwt schaalbare platformen met Next.js en Node.js.',
    headline: 'Van idee naar een product dat verkoopt.',
    intro: 'Ik bouw je SaaS van eerste schets tot lancering: het product zelf, de marketingsite en alles wat nodig is om klanten te laten betalen.',
    features: [
      { title: 'Snel naar een MVP', text: 'Eerst de kern, zo snel mogelijk in handen van echte gebruikers.' },
      { title: 'Abonnementen', text: 'Betalen via Mollie of Stripe, met proefperiodes en facturen.' },
      { title: 'Schaalbaar', text: 'Containers en cloud-infrastructuur die meegroeien met je gebruikers.' },
      { title: 'Admin-dashboard', text: 'Gebruikers, omzet en gebruik in één overzicht.' }
    ],
    includes: ['Productontwerp UI/UX', 'Next.js en Node.js', 'Betalingen', 'Docker en cloud', 'Marketingsite', 'Analytics'],
    faq: [
      { q: 'Heb ik een technisch team nodig?', a: 'Nee. Ik ontwerp, bouw en beheer. Jij focust op klanten en verkoop.' },
      { q: 'Wie is eigenaar van de code?', a: 'Jij. De code en data zijn van jou.' }
    ],
    projects: ['veripasso']
  },
  {
    slug: 'apps-laten-maken',
    icon: 'phone',
    title: 'Apps',
    menu: 'App laten maken',
    short: 'Eén app voor iPhone en Android, in je eigen huisstijl.',
    seoTitle: 'App laten maken',
    seoDescription: 'App laten maken voor iPhone en Android. Met pushmeldingen, accounts en koppelingen met je systemen. R DEV uit Alkmaar.',
    headline: 'Jouw zaak, altijd op zak bij je klant.',
    intro: 'Een app voor vaste klanten, medewerkers of je eigen product. Eén codebasis voor iPhone en Android, dus sneller en betaalbaarder.',
    features: [
      { title: 'iPhone en Android', text: 'Eén app, beide platformen, met een native gevoel.' },
      { title: 'Pushmeldingen', text: 'Herinneringen, acties en updates direct op het scherm van je klant.' },
      { title: 'Koppelingen', text: 'Dezelfde data als je website of web app.' },
      { title: 'Publiceren', text: 'Ik regel de publicatie in de App Store en Google Play.' }
    ],
    includes: ['UI/UX-ontwerp', 'iOS en Android', 'Pushmeldingen', 'Inloggen', 'Store-publicatie', 'Updates'],
    faq: [
      { q: 'Heb ik een app nodig of is een web app genoeg?', a: 'Dat bespreken we eerst. Vaak is een web app sneller en goedkoper, en kan een app later.' }
    ],
    projects: ['goaltje']
  },
  {
    slug: 'ai-automatisering',
    icon: 'sparkles',
    title: 'AI en automatisering',
    menu: 'AI-automatisering',
    short: 'Berichten beantwoorden, agenda checken en afspraken inplannen.',
    seoTitle: 'AI-automatisering voor ondernemers',
    seoDescription: 'AI-agents en automatisering die WhatsApp beantwoorden, je agenda checken en afspraken inplannen. Mis nooit meer een klant. R DEV uit Alkmaar.',
    headline: 'Mis nooit meer een klant.',
    intro: 'Terwijl jij aan het werk bent, beantwoordt een AI-agent berichten, checkt je agenda en zet de afspraak vast. Jij krijgt alleen een seintje.',
    features: [
      { title: 'WhatsApp-assistent', text: 'Beantwoordt vragen in jouw toon, dag en nacht.' },
      { title: 'Agenda-koppeling', text: 'Google Agenda of Outlook: alleen vrije tijden, met pauzes en buffers.' },
      { title: 'Herinneringen', text: 'Automatisch een dag van tevoren. Minder no-shows.' },
      { title: 'Reviews', text: 'Na de afspraak een vriendelijk verzoek om een review.' }
    ],
    includes: ['AI-agent', 'WhatsApp Business', 'Google Agenda of Outlook', 'Herinneringen', 'Reviewverzoek', 'Rapportage'],
    faq: [
      { q: 'Moet ik mijn agenda overzetten?', a: 'Nee. De agent werkt met je bestaande Google Agenda of Outlook.' },
      { q: 'Kan ik altijd zelf ingrijpen?', a: 'Ja. Je ziet alle gesprekken en kunt op elk moment zelf antwoorden.' }
    ],
    projects: []
  },
  {
    slug: 'seo-alkmaar',
    icon: 'search',
    title: 'SEO en Google',
    menu: 'SEO en vindbaarheid',
    short: 'Beter gevonden worden door klanten in de buurt.',
    seoTitle: 'SEO Alkmaar: beter gevonden worden',
    seoDescription: 'Lokale SEO in Alkmaar en omgeving. Beter gevonden worden in Google met een sterke site en Google Bedrijfsprofiel. R DEV.',
    headline: 'Gevonden worden door klanten om de hoek.',
    intro: 'Een mooie site helpt pas als mensen hem vinden. Ik zorg dat je bovenaan komt bij zoekopdrachten uit Alkmaar en omgeving.',
    features: [
      { title: 'Lokale SEO', text: 'Pagina’s per dienst en regio, met de woorden die je klanten gebruiken.' },
      { title: 'Google Bedrijfsprofiel', text: 'Ingericht en gekoppeld, met foto’s en reviews.' },
      { title: 'Snelheid', text: 'Groen in PageSpeed, want snelheid telt mee.' },
      { title: 'Meten', text: 'Je ziet waar bezoekers vandaan komen en wat werkt.' }
    ],
    includes: ['Zoekwoordenonderzoek', 'Technische SEO', 'Bedrijfsprofiel', 'Structured data', 'Snelheid', 'Rapportage'],
    faq: [
      { q: 'Hoe snel zie ik resultaat?', a: 'Technische verbeteringen werken vaak binnen weken. Hogere posities groeien over een paar maanden.' }
    ],
    projects: ['sg-onderneming', 'bn-elektra']
  },
  {
    slug: 'domein-mail-hosting',
    icon: 'server',
    title: 'Domein, mail en hosting',
    menu: 'Domein, mail en hosting',
    short: 'Van domeinnaam tot zakelijke mailbox en veilige opslag.',
    seoTitle: 'Domein, zakelijke mail en hosting',
    seoDescription: 'Domeinnaam, zakelijke mailboxen, hosting en veilige data-opslag, geregeld door R DEV uit Alkmaar. Met kennis als systeembeheerder.',
    headline: 'Alles technisch geregeld. Jij hoeft er niet naar om te kijken.',
    intro: 'Met mijn achtergrond als systeembeheerder regel ik de techniek achter je bedrijf: domein, mail, hosting, back-ups en beveiliging.',
    features: [
      { title: 'Domeinnaam', text: 'Registreren, verhuizen en goed instellen.' },
      { title: 'Zakelijke mail', text: 'Mailboxen op je eigen domein, ook op je telefoon.' },
      { title: 'Hosting', text: 'Snel en veilig, met SSL en monitoring.' },
      { title: 'Data en back-ups', text: 'Veilig opgeslagen in Europa, met dagelijkse back-ups.' }
    ],
    includes: ['Domein', 'Mailboxen', 'Hosting en SSL', 'Back-ups', 'Updates', 'Monitoring'],
    faq: [
      { q: 'Kan mijn bestaande mail blijven werken?', a: 'Ja. Ik verhuis alles zonder dat je mail kwijtraakt.' }
    ],
    projects: []
  }
];

export type Project = {
  slug: string;
  name: string;
  type: string;
  sector: string;
  url: string;
  desktop: string;
  mobile: string;
  accent: string;
  summary: string;
  goal: string;
  built: string[];
  services: string[];
};

export const projects: Project[] = [
  {
    slug: 'sg-onderneming',
    name: 'SG Onderneming',
    type: 'Website',
    sector: 'Bouw en verduurzaming',
    url: 'https://www.sgonderneming.nl/',
    desktop: '/img/sg-desktop.webp',
    mobile: '/img/sg-mobile.webp',
    accent: '#FF7A1A',
    summary: 'Website voor een bouw- en verduurzamingsbedrijf: zonnepanelen, thuisbatterijen, laadoplossingen en renovatie.',
    goal: 'Meer offerte-aanvragen uit de regio en direct laten zien dat alles van A tot Z geregeld wordt.',
    built: ['Krachtige hero met offerteknop', 'Dienstenoverzicht en projecten', 'WhatsApp-knop op elke pagina', 'Mobiel eerst en snel'],
    services: ['websites-laten-maken', 'seo-alkmaar']
  },
  {
    slug: 'bn-elektra',
    name: 'BN Elektra',
    type: 'Website',
    sector: 'Installatietechniek',
    url: 'https://www.bnelektra.nl/',
    desktop: '/img/bn-desktop.webp',
    mobile: '/img/bn-mobile.webp',
    accent: '#F5A524',
    summary: 'Website voor een elektricien: zonnepanelen, thuisbatterijen, laadpalen, verlichting en meterkasten.',
    goal: 'Vertrouwen wekken bij particulieren en het aanvragen van een gratis offerte zo makkelijk mogelijk maken.',
    built: ['Gratis offerte-aanvraag', 'Werkgebied en diensten', 'Portfolio van installaties', 'WhatsApp-contact'],
    services: ['websites-laten-maken', 'seo-alkmaar']
  },
  {
    slug: 'veripasso',
    name: 'VeriPasso',
    type: 'SaaS',
    sector: 'Digitaal productpaspoort',
    url: 'https://www.veripasso.com/',
    desktop: '/img/vp-desktop.webp',
    mobile: '/img/vp-mobile.webp',
    accent: '#7CDA24',
    summary: 'SaaS voor digitale productpaspoorten (DPP) volgens de Europese regels, met een QR-code die nooit verandert.',
    goal: 'Bedrijven laten voldoen aan de Europese DPP-regels zonder dat hun klanten een app nodig hebben.',
    built: ['Productpaspoort per product met QR-code', 'Marketingsite en demo-aanvraag', 'Inloggen en beheeromgeving', 'Gegevens opgeslagen in de EU'],
    services: ['saas-ontwikkeling', 'web-apps']
  },
  {
    slug: 'goaltje',
    name: 'Goaltje',
    type: 'Web app',
    sector: 'WK 2026-voetbalpoules',
    url: 'https://goaltje.nl/',
    desktop: '/img/gt-desktop.webp',
    mobile: '/img/gt-mobile.webp',
    accent: '#FFD60A',
    summary: 'Web app voor WK 2026-voetbalpoules: voorspel alle 104 wedstrijden en speel tegen je vrienden.',
    goal: 'Een premium poule-ervaring met live scores, ranglijsten en sociale competitie.',
    built: ['Poules aanmaken en vrienden uitnodigen', 'Live scores en ranglijsten', 'Voorspellingen per wedstrijd', 'Werkt als app op je telefoon'],
    services: ['web-apps', 'apps-laten-maken']
  }
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const stack = ['React', 'Next.js', 'JavaScript', 'TypeScript', 'Node.js', 'Docker', 'AI-agents', 'API-koppelingen', 'Systeembeheer', 'UI/UX-design', 'SEO'];
