// Alle inhoud komt van house-of-nails-by-jasmina.nl (teksten, prijzen 2026, openingstijden, foto's, reviews)
const B = 'https://primary.jwwb.nl/public/i/c/q/temp-wiegpodytlkvonnxoysj/';
export const img = (p, q = 'width=900') => `${B}${p}?enable-io=true&enable=upscale&${q}`;
export const sq = (p, w = 700) => img(p, `crop=1%3A1&width=${w}`);

export const SITE = {
  name: 'House of Nails by Jasmina',
  short: 'House of Nails',
  phone: '06 18948445',
  tel: '+31618948445',
  whatsapp: '31618948445',
  kvk: '92902499',
  place: 'Heerhugowaard (de Noord)',
  booking: 'https://byjasmina.boekingapp.nl/?cid=11169',
  instagram: 'https://www.instagram.com/house_of_nails_by_jasmina',
  facebook: 'https://www.facebook.com/nailsbyjasmina',
  live: 'https://www.house-of-nails-by-jasmina.nl',
  logo: img('image-high-2egkau.png', 'height=160'),
  logoLg: img('image-high-2egkau.png', 'height=320'),
  welcome: img('img_6800-high.jpg', 'width=900'),
  withLogo: img('foto-met-logo-high-tpymf2.png', 'width=900')
};

export const HOURS = [
  ['Maandag', '9:00 – 17:30'], ['Dinsdag', '9:00 – 17:30'], ['Woensdag', '9:00 – 17:30'], ['Donderdag', '9:00 – 17:30'],
  ['Vrijdag', '9:00 – 17:30'], ['Zaterdag', '9:00 – 15:30'], ['Zondag', 'Gesloten']
];
// openingstijden per weekdag (0 = zondag) in minuten
export const OPEN = { 0: null, 1: [540, 1050], 2: [540, 1050], 3: [540, 1050], 4: [540, 1050], 5: [540, 1050], 6: [540, 930] };

export const USPS = [
  ['Sinds 1995', 'Gecertificeerd Natural Nail Treatment salon'],
  ['Eigen vijlenset', 'Elke klant heeft een eigen vijlenset'],
  ['1000+ kleuren', 'Keuze uit meer dan 1000 kleuren gellac'],
  ['Gratis parkeren', 'Gratis parkeren voor de deur']
];
export const BRANDS = ['Diva', 'NeoNail', 'Halo', 'Yoshi'];
export const TECHNIQUES = ['BIAB mét of zonder verlenging', 'Rubberbase', 'Gel', 'Polygel', 'Gellac', 'Manicure', 'Nageldesign'];

export const GALLERY = [
  '448355046_18021313658248344_2019761984059705937_n-high.jpg', 'ba18f040-6974-43dc-a196-748fcbe80124-high-z1asi7.png',
  'a3000fec-8460-463c-bb19-e0e6e05fc425-high-34yl2y.png', '8xzxci/thumbnail_image21.jpg', 'n2at70/4c003ac4-c59d-4fc4-b5ab-85a036148b261.jpeg',
  'qdayu1/thumbnail_image03.jpg', 'pa8n9v/11-9-202219_04_47-bewerkt.png', 'ud2i4f/23-4-202215_42_32-bewerkt.png',
  'x9uuhu/15-4-202214_44_55-bewerkt.png', 'umov7g/2-5-202222_18_45-bewerkt.png', '1bstxk/3-5-202218_45_32-bewerkt.png',
  'c4ba36/26-5-202213_47_30-bewerkt.png', '59dt9d/9-6-202211_05_41-bewerkt.png', '1ecaq7/7-5-202219_35_15-bewerkt.png',
  'k8uxxf/thumbnail_img_1789-1.jpg', 'raz8sj/thumbnail_image1.jpg', '4xtmne/18-4-202221_50_14-bewerkt.png',
  'cwjk0i/17-6-202219_48_17-bewerkt1.png', 'nm5gcy/9-6-202222_32_13-bewerkt.png', 'n9c1i5/2-5-202222_27_19-bewerkt.png',
  'oncz6g/25-6-202218_12_32-bewerkt1.png', '88yc24/17-7-202218_54_21-bewerkt.png', '7dqzd8/4-8-202219_16_21-bewerkt.png',
  'ct2tyj/yes-1.jpg', 'apt7fe/21-4-202219_15_00-bewerkt.png', 'pab6yw/thumbnail_img_3767.jpg', 'vby7ju/d962d9f5-bc75-4bb1-a39f-2e571e768037.jpeg'
];

export const CATS = [
  { id: 'nieuwe-set', name: 'Nieuwe set', intro: 'Een complete nieuwe set BIAB op je natuurlijke nagels, naturel of met kleur.' },
  { id: 'nabehandeling', name: 'Nabehandeling', intro: 'Het onderhoud van je BIAB, zodat je nagels mooi en sterk blijven.' },
  { id: 'extras', name: "Extra's", intro: 'Maak je behandeling compleet met design, chrome, french of een manicure.' },
  { id: 'brow-lash', name: 'Brow & lashbar', intro: 'Wenkbrauwen, lashlift en browlamination.' }
];

const BIAB_TXT = [
  'BIAB is simpel gezegd de afkorting van Builder In A Bottle. Gel in een flesje op basis van rubber met een extreme hechting en wat flexibeler is dan Acryl, maar stukken steviger dan gellac.',
  'Met deze gel kan je de natuurlijke nagel opbouwen zodat deze er weer prachtig en natuurlijk uitziet. Het biedt stevigheid en het breken of scheuren van je nagels zal minimaal tot niet zijn.',
  'Ook zal nagelbijten verleden tijd zijn. Na een aantal behandelingen, zal je ook merken dat je nagels er een mooiere vorm van krijgen en ook steviger zullen zijn.'
];

// Prijzen 2026 (van de prijslijst op de site)
export const TREATMENTS = [
  { slug: 'biab-nieuwe-set', cat: 'nieuwe-set', name: 'BIAB nieuwe set', img: GALLERY[1], short: 'Builder In A Bottle op je natuurlijke nagels: stevig, flexibel en natuurlijk mooi.', desc: BIAB_TXT,
    variants: [{ id: 'naturel', label: 'BIAB naturel', price: 6000 }, { id: 'kleur', label: 'BIAB kleur / gellak', price: 6500 }],
    addons: [{ id: 'verlenging', label: 'Verlenging', price: 1500 }], popular: true },
  { slug: 'biab-nabehandeling', cat: 'nabehandeling', name: 'BIAB nabehandeling', img: GALLERY[2], short: 'Onderhoud van je BIAB, naturel of met kleur / gellak.', desc: BIAB_TXT.slice(0, 1),
    variants: [{ id: 'naturel', label: 'BIAB naturel', price: 4600 }, { id: 'kleur', label: 'BIAB + kleur / gellak', price: 5000 }], popular: true },
  { slug: 'french-smileline', cat: 'extras', name: 'French smileline', img: GALLERY[6], price: 1000, short: 'Een tijdloze french smileline.' },
  { slug: 'ombre', cat: 'extras', name: 'Ombre', img: GALLERY[8], price: 500, short: 'Zachte kleurovergang op je nagels.' },
  { slug: 'manicure', cat: 'extras', name: 'Manicure', img: GALLERY[10], price: 1000, short: 'Verzorging van je handen en nagelriemen.', popular: true },
  { slug: 'naildesign', cat: 'extras', name: 'Naildesign', img: GALLERY[4], short: 'Nailart op een paar of al je nagels. Er zijn ontelbare mogelijkheden.', popular: true,
    variants: [{ id: '2-4', label: '2 – 4 nagels', price: 600 }, { id: '5-10', label: '5 – 10 nagels', price: 1000 }, { id: '10', label: '10 diverse nagels', price: 1500 }] },
  { slug: 'chrome', cat: 'extras', name: 'Chrome', img: GALLERY[12], price: 400, short: 'Een spiegelende chrome finish.' },
  { slug: 'nagelreparatie', cat: 'extras', name: 'Nagelreparatie', img: GALLERY[14], price: 800, short: 'Herstel van een gebroken of beschadigde nagel.' },
  { slug: 'avondtarief', cat: 'extras', name: 'Avondtarief', price: 1500, short: 'Toeslag voor een afspraak in de avond.', noimg: true },
  { slug: 'wenkbrauwen', cat: 'brow-lash', name: 'Wenkbrauwen harsen / epileren', short: 'Mooi gevormde wenkbrauwen.', noimg: true,
    variants: [{ id: 'basis', label: 'Harsen / epileren', price: 2000 }, { id: 'verven', label: 'Harsen / epileren + verven', price: 2750 }] },
  { slug: 'harsen-lip-kin', cat: 'brow-lash', name: 'Harsen lip of kin', price: 500, short: 'Snel en netjes harsen van lip of kin.', noimg: true },
  { slug: 'lashlift', cat: 'brow-lash', name: 'Lashlift', price: 4500, short: 'All inclusive.', noimg: true, popular: true },
  { slug: 'browlamination', cat: 'brow-lash', name: 'Browlamination', price: 5000, short: 'All inclusive.', noimg: true, popular: true }
];
export const fromPrice = t => t.variants ? Math.min(...t.variants.map(v => v.price)) : t.price;
export const EXTRA_SLUGS = ['french-smileline', 'ombre', 'chrome', 'naildesign', 'manicure'];

export const GIFT = { slug: 'cadeaubon', name: 'Cadeaubon House of Nails', amounts: [2500, 5000, 7500, 10000], designs: [{ id: 'zwart-goud', label: 'Zwart & goud' }, { id: 'nude', label: 'Nude' }] };

export const REVIEWS = [
  ['Angelique vd M.', 'Jasmina werkt met veel liefde aan je nagels, en dat zie je aan het resultaat! Altijd tip top verzorgd, super goede service en altijd gezellig. De keuze aan kleur en styling is overweldigend! Absolute aanrader!!'],
  ['Gwen S.', 'Super blij met mijn nagels elke keer weer! De nagels zijn van top kwaliteit en er wordt zeker tijd ingestoken. Daarnaast is het super gezellig en ga ik blij en met mooie nagels weg. Bij twijfel met wat je wilt weet ze altijd raad!'],
  ['Amber M.', 'Ik ben zelf nagelstyliste en was daarom opzoek naar een top salon die mijn nagels kon doen. Jasmina luistert naar je wensen. De opbouw van de nagel is mooi met de bolling op de juiste plek en je komt niet met dikke nagels terug!'],
  ['Sabrina S.', 'Een keurige en correcte dame die een hele hoop creativiteit bezit. Goed verzorgd, vriendelijk en uiterst precies in haar werk. Je loopt tevreden de deur uit! Zeker de moeite waard!'],
  ['Dulcita L.', 'Kwam met enorm beschadigde nagels bij Jasmina. Ze raadde me rubberbase aan, zodat mijn nagels konden herstellen. Ging er met prachtige natuurlijk-ogende nagels weer weg. Superblij met haar! Kundig en vriendelijk!'],
  ['Tessa S.', 'Jasmina is een hele lieve, spontane vrouw die weet wat ze doet! Voelde mij gelijk op mn gemak bij haar, ze heeft erg leuke ideeën voor op je nagels. En werkt zeer hygiënisch. Zeker een aanrader!!!'],
  ['Bianca B.', 'Super lieve vrouw. En wat een mooie salon! Ik kreeg een eigen vijlen setje en alles wat ze gebruikte kwam uit een machine met alcohol. Super schoon. Daarnaast luistert ze naar wat jij wil en geeft ze ook advies.'],
  ['Laurien H.', 'Tijdens de behandeling merk ik dat zij enorm schoon werkt. Het contact tijdens de behandeling is gezellig en de tijd vliegt. Ik merk dat zij echt passie heeft voor haar vak! M\'n nagels zien er prachtig uit.'],
  ['Chemenne S.', 'Ik sport 6x in de week, rij paard en werk in de horeca, maar heb nog nooit een nagel gebroken in de tijd dat ik ze bij Jasmina laat doen! Naast de mooie nagels kom ik ook altijd met plezier door de gezellige sfeer.'],
  ['Kelly S.', 'Zeer blij met mijn nagels. Ergens anders waren mijn nagels erg verpest. Nu was het aan Jasmina om mijn nagels op te lappen! Dit heeft ze fantastisch gedaan! Ik geef haar een dikke 10..'],
  ['Ellie K.', 'Na een paar behandelingen ben ik meer dan tevreden. Zelfs de ergste nagels knappen wat op en voor het eerst sinds jaren kijk ik met plezier naar mijn handen!! Blijf zeker klant!!'],
  ['Esther dV.', 'Jasmina is een ontzettend creatieve en lieve vrouw. Goede zorg en werkt hygiënisch. Denkt mee met creaties. Ik zou haar salon daarom aan iedereen aanbevelen.'],
  ['Sabine B.', 'Jasmina denkt altijd goed mee, en zorgt ervoor dat je zolang mogelijk plezier hebt van je nagels. Ze werkt erg netjes en hygiënisch, ook is ze altijd erg gezellig.'],
  ['Linda K.', 'Na 1,5 jaar chemo waren mijn nagels "slap" maar ik wilde zo graag mooie en verzorgde nagels en daar ging je aan de slag... nu voor de tweede x weer top nagels. Bedankt voor je advies en je geduld!']
];
