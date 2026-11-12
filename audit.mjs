import fs from 'fs';import {execSync} from 'child_process';
const doms=fs.readFileSync('doms.txt','utf8').split(/\s+/).filter(Boolean);
const UA={'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36','accept-language':'nl-NL,nl'};
const get=async(u,ms=10000)=>{try{const t=Date.now();const r=await fetch(u,{headers:UA,redirect:'follow',signal:AbortSignal.timeout(ms)});const b=(await r.text()).slice(0,1500000);return{ok:r.ok,st:r.status,url:r.url,b,ms:Date.now()-t,lm:r.headers.get('last-modified')||''};}catch{return null;}};
const text=h=>h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ');
const CLOSED=/definitief gesloten|permanent gesloten|zijn gestopt|is gestopt|gestopt met|wij stoppen|we stoppen|ik stop|stopt ermee|opgeheven|opheffing|bedrijfsbe[eë]indiging|winkel is gesloten per|gesloten per \d|sluit(en)? (de|onze) deuren|deuren gesloten|permanently closed|domein(naam)? (is )?te koop|domain (is )?for sale|this domain|parked|website is offline|binnenkort online|coming soon|under construction|in aanbouw|failliet/i;
async function sm(base){let urls=0,lm='',prod=0;const seen=new Set();
 const q=[base+'sitemap.xml',base+'sitemap_index.xml',base+'wp-sitemap.xml'];let n=0;
 while(q.length&&n<7){const u=q.shift();if(seen.has(u))continue;seen.add(u);const r=await get(u,8000);n++;if(!r||!r.ok||!/<(urlset|sitemapindex)/i.test(r.b))continue;
  const locs=[...r.b.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m=>m[1]);for(const m of r.b.matchAll(/<lastmod>\s*(\d{4}-\d\d)/g))if(m[1]>lm)lm=m[1];
  if(/<sitemapindex/i.test(r.b)){for(const l of locs.slice(0,6))q.push(l);}else{urls+=locs.length;prod+=locs.filter(l=>/product|\/p\/|shop\//i.test(l)).length;}
  if(urls)q.splice(0,q.filter(x=>!x.includes('sitemap')||x.endsWith('sitemap_index.xml')||x.endsWith('wp-sitemap.xml')).length&&0);}
 return{urls,lm,prod};}
const out=[];
async function work(d){const base='https://'+d+'/';let r=await get(base);let https=1;if(!r){r=await get('http://'+d+'/');https=0;}
 if(!r||!r.ok){out.push([d,'DEAD',r?r.st:0].join('|'));return;}
 if(!r.url.startsWith('https'))https=0;const h=r.b,l=h.toLowerCase(),T=text(h);
 const host=new URL(r.url).hostname.replace(/^www\./,'');const moved=host!==d&&!host.endsWith('.'+d)?host:'';
 const links=new Set();for(const m of h.matchAll(/href=["']([^"'#?]+)/g)){try{const u=new URL(m[1],r.url);if(u.hostname.replace(/^www\./,'')===host&&!/\.(css|js|png|jpe?g|svg|webp|ico|pdf|xml|woff2?)$/i.test(u.pathname))links.add(u.pathname.replace(/\/$/,''));}catch{}}
 const s=await sm(new URL(r.url).origin+'/');
 const yrs=[...T.matchAll(/(?:©|copyright)\s*(?:\d{4}\s*[-–]\s*)?(20\d\d)/gi)].map(m=>+m[1]);const yr=yrs.length?Math.max(...yrs):'';
 const cl=(T.match(CLOSED)||[''])[0];
 const old=[/<font[ >]/.test(l)&&'font-tags',/<table[^>]*(width|cellpadding|bgcolor)/.test(l)&&'tabel-layout',/\.swf|<marquee|<frameset/.test(l)&&'flash/frames',(l.match(/jquery[\/\-.](1\.\d+)/)||[])[1]&&'jQuery 1.x',/bootstrap[\/@\-.]?[23]\.\d/.test(l)&&'Bootstrap 2/3',/http:\/\/[^"']+\.(js|css)/.test(l)&&'http-bestanden'].filter(Boolean).join(',');
 const gen=(h.match(/<meta[^>]+name=["']generator["'][^>]+content=["']([^"']{0,40})/i)||[])[1]||'';
 const title=(h.match(/<title[^>]*>([^<]{0,80})/i)||[])[1]||'';
 out.push([d,'OK',links.size,s.urls,s.prod,s.lm,/name=["']viewport/.test(l)?1:0,https,/name=["']description["']/.test(l)?1:0,/property=["']og:image/.test(l)?1:0,yr,r.lm?new Date(r.lm).getFullYear()||'':'',T.length,(h.match(/<img/gi)||[]).length,r.ms,/instagram\.com/.test(l)?1:0,/facebook\.com/.test(l)?1:0,cl.replace(/\|/g,' '),old,gen.replace(/\|/g,' '),moved,title.replace(/[|\n\r\t]/g,' ').trim().slice(0,50)].join('|'));}
let i=0;await Promise.all(Array.from({length:25},async()=>{while(i<doms.length){const d=doms[i++];try{await work(d);}catch(e){out.push([d,'ERR'].join('|'));}}}));
fs.writeFileSync('audit.tsv',out.join('\n'));
execSync('xz -9e -k -f audit.tsv && base64 -w0 audit.tsv.xz > a.b64 && rm -f ac_* && split -b 1900 -d -a 2 a.b64 ac_');
console.log('n',out.length,'dead',out.filter(x=>!x.includes('|OK|')).length,'b64',fs.statSync('a.b64').size,execSync('md5sum a.b64').toString());
