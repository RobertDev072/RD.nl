export type IconName = 'monitor' | 'app' | 'layers' | 'phone' | 'sparkles' | 'search' | 'server' | 'bot' | 'bulb';

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
  /** Langere SEO-tekst onder de kaarten: koppen met alinea's. */
  body?: { h: string; p: string[] }[];
};

export const services: Service[] = [
  {
    slug: 'websites-laten-maken',
    icon: 'monitor',
    title: 'Websites',
    menu: 'Website laten maken',
    short: 'Snelle, strakke sites die bezoekers laten bellen, boeken of kopen.',
    seoTitle: 'Website laten maken in Alkmaar',
    seoDescription: 'Website laten maken in Alkmaar? Lorvex bouwt snelle, moderne websites die goed vindbaar zijn in Google. Werk vanaf €100, geen contracten.',
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
    projects: ['sg-onderneming', 'bn-elektra'],
    body: [
      { h: 'Website laten maken in Alkmaar', p: [
        'Lorvex is een AI tech company uit Alkmaar. We bouwen websites voor ondernemers in Alkmaar en de rest van Noord-Holland: van installateurs en bouwbedrijven tot kappers, coaches en dienstverleners. Elke site maken we op maat, zonder standaardthema, zodat hij past bij jouw zaak en jouw klanten.',
        'Een website is voor ons pas af als hij iets oplevert. Daarom bouwen we elke site rond één doel: dat bezoekers bellen, appen, een afspraak maken of een offerte aanvragen. Alles wat daar niet aan bijdraagt laten we weg.'
      ] },
      { h: 'Waar een goede website aan voldoet', p: [
        'Snel laden, ook op een telefoon met slecht bereik. Een duidelijke boodschap in de eerste seconden. Eén opvallende actie, zoals een WhatsApp- of belknop. Echte foto’s en projecten die vertrouwen geven. En een technische basis waar Google mee uit de voeten kan: nette titels, een logische opbouw, structured data en een sitemap.',
        'Dat laatste is belangrijk als je gevonden wilt worden op zoekopdrachten als “website laten maken Alkmaar” of “loodgieter Heiloo”. We koppelen je site ook aan je Google Bedrijfsprofiel, zodat je in de kaart en de lokale resultaten verschijnt.'
      ] },
      { h: 'Zo werken we', p: [
        'Je appt of belt ons en vertelt kort wat je zoekt. Daarna krijg je een gratis eerste voorbeeld, zodat je ziet hoe je nieuwe site eruit kan zien voordat je iets beslist. Ben je enthousiast, dan bouwen we de site af, zetten we hem live op je eigen domein en regelen we mail en hosting als je dat wilt.',
        'Na de livegang blijven we bereikbaar. Geen onderhoudscontract en geen vaste maandkosten: heb je een aanpassing nodig, dan bel of app je en regelen we het.'
      ] },
      { h: 'Wat kost een website laten maken?', p: [
        'Werk begint vanaf €100. De prijs hangt af van wat je nodig hebt: het aantal pagina’s, of er een boekingssysteem of webshop in moet, en of wij teksten en foto’s verzorgen. Je krijgt altijd vooraf een vaste prijs per klus, zodat je nooit voor verrassingen komt te staan.'
      ] },
      { h: 'Ook buiten Alkmaar', p: [
        'We werken voor ondernemers in Alkmaar, Heiloo, Heerhugowaard, Castricum, Bergen, Langedijk, Schagen, Den Helder en de rest van Noord-Holland. Kennismaken kan op locatie, telefonisch of via een videogesprek.'
      ] }
    ]
  },
  {
    slug: 'web-apps',
    icon: 'app',
    title: 'Web apps',
    menu: 'Web app laten maken',
    short: 'Klantportalen, boekingssystemen en dashboards op maat.',
    seoTitle: 'Web app laten maken',
    seoDescription: 'Web app op maat: klantportalen, boekingssystemen en dashboards met API-koppelingen. Gebouwd met React en Node.js door Lorvex uit Alkmaar.',
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
    seoDescription: 'Van idee tot SaaS-product: accounts, abonnementen, betalingen en een beheeromgeving. Lorvex bouwt schaalbare platformen met Next.js en Node.js.',
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
    seoDescription: 'App laten maken voor iPhone en Android. Met pushmeldingen, accounts en koppelingen met je systemen. Lorvex uit Alkmaar.',
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
    slug: 'seo-alkmaar',
    icon: 'search',
    title: 'SEO en Google',
    menu: 'SEO en vindbaarheid',
    short: 'Beter gevonden worden door klanten in de buurt.',
    seoTitle: 'SEO Alkmaar: beter gevonden worden',
    seoDescription: 'Lokale SEO in Alkmaar en omgeving. Beter gevonden worden in Google met een sterke site en Google Bedrijfsprofiel. Lorvex.',
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
    projects: ['sg-onderneming', 'bn-elektra'],
    body: [
      { h: 'Lokale SEO in Alkmaar', p: [
        'Wie in Alkmaar zoekt naar een dienst, kijkt meestal alleen naar de eerste resultaten en de kaart van Google. Lokale SEO zorgt dat jouw bedrijf daar staat. Lorvex combineert een snelle, goed opgebouwde website met een volledig ingericht Google Bedrijfsprofiel en content die antwoord geeft op de vragen van je klanten.'
      ] },
      { h: 'Wat we doen', p: [
        'We onderzoeken op welke woorden je klanten zoeken, maken voor elke belangrijke dienst een eigen pagina, zorgen voor structured data, een sitemap en een snelle laadtijd, en richten je Google Bedrijfsprofiel in met de juiste categorieën, foto’s en openingstijden. Daarna meten we in Google Search Console wat werkt en bouwen we verder.'
      ] },
      { h: 'Reviews en vermeldingen', p: [
        'Reviews op Google wegen zwaar mee in de lokale resultaten. We helpen je om na elke klus automatisch om een review te vragen. Ook zorgen we dat je bedrijfsnaam, adres en telefoonnummer overal hetzelfde staan, van je website tot bedrijvengidsen.'
      ] }
    ]
  },
  {
    slug: 'ai-automatisering',
    icon: 'sparkles',
    title: 'AI en automatisering',
    menu: 'AI-automatisering',
    short: 'Berichten beantwoorden, agenda checken en afspraken inplannen.',
    seoTitle: 'AI-automatisering voor ondernemers',
    seoDescription: 'AI-agents en automatisering die WhatsApp beantwoorden, je agenda checken en afspraken inplannen. Mis nooit meer een klant. Lorvex uit Alkmaar.',
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
    projects: [],
    body: [
      { h: 'Wat is AI-automatisering?', p: [
        'AI-automatisering is software die zelfstandig taken uitvoert die nu nog tijd kosten: berichten beantwoorden, afspraken plannen, gegevens overnemen of herinneringen sturen. Het verschil met gewone automatisering is dat een AI-agent taal begrijpt. Een klant kan gewoon in eigen woorden vragen of je donderdag nog plek hebt.'
      ] },
      { h: 'Voorbeeld: van WhatsApp-bericht naar afspraak', p: [
        'Een klant stuurt ’s avonds een WhatsApp-bericht. De AI-assistent beantwoordt de vraag in jouw toon, kijkt in je Google Agenda of Outlook welke tijden vrij zijn, zet de afspraak vast en stuurt een bevestiging. Een dag van tevoren gaat er automatisch een herinnering uit en na de afspraak een vriendelijk verzoek om een review. Jij krijgt alleen een seintje.'
      ] },
      { h: 'Voor wie?', p: [
        'Voor ondernemers die veel klantcontact hebben maar niet altijd hun telefoon kunnen pakken: kappers, salons, installateurs, coaches, praktijken en dienstverleners in Alkmaar en omgeving. Je houdt altijd zelf de regie en kunt elk gesprek overnemen.'
      ] }
    ]
  },
  {
    slug: 'ai-development',
    icon: 'bot',
    title: 'AI-development',
    menu: 'AI-development',
    short: 'AI-agents, chatbots en slimme koppelingen in je eigen software.',
    seoTitle: 'AI-development: AI-agents en chatbots op maat',
    seoDescription: 'AI-development door Lorvex uit Alkmaar: AI-agents, chatbots op je eigen kennis en AI-koppelingen in je website, web app of systemen. Werk vanaf €100.',
    headline: 'AI gebouwd in jouw software.',
    intro: 'We bouwen AI in je website, web app of interne systemen. Een assistent die je eigen documenten kent, een agent die taken afrondt of een koppeling die data automatisch verwerkt.',
    features: [
      { title: 'AI-agents', text: 'Agents die zelfstandig stappen uitvoeren in je systemen, met duidelijke grenzen.' },
      { title: 'Chatbot op eigen kennis', text: 'Antwoorden op basis van jouw documenten, prijzen en voorwaarden.' },
      { title: 'Koppelingen', text: 'Taalmodellen gekoppeld aan je CRM, agenda, mail of database via API’s.' },
      { title: 'Privacy voorop', text: 'Duidelijke afspraken over data, met opslag in Europa waar dat kan.' }
    ],
    includes: ['AI-agents', 'Chatbot op eigen data', 'API-koppelingen', 'Node.js en TypeScript', 'Docker en cloud', 'Monitoring'],
    faq: [
      { q: 'Wat is AI-development?', a: 'Het ontwerpen en bouwen van software waarin AI een taak uitvoert, zoals vragen beantwoorden, documenten lezen of processen afhandelen.' },
      { q: 'Welke AI-modellen gebruiken jullie?', a: 'We kiezen per project het model dat het best past, van de grote taalmodellen tot kleinere modellen voor specifieke taken.' },
      { q: 'Is mijn data veilig?', a: 'We bouwen met duidelijke rechten, logging en waar mogelijk opslag in Europa. Je data wordt niet gebruikt om modellen te trainen.' }
    ],
    projects: [],
    body: [
      { h: 'AI-development voor het mkb', p: [
        'Veel bedrijven willen iets met AI, maar weten niet waar ze moeten beginnen. Lorvex vertaalt AI naar concrete software die werk uit handen neemt. We beginnen klein, met één taak die veel tijd kost, en bouwen daar een betrouwbare oplossing voor die past in de systemen die je al gebruikt.'
      ] },
      { h: 'Wat we bouwen', p: [
        'Chatbots die vragen van klanten beantwoorden op basis van jouw eigen informatie. AI-agents die offertes voorbereiden, e-mails sorteren of gegevens overnemen in je administratie. Koppelingen die taalmodellen verbinden met je CRM, agenda of database. En dashboards waarin je ziet wat de AI doet, zodat jij altijd de controle houdt.'
      ] },
      { h: 'Van idee tot productie', p: [
        'Robert, oprichter van Lorvex, heeft een achtergrond als developer en systeembeheerder. Daardoor bouwen we niet alleen een slimme demo, maar ook de techniek eromheen: hosting, beveiliging, monitoring en onderhoud. Zo draait je AI-oplossing stabiel, ook als het druk wordt.'
      ] }
    ]
  },
  {
    slug: 'ai-oplossingen',
    icon: 'bulb',
    title: 'AI-oplossingen',
    menu: 'AI-oplossingen',
    short: 'Concrete AI-toepassingen die vanaf week één tijd besparen.',
    seoTitle: 'AI-oplossingen voor ondernemers in Alkmaar',
    seoDescription: 'Praktische AI-oplossingen voor het mkb in Alkmaar en Noord-Holland: klantvragen, offertes, administratie en planning automatisch. Lorvex, AI tech company.',
    headline: 'AI die vanaf dag één helpt.',
    intro: 'Geen hype, maar oplossingen die je morgen kunt gebruiken. We kijken waar je de meeste tijd verliest en zetten AI precies daar in.',
    features: [
      { title: 'Klantvragen', text: 'Veelgestelde vragen automatisch beantwoord via WhatsApp, mail of je website.' },
      { title: 'Offertes en mails', text: 'Concepten in je eigen stijl, klaar om te controleren en te versturen.' },
      { title: 'Administratie', text: 'Facturen, formulieren en documenten automatisch uitgelezen en verwerkt.' },
      { title: 'Planning', text: 'Afspraken, herinneringen en reviewverzoeken zonder handwerk.' }
    ],
    includes: ['Gratis AI-scan', 'Advies op maat', 'Bouw en koppeling', 'Uitleg en training', 'Meten wat het oplevert', 'Doorontwikkeling'],
    faq: [
      { q: 'Wat kan AI voor mijn bedrijf doen?', a: 'Vooral terugkerend werk overnemen: vragen beantwoorden, plannen, teksten opstellen en gegevens verwerken. In een korte scan bekijken we waar het bij jou het meest oplevert.' },
      { q: 'Heb ik technische kennis nodig?', a: 'Nee. Wij bouwen en koppelen alles. Jij gebruikt het via de apps die je al kent, zoals WhatsApp, mail en je agenda.' },
      { q: 'Wat kost een AI-oplossing?', a: 'Werk begint vanaf €100. Je krijgt vooraf een vaste prijs per klus, zonder contract.' }
    ],
    projects: [],
    body: [
      { h: 'Praktische AI voor ondernemers', p: [
        'AI-oplossingen hoeven niet groot of duur te zijn. Vaak zit de winst in kleine, steeds terugkerende taken: dezelfde vragen beantwoorden, afspraken heen en weer plannen, offertes overtypen of facturen invoeren. Lorvex zet AI precies daar in, zodat jij en je team tijd overhouden voor het werk dat ertoe doet.'
      ] },
      { h: 'Hoe we beginnen', p: [
        'We starten met een korte, gratis AI-scan: waar gaat de meeste tijd naartoe en wat is makkelijk te automatiseren? Daarna bouwen we één oplossing, meten we wat die oplevert en breiden we pas uit als het werkt. Geen langlopende trajecten, wel resultaat dat je ziet.'
      ] },
      { h: 'Voor bedrijven in Alkmaar en Noord-Holland', p: [
        'We werken voor ondernemers in Alkmaar, Heiloo, Heerhugowaard, Castricum, Bergen en omgeving. Liever eerst zien hoe het werkt? Bekijk de demo waarin een AI-assistent een WhatsApp-bericht omzet in een afspraak in de agenda.'
      ] }
    ]
  },
  {
    slug: 'domein-mail-hosting',
    icon: 'server',
    title: 'Domein, mail en hosting',
    menu: 'Domein, mail en hosting',
    short: 'Van domeinnaam tot zakelijke mailbox en veilige opslag.',
    seoTitle: 'Domein, zakelijke mail en hosting',
    seoDescription: 'Domeinnaam, zakelijke mailboxen, hosting en veilige data-opslag, geregeld door Lorvex uit Alkmaar. Met kennis als systeembeheerder.',
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
