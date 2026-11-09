// Menu van Hewitt & Hewitt (overgenomen van hewitt-hewitt.nl)
export const IMG_BASE = 'https://primary.jwwb.nl/public/t/l/r/temp-hwrajvfwrrzcxaqzpumw/';
export const img = (f, w = 500) => f ? `${IMG_BASE}${f}?enable-io=true&enable=upscale&crop=1%3A1&width=${w}&format=jpg` : null;
const slug = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const RAW = [
 {c:'Maaltijden',items:[
  {n:'Surinaamse Roti',d:'Zachte rotiplaat met gekruid vlees, aardappel, kousenband en ei.',i:'roti-kip-high.png',v:[['Vega',16.5],['Kip',20.5],['Lams',25]],fav:1,t:'Bestseller'},
  {n:'Surinaamse Bami',d:'Bami met kousenband, op Surinaamse wijze gekruid.',i:'surinaamse-bami-high.png',v:[['Vega',15],['Kippenbout',17.5],['Kipfilet',17.5],['Varkensvlees & kipworst',17.5]]},
  {n:'Surinaamse Nasi',d:'Gebakken, gekruide rijst met kousenband.',i:'suriaamse-nasi-high.png',v:[['Vega',15],['Kippenbout',17.5],['Kipfilet',17.5],['Varkensvlees & kipworst',17.5]]},
  {n:'Tjauw-Min',d:'Geroerbakte eiernoedels met groenten en vlees.',i:'tjauw-min-3x-vlees-high.png',v:[['Kippenbout',20.5],['Kipfilet',20.5],['Varkensvlees & kipworst',20.5]]},
  {n:'Fried Rice',d:'Gebakken rijst met groenten en vlees naar keuze.',i:'fried-rice-3x-vlees-high-j29aai.png',v:[['Kippenbout',20.5],['Kipfilet',20.5],['Varkensvlees & kipworst',20.5]]},
  {n:'Moksi Alesi',d:'Rijst met zwartoogbonen, groenten en vlees. Blaka-ai-pesi of masoesa.',i:'moksi-alesi-masoesa-kip-high.png',v:[['Kippenbout',25],['Kipfilet',25],['Varkensvlees & kipworst',25]],pre:1,fav:1,t:'Specialiteit'},
  {n:'Ban Ban Corvina',d:'Drooggebakken corvina-steaks met rijst en kousenband.',i:'bang-bang-corvina-high.png',p:25,fav:1,t:'Vis'},
  {n:'Teloh bakkeljauw',d:'Gefrituurde cassave met bakkeljauw, gekookt ei en rode ui.',i:'teloh-bakkeljauw-high.png',p:19},
  {n:'Heri-Heri',d:'Gekookte aardvruchten met bakkeljauw en gekookt ei.',i:'file_0000000036f481f4ad88a870670f4b28-high-h0fzuf.png',p:20.5},
  {n:'Soep van de week',d:'Saoto, pindasoep of cassavesoep. Vraag naar onze soep van de week.',p:12}
 ]},
 {c:'BBQ kip',items:[
  {n:'BBQ Kippenbout',d:'Gemarineerde kippenbout van de grill.',i:'bbq-kippenbout-high.png',p:9.5},
  {n:'BBQ Kipfilet',d:'Malse kipfilet van de grill.',i:'bbq-kipfilet-high.png',p:9.5}
 ]},
 {c:'Broodjes & bara',items:[
  {n:'Bara los',d:'Gekruid Surinaams broodje, met chutney, peper of zuur.',i:'bara-high.png',v:[['Chutney',5],['Peper',5],['Zuur',5],['Peper & zuur',5],['Geen',5]]},
  {n:'Bara met beleg',d:'Bara belegd met beleg naar keuze.',i:'bara-met-beleg-high.png',v:[['Hete kip',7],['Kerrie kip',7],['Bakkeljauw',7],['Pom',7],['Moksi meti',7],['Zoutvlees',7],['Kerrie ei',7]]},
  {n:'Broodje Hete Kip',d:'Malse kipstukjes in een pittige Surinaamse saus.',i:'broodje-hete-kip-high.png',p:7},
  {n:'Broodje Kerrie Kip',d:'Kip in romige kerriesaus.',i:'broodje-kerrie-kip-high.png',p:7},
  {n:'Broodje Bakkeljauw',d:'Kruidig gebakken bakkeljauw met ui en Surinaamse kruiden.',i:'broodje-bakkeljauw-high.png',p:7},
  {n:'Broodje Pom',d:'Authentieke pom met kip en pomtajer, kruidig en hartig.',i:'broodje-pom-high.png',p:7,fav:0},
  {n:'Broodje Moksi Meti',d:'Gemengd geroosterd vlees, Chinees-Surinaams.',i:'broodje-moksi-meti-high.png',p:7},
  {n:'Broodje Zoutvlees',d:'Gestoofd zoutvlees, vol van smaak.',i:'broodje-zoutvlees-high.png',p:7},
  {n:'Broodje BBQ kip',d:'Gegrilde BBQ kip op een vers broodje.',i:'broodje-bbq-kip-high.png',p:9.5},
  {n:'Broodje Davey',d:'Belegd met pom en BBQ vlees. Onze eigen klassieker.',i:'broodje-davey-high.png',p:9.5,t:'Huisspecial'},
  {n:'Broodje Fasjong',d:'Kousenband op Surinaamse wijze.',i:'broodje-fasjong-high.png',p:8},
  {n:'Broodje Garnalen',d:'Pittig gekruide garnalen.',i:'broodje-garnalen-high.png',p:9.5},
  {n:'Broodje Kerrie Ei',d:'Ei in kerriesaus.',i:'broodje-kerrie-ei-high.png',p:7},
  {n:'Broodje Lever & Niertjes',d:'Gestoofd, rijk gekruid.',p:7}
 ]},
 {c:'Bijgerechten & sauzen',items:[
  {n:'Rotiplaat',d:'Losse zachte rotiplaat.',i:'rotiplaat-high.png',p:3},
  {n:'Kousenband',d:'Gebakken kousenband.',i:'kousenband-high.png',p:6},
  {n:'Ghoegri',d:'Kikkererwten op Surinaamse wijze.',i:'ghoegrie-high.png',p:6},
  {n:'Kerrie ei',d:'Gekookt ei in kerrie.',i:'kerrie-ei-high.png',p:2.5},
  {n:'Beleg apart',d:'Hete kip, kerrie kip, bakkeljauw, pom, moksi meti, zoutvlees of kerrie ei.',i:'beleg-apart-250-ml-high.png',v:[['Medium',7],['Large',14]]},
  {n:'Chutney',d:'Huisgemaakte chutney.',i:'chutney-high.png',p:2.5},
  {n:'Pindasambal',d:'Romige pindasambal.',i:'pindasambal-high.png',p:2.5},
  {n:'Chilisaus',d:'',i:'chilisaus-pikant-high.png',p:2},{n:'Ketjapsaus',d:'',i:'ketjap-high.png',p:2},{n:'Gele peper',d:'Madame Jeanette, heet!',i:'gele-peper-high.png',p:2},{n:'Peper (sambal)',d:'',i:'peper-50cc-high.png',p:2},{n:'Zuur',d:'',i:'zuur-high-mu9tav.png',p:1}
 ]},
 {c:'Snacks & zoet',items:[
  {n:'Surinaamse Worst',d:'Kippenworst, bloedworst, vleesworst of fladder.',i:'worst-mix-high.png',v:[['Medium',14.75],['Large',23.5]]},
  {n:'Kippastei',d:'Gemarineerde kip met groenten in bladerdeeg.',i:'kippastei-high.png',p:4},
  {n:'Runderpastei',d:'Gekruid rundvlees in bladerdeeg.',i:'runderpastei-high.png',p:4},
  {n:'Surinaamse loempia',d:'Krokante loempia met Surinaamse vulling.',i:'file_00000000448882439589f402d44cb3f7-high.png',p:4},
  {n:'Surinaamse chips',d:'Cassave, banaan, brong brong of pejeh.',i:'bananenchips-high.png',v:[['Cassave',3.5],['Banaan',3.5],['Brong brong',3.5],['Pejeh',5]]},
  {n:'Bojo',d:'Natte cake van geraspte cassave en kokos.',i:'b2f9057c-1745-4948-9839-8c71302f3b43-high.png',p:3.5},
  {n:'Eksi kuku',d:'Luchtige Surinaamse eiercake.',i:'ae5cb58e-d7bc-4ecb-b8c2-679730b27a44-high.png',p:3.5},
  {n:'Kokosflensjes',d:'Flensjes gevuld met zoete kokos.',i:'kokosflensjes-high.png',p:4},
  {n:'Surinaamse koekjes',d:'Maïzena, dawet of kokos.',i:'pandan-koekjes-high.png',v:[['Maïzena',3.5],['Dawet',3.5],['Kokos',3.5]]}
 ]},
 {c:'Extra\'s mee naar huis',items:[
  {n:'Shishado',d:'BBQ & Grill, Indo Marinade of pikant.',i:'shishado-bbq-grill-high.png',p:5},
  {n:'Surinaamse peper (potje)',d:'Geel of rood.',i:'potje-peper-high.png',v:[['Geel',5],['Rood',5]]},
  {n:'Surinaams Zuur (potje)',d:'',i:'potje-zuur-high.png',p:6.5}
 ]},
 {c:'Dranken',items:[
  {n:'Markoesasap',d:'Tropisch passievruchtsap, fris en licht zoet.',i:'markoesasap-high-edp9uu.png',p:3.5},
  {n:'Dawet',d:'Roze of pandan.',i:'dawet-roze-high.png',v:[['Roze',3.5],['Pandan',3.5]]},
  {n:'Gembersap',d:'Pittig en verfrissend.',i:'gembersap-high.png',p:3.5},{n:'Zuurwater',d:'',i:'zuurwater-high.png',p:3.5},{n:'Guavesap',d:'',i:'guavesap-high.png',p:3.5},{n:'Mangosap',d:'',i:'mangosap-high-mycd51.png',p:3.5},{n:'Kokoswater',d:'',i:'kokoswater-high.png',p:3.5},
  {n:'Surinaamse Siroop 0,5L',d:'Ananas, kola, kersen of markoesa.',i:'siroop-kersen-high-0gn77r.png',v:[['Ananas',6],['Kola',6],['Kersen',6],['Markoesa',6]]},
  {n:'Orgeade siroop 1L',d:'',i:'orgeade-high.png',p:12.5},
  {n:'Fernandes',d:'Green punch, cherry bouquet, super pineapple, cream ginger of red grape.',i:'fernandes-groen-high.png',v:[['Green punch',3],['Cherry bouquet',3],['Super pineapple',3],['Cream ginger',3],['Red grape',3]]},
  {n:'Coca Cola',d:'',i:'coca-cola-high.png',v:[['Cola',3],['Zero',3]]},{n:'Sprite',d:'',i:'sprite-high.png',p:3},{n:'Fanta',d:'',i:'fanta-high-rti5db.png',p:3},{n:'Red Bull',d:'',i:'red-bull-high.png',p:3.5},{n:'AA drink',d:'',i:'aa-drink-high.png',p:3.5},{n:'Caprisun',d:'',i:'caprisun-high.png',p:2},{n:'Spa Blauw',d:'',i:'spa-blauw-high.png',p:2.5}
 ]}
];
export const CATEGORIES = RAW.map(c => ({ name: c.c, slug: slug(c.c), items: c.items.map(x => ({ ...x, slug: slug(x.n), cat: c.c, catSlug: slug(c.c) })) }));
export const PRODUCTS = CATEGORIES.flatMap(c => c.items);
export const bySlug = s => PRODUCTS.find(p => p.slug === s);
export const minPrice = p => p.v ? Math.min(...p.v.map(o => o[1])) : p.p;
export const hasRange = p => !!p.v && p.v.some(o => o[1] !== p.v[0][1]);
export const unitPrice = (p, opt) => p.v ? (p.v.find(o => o[0] === opt) || p.v[0])[1] : p.p;
export const eur = n => '€' + n.toFixed(2).replace('.', ',');
export const WA = '31621262725';
export const MIN_ORDER = 30;
export const ZONES = [
  { id: 'paars', name: 'Paarse zone', price: 5 },
  { id: 'rood', name: 'Rode zone', price: 6.5 },
  { id: 'blauw', name: 'Blauwe zone', price: 7.5 }
];
