export const SITE = {
  name: 'BellaMina', tagline: 'Bijzondere damesmode vol stijl en vrouwelijkheid',
  street: 'Leliehofstraat 12', city: 'Heerhugowaard', place: 'Heerhugowaard-de Noord',
  phone: '06 18 94 84 45', tel: '+31618948445', whatsapp: '31618948445',
  instagram: 'https://www.instagram.com/bellamina_heerhugowaard/', insta: '@bellamina_heerhugowaard'
};
export const HOURS = [['Maandag', '12:30 – 17:30'], ['Dinsdag', '12:30 – 17:30'], ['Woensdag', '12:30 – 17:30'], ['Donderdag', '12:30 – 17:30'], ['Vrijdag', '12:30 – 17:30'], ['Zaterdag', '09:00 – 16:30'], ['Zondag', 'Gesloten']];
export const im = i => `/img/${i}.jpg`;
export const LOGO = im(0), STORE = im(1);

export const CATS = [
  { slug: 'blouses-tops', name: 'Blouses & tops', img: 6 },
  { slug: 'blazers-jasjes', name: 'Blazers & jasjes', img: 7 },
  { slug: 'broeken-jeans', name: 'Broeken & jeans', img: 3 },
  { slug: 'vesten', name: 'Vesten', img: 10 },
  { slug: 'accessoires', name: 'Sjaals & accessoires', img: 9 }
];
const S = ['XS', 'S', 'M', 'L', 'XL'], ONE = ['One size'];
const C = { wit: ['Wit', '#f6f3ee'], zwart: ['Zwart', '#1d1b1a'], beige: ['Beige', '#d8c3a5'], taupe: ['Taupe', '#9a8478'], bruin: ['Bruin', '#7a5235'], camel: ['Camel', '#b98a55'], groen: ['Army', '#5d6145'], denim: ['Denim', '#5a7190'], panter: ['Panter', '#b58d55'], roze: ['Oudroze', '#d6a5a0'] };
const P = (slug, name, cat, price, imgs, colors, opts = {}) => ({ slug, name, cat, price, imgs, colors: colors.map(c => ({ id: c, label: C[c][0], hex: C[c][1] })), sizes: opts.sizes || S, ...opts });

export const PRODUCTS = [
  P('witte-blouse', 'Witte blouse', 'blouses-tops', 34.95, [2, 8], ['wit', 'zwart'], { tag: 'Nieuw', desc: 'Luchtige witte blouse met een soepele val. Mooi los, half ingestopt of met een sjaaltje erbij.' }),
  P('basic-top', 'Basic top', 'blouses-tops', 19.95, [6, 9], ['zwart', 'wit', 'beige'], { desc: 'Zachte basic top met ronde hals. De perfecte basis onder een blazer of vest.' }),
  P('satijnen-top', 'Satijnen top', 'blouses-tops', 39.95, [9, 6], ['roze', 'beige'], { tag: 'Nieuw', desc: 'Glanzende top met een vrouwelijke touch, net zo mooi op kantoor als bij een etentje.' }),
  P('blazer-taupe', 'Blazer in taupe', 'blazers-jasjes', 69.95, [7, 13], ['taupe', 'zwart'], { tag: 'Favoriet', desc: 'Getailleerde blazer in een warme taupe tint. Maakt elke outfit direct af.' }),
  P('bruine-blazer', 'Bruine blazer', 'blazers-jasjes', 74.95, [5, 13], ['bruin', 'camel'], { desc: 'Klassieke blazer in een rijke bruintint, heerlijk voor het najaar.' }),
  P('beige-jasje', 'Beige jasje', 'blazers-jasjes', 64.95, [4, 12], ['beige', 'camel'], { tag: 'Nieuw', desc: 'Kort jasje in zacht beige, mooi over jeans of een jurk.' }),
  P('camouflage-broek', 'Camouflage broek', 'broeken-jeans', 49.95, [3, 11], ['groen'], { tag: 'Bestseller', desc: 'Stoere camouflagebroek met een vrouwelijke pasvorm. Combineer met een zacht vest voor contrast.' }),
  P('straight-jeans', 'Straight jeans', 'broeken-jeans', 59.95, [4, 12], ['denim', 'zwart'], { sizes: ['34', '36', '38', '40', '42', '44'], desc: 'Tijdloze straight jeans met hoge taille, comfortabel stretchdenim.' }),
  P('pantalon', 'Pantalon met plooi', 'broeken-jeans', 54.95, [7, 5], ['zwart', 'taupe'], { desc: 'Elegante pantalon met persplooi en wijde pijp.' }),
  P('lang-vest', 'Lang gebreid vest', 'vesten', 49.95, [10, 3], ['beige', 'groen'], { tag: 'Nieuw', desc: 'Heerlijk lang vest om in weg te kruipen, met zakken.' }),
  P('kort-vest', 'Kort vest', 'vesten', 44.95, [11, 10], ['wit', 'zwart'], { desc: 'Kort vest met knoopjes, mooi over een top of blouse.' }),
  P('sjaaltje', 'Sjaaltje', 'accessoires', 14.95, [9, 2], ['panter', 'roze', 'beige'], { sizes: ONE, tag: 'Must-have', desc: 'Klein zijdezacht sjaaltje, om je hals, aan je tas of in je haar.' }),
  P('panter-sjaal', 'Panter sjaal', 'accessoires', 24.95, [6, 2], ['panter'], { sizes: ONE, desc: 'Grote sjaal met pantermotief, geeft elke outfit karakter.' }),
  P('wollen-sjaal', 'Zachte sjaal', 'accessoires', 29.95, [5, 8], ['camel', 'bruin', 'taupe'], { sizes: ONE, desc: 'Grote, zachte sjaal voor koude dagen.' })
];
export const LOOKS = [
  { title: 'Camouflage broek & vest', img: 3, items: ['camouflage-broek', 'lang-vest'] },
  { title: 'Beige jasje & jeans', img: 4, items: ['beige-jasje', 'straight-jeans'] },
  { title: 'Bruine blazer & sjaal', img: 5, items: ['bruine-blazer', 'wollen-sjaal'] },
  { title: 'Basic top & panter sjaal', img: 6, items: ['basic-top', 'panter-sjaal'] }
];
export const bySlug = s => PRODUCTS.find(p => p.slug === s);
export const SHIP_FREE = 75, SHIP = 4.95;
