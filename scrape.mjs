import fs from 'fs';
const C=[52.6324,4.7534], R=45;
const EX=new Set(fs.readFileSync('ex.txt','utf8').split(/\s+/).filter(Boolean));
const UA={'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36','accept-language':'nl-NL,nl'};
const km=(a,b)=>{const r=x=>x*Math.PI/180,dl=r(b[0]-a[0]),dn=r(b[1]-a[1]);const h=Math.sin(dl/2)**2+Math.cos(r(a[0]))*Math.cos(r(b[0]))*Math.sin(dn/2)**2;return 12742*Math.asin(Math.sqrt(h));};
let els;
if(fs.existsSync('osm.json')) els=JSON.parse(fs.readFileSync('osm.json','utf8'));
else{
 const q=`[out:json][timeout:170];(nwr["shop"]["website"](52.22,4.50,53.05,5.40);nwr["shop"]["contact:website"](52.22,4.50,53.05,5.40);nwr["craft"]["website"](52.22,4.50,53.05,5.40);nwr["shop"]["url"](52.22,4.50,53.05,5.40););out center tags;`;
 for(const ep of ['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter','https://overpass.private.coffee/api/interpreter']){
  try{const r=await fetch(ep,{method:'POST',body:'data='+encodeURIComponent(q),headers:{'content-type':'application/x-www-form-urlencoded','user-agent':'lorvex-leadlist/1.0'}});if(!r.ok){console.log(ep,r.status);continue;}els=(await r.json()).elements;break;}catch(e){console.log(ep,e.message);}
 }
 fs.writeFileSync('osm.json',JSON.stringify(els));
}
console.log('osm',els.length);
const CHAIN=/hema|kruidvat|action|blokker|albert heijn|jumbo|lidl|aldi|gamma|praxis|karwei|hornbach|etos|zeeman|wibra|xenos|primera|bruna|intertoys|halfords|kwik-fit|specsavers|pearle|hans anders|vodafone|kpn|t-mobile|odido|mediamarkt|coolblue|ikea|leen bakker|jysk|kwantum|bcc|decathlon|c&a|h&m|only|vero moda|jack & jones|rituals|douglas|ici paris|holland & barrett|dirk|vomar|deen|plus |spar|coop|dekamarkt|trekpleister|da drogist|big bazar|shoeby|van haren|scapino|bristol|ter stal|hunkem|ms mode|the sting|brainwash|cosmo|bakker bart|multivlaai|gall|mitra|slijterij|expert|ep:|bever|anwb|welkoop|pets place|jumper|boerenbond|intratuin|g-star|nelson|ziengs|sacha|omoda|esprit|tommy|wehkamp|profile|bike totaal|mister minit|febo|subway|opel|toyota|volkswagen|renault|peugeot|ford|kia|hyundai|bmw|audi|volvo|skoda|carglass|euromaster|beter bed|swiss sense|auping|flying tiger|sostrene|dille|kaldi|simon l|telfort|tele2|ziggo|zara|mango|bershka|primark|new yorker|nike|adidas/i;
const dom=u=>{try{return new URL(u).hostname.replace(/^www\./,'').toLowerCase();}catch{return'';}};
const seen=new Set(),cand=[];
for(const e of els){const t=e.tags||{};let w=t.website||t['contact:website']||t.url;if(!w||!t.name)continue;if(!/^https?:/.test(w))w='https://'+w;const d=dom(w);if(!d||seen.has(d)||EX.has(d))continue;
 if(t.brand||t['brand:wikidata']||t.operator&&CHAIN.test(t.operator)||CHAIN.test(t.name))continue;
 if(/facebook|instagram|linktr|google\.|\.business\.site/.test(d))continue;
 const lat=e.lat??e.center?.lat,lon=e.lon??e.center?.lon;if(lat==null)continue;const dist=km(C,[lat,lon]);if(dist>R)continue;
 seen.add(d);cand.push({name:t.name,type:t.shop||('craft:'+t.craft),city:t['addr:city']||'',w:'https://'+dom(w)+'/',d,dist:Math.round(dist),ph:t.phone||t['contact:phone']||t['contact:mobile']||''});}
cand.sort((a,b)=>a.dist-b.dist);
const dc={};for(const c of cand){const k=c.d.split('.').slice(-2).join('.');dc[k]=(dc[k]||0)+1;}
const list=cand.filter(c=>dc[c.d.split('.').slice(-2).join('.')]<3).slice(0,2600);
console.log('cand',cand.length,'list',list.length);
const get=async(u,ms=9000)=>{try{const r=await fetch(u,{headers:UA,redirect:'follow',signal:AbortSignal.timeout(ms)});if(!r.ok)return null;const ct=r.headers.get('content-type')||'';if(!ct.includes('html'))return null;return{html:(await r.text()).slice(0,600000),url:r.url};}catch{return null;}};
const mobT=s=>{const o=new Set();for(const m of s.matchAll(/(?<![\d.,\/=_-])(?:\+31|0031|0)[\s.\-]?\(?0?\)?[\s.\-]?6[\s.\-]?(?:\d[\s.\-]?){8}(?![\d])/g)){const n=m[0].replace(/\D/g,'').slice(-8);if(/^[1-58]/.test(n)&&!/^(\d)\1{7}$|12345678/.test(n))o.add(n);}return[...o];};
const mob=h=>{const hrefs=[...h.matchAll(/href=["'](?:tel:|https?:\/\/(?:wa\.me|api\.whatsapp\.com)\/)([^"']{6,60})["']/g)].map(m=>decodeURIComponent(m[1]).replace(/^send\?phone=/,'')).map(x=>{const d=x.replace(/\D/g,'');return /^(?:31|0031|0)?6[1-58]\d{7}$/.test(d)?d.slice(-8):null}).filter(Boolean);const tx=h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g,' ').replace(/<[^>]+>/g,' ');return[...new Set([...hrefs,...mobT(tx)])];};
const text=h=>h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ');
const STOP=/^(De|Het|Een|Wij|Ons|Onze|Uw|Je|Jouw|Bij|Voor|Van|Met|Sinds|Al|Dit|Deze|Welkom|Mijn|Ook|Blij|Trots|Erg|Heel|Altijd|Nederland|Graag|Hier|Nu|Zo|Als|In|Op|Te|Er|Opgegroeid|Geboren|Getrouwd|Moeder|Vader|Gek|Dol|Gespecialiseerd|Eigenaar|Eigenaresse|Daarnaast|Inmiddels|Zelf|Sinds|Gediplomeerd|Werkzaam|Begonnen|Gestart|Contact|Over|Home|Lees|Meer|Tel|Telefoon|Email|Mail|Kvk|Info)$/;
const N='([A-Z][a-zà-ü]{2,}(?:[\\s-][A-Z][a-zà-ü]+)?(?:\\s(?:van|de|der|den|ter|ten|te|v\\.d\\.|vd)(?:\\s(?:de|der|den))?)?(?:\\s[A-Z][a-zà-ü]{2,})?)';
const owner=t=>{for(const re of [new RegExp('(?:[Ee]igena(?:ar|resse)|[Oo]prichter|[Ee]igenaren)\\s*(?:van [^.]{0,30}?)?[:,\\-–]?\\s*(?:is\\s|zijn\\s)?'+N),new RegExp(N+',?\\s(?:\\(?eigena(?:ar|resse)|is (?:de )?eigena(?:ar|resse)|oprichter)'),new RegExp('(?:[Mm]ijn naam is|[Ii]k ben|[Ii]k heet|[Gg]roet(?:jes|en)?,?|[Ll]iefs,?)\\s+'+N)]){const m=t.match(re);if(m){const n=[...new Set(m[1].trim().split(/\s+/))].join(' ');if(!STOP.test(n.split(/\s/)[0])&&n.length<32)return n;}}return'';};
const plat=h=>{const l=h.toLowerCase();if(l.includes('jouwweb')||l.includes('jwwb.nl'))return'JouwWeb';if(l.includes('wixstatic')||l.includes('wix.com'))return'Wix';if(l.includes('cdn.shopify'))return'Shopify';if(l.includes('woocommerce'))return'WooCommerce';if(l.includes('mijnwebwinkel')||l.includes('myonlinestore'))return'Mijnwebwinkel';if(l.includes('lightspeed')||l.includes('webshopapp'))return'Lightspeed';if(l.includes('ccvshop')||l.includes('ccv shop'))return'CCV Shop';if(l.includes('weebly'))return'Weebly';if(l.includes('webnode'))return'Webnode';if(l.includes('squarespace'))return'Squarespace';if(l.includes('shoptrader'))return'Shoptrader';if(l.includes('magento')||l.includes('mage/'))return'Magento';if(l.includes('prestashop'))return'PrestaShop';if(l.includes('opencart')||l.includes('route=common'))return'OpenCart';if(l.includes('joomla'))return'Joomla';if(l.includes('wp-content'))return'WordPress';if(l.includes('strato')||l.includes('one.com')||l.includes('mywebsite'))return'Sitebuilder';return'';};
const out=[];let done=0;
async function work(c){
 const p=await get(c.w)||await get(c.w.replace('https://','http://'),7000);if(!p){c.dead=1;return;}
 const h=p.html,l=h.toLowerCase();if(dom(p.url)&&EX.has(dom(p.url)))return;
 c.pl=plat(h);c.shop=/winkelwagen|winkelmand|add[-_ ]to[-_ ]cart|woocommerce|cdn\.shopify|\/cart|\/checkout|afrekenen|shopping[-_ ]?cart|webwinkel|webshop/.test(l)?1:0;
 c.vp=/name=["']viewport/.test(l)?1:0;c.yr=(text(h).match(/(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?(20\d\d)/i)||[])[1]||'';
 c.kb=Math.round(h.length/1024);let T=text(h);c.m=mob(h);c.o=owner(T);
 c.em=(h.match(/mailto:([a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,})/i)||[])[1]||'';
 const links=[...h.matchAll(/href=["']([^"'#]+)["']/g)].map(m=>m[1]).filter(u=>/contact|over[-_ ]?(ons|mij)|about|wie[-_ ]?(zijn|ben)|team/i.test(u)).slice(0,12);
 const pick=[links.find(u=>/contact/i.test(u)),links.find(u=>/over|about|wie|team/i.test(u))].filter(Boolean);
 for(const u of pick){if(c.m.length&&c.o&&c.em)break;let a;try{a=new URL(u,p.url).href;}catch{continue;}if(dom(a)!==dom(p.url))continue;const q=await get(a,7000);if(!q)continue;const t=text(q.html);if(!c.m.length)c.m=mob(q.html);if(!c.o)c.o=owner(t);if(!c.em)c.em=(q.html.match(/mailto:([a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,})/i)||[])[1]||'';}
 if(!c.m.length&&c.ph){c.m=mobT(c.ph);}
 c.m=c.m.filter(n=>!EX.has(n));out.push(c);
}
let i=0;await Promise.all(Array.from({length:40},async()=>{while(i<list.length){const c=list[i++];try{await work(c);}catch{}if(++done%200==0)console.log(done,out.length);}}));
fs.writeFileSync('all.json',JSON.stringify(out));
console.log('ok',out.length,'mob',out.filter(c=>c.m.length).length,'shop',out.filter(c=>c.shop).length,'owner',out.filter(c=>c.o).length);
