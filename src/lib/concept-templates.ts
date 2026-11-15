// Concept templates per sector. Only generic, clearly-proposal copy: never invented facts
// (no fake reviews, prices, opening hours or claims about the business).
export type ConceptTemplate = {
  accent: string;
  heroTitle: (name: string, city: string) => string;
  heroText: string;
  cta: string;
  features: { title: string; text: string }[];
};

const base: ConceptTemplate = {
  accent: '#1f2937',
  heroTitle: (n, c) => `${n}${c ? ` in ${c}` : ''}`,
  heroText: 'Een snelle, moderne website die op elke telefoon werkt en waarmee klanten u direct kunnen bereiken.',
  cta: 'Neem contact op',
  features: [
    { title: 'Perfect op mobiel', text: 'De meeste bezoekers komen via hun telefoon. Alles is daar direct leesbaar en klikbaar.' },
    { title: 'Direct bellen of appen', text: 'Eén tik op de knop en de klant heeft u aan de lijn of in WhatsApp.' },
    { title: 'Gevonden in Google', text: 'Opgebouwd voor lokale zoekopdrachten in uw regio.' }
  ]
};

export const templates: Record<string, ConceptTemplate> = {
  kapper: { ...base, accent: '#7c3aed', heroText: 'Boek je volgende knipbeurt in een paar tikken, dag en nacht.', cta: 'Maak een afspraak',
    features: [
      { title: 'Online afspraken', text: 'Klanten kiezen zelf een tijd. Minder telefoontjes tijdens het knippen.' },
      { title: 'Behandelingen en prijzen', text: 'Overzichtelijk per behandeling, zodat klanten weten waar ze aan toe zijn.' },
      { title: 'Direct appen', text: 'Vragen? Eén tik en de klant stuurt een WhatsApp.' }
    ] },
  schoonheidssalon: { ...base, accent: '#db2777', heroText: 'Ontspannen begint bij het boeken: overzichtelijk, rustig en online.', cta: 'Boek een behandeling',
    features: [
      { title: 'Online boeken', text: 'Behandeling kiezen en direct een moment vastleggen.' },
      { title: 'Behandelingen in beeld', text: 'Elke behandeling met heldere uitleg en duur.' },
      { title: 'Cadeaubonnen', text: 'Mogelijkheid om cadeaubonnen online aan te bieden.' }
    ] },
  restaurant: { ...base, accent: '#b45309', heroText: 'Bekijk de kaart en reserveer direct een tafel.', cta: 'Reserveer een tafel',
    features: [
      { title: 'Online reserveren', text: 'Gasten reserveren zelf, ook buiten openingstijden.' },
      { title: 'Menukaart op mobiel', text: 'Snel leesbaar, zonder PDF te hoeven downloaden.' },
      { title: 'Afhalen en bezorgen', text: 'Mogelijkheid om bestellingen online aan te nemen.' }
    ] },
  'café': { ...base, accent: '#92400e', heroText: 'De plek om even te zitten. Bekijk de kaart en kom langs.', cta: 'Bekijk de kaart',
    features: [
      { title: 'Kaart en openingstijden', text: 'Altijd actueel en direct te vinden.' },
      { title: 'Groepen en reserveren', text: 'Eenvoudig een tafel of ruimte aanvragen.' },
      { title: 'Route in één tik', text: 'Direct navigeren vanaf de telefoon.' }
    ] },
  elektricien: { ...base, accent: '#ca8a04', heroText: 'Vakkundig elektra-werk in de regio. Vraag direct een offerte aan.', cta: 'Vraag een offerte aan',
    features: [
      { title: 'Offerte-aanvraag', text: 'Klanten beschrijven de klus en sturen foto’s mee.' },
      { title: 'Diensten overzichtelijk', text: 'Per dienst een duidelijke uitleg.' },
      { title: 'Spoed? Bel direct', text: 'Grote belknop bovenaan op mobiel.' }
    ] },
  'installatie/bouw': { ...base, accent: '#0f766e', heroText: 'Vakmanschap in de regio. Vertel ons over uw project.', cta: 'Vraag een offerte aan',
    features: [
      { title: 'Projecten in beeld', text: 'Ruimte om eigen projecten te laten zien.' },
      { title: 'Offerte-aanvraag', text: 'Klanten sturen direct de details van hun klus.' },
      { title: 'Werkgebied', text: 'Duidelijk in welke plaatsen u werkt.' }
    ] },
  winkel: { ...base, accent: '#2563eb', heroText: 'Ontdek het assortiment, ook online.', cta: 'Bekijk het assortiment',
    features: [
      { title: 'Webshop-klaar', text: 'Producten online laten zien of direct verkopen.' },
      { title: 'Openingstijden en route', text: 'Altijd actueel, ook in Google.' },
      { title: 'Direct contact', text: 'Vragen via WhatsApp of telefoon.' }
    ] }
};

export const templateFor = (category: string | null) => templates[category ?? ''] ?? base;
