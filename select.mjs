import fs from 'fs';import {execSync} from 'child_process';
const EX=new Set((fs.readFileSync('ex.txt','utf8')+' '+fs.readFileSync('ex2.txt','utf8')).split(/\s+/).filter(Boolean));
const all=JSON.parse(fs.readFileSync('all.json','utf8'));
const SIMPLE=/JouwWeb|Wix|Weebly|Webnode|Mijnwebwinkel|Sitebuilder|Joomla|OpenCart|CCV Shop|Shoptrader|PrestaShop/;
const rows=[];
for(const c of all){if(c.dead)continue;c.m=(c.m||[]).filter(n=>!EX.has(n));if(EX.has(c.d))continue;
 let s=0;if(c.m.length)s+=6;if(c.shop)s+=3;if(SIMPLE.test(c.pl||''))s+=3;if(!c.vp)s+=3;if(c.yr&&+c.yr<=2022)s+=2;if(c.o)s+=1;s+=(45-c.dist)/15;c.s=s;rows.push(c);}
const cnt={};for(const c of rows)for(const n of c.m)cnt[n]=(cnt[n]||0)+1;for(const c of rows){const b=c.m.length;c.m=c.m.filter(n=>cnt[n]==1);if(b&&!c.m.length)c.s-=6;}
rows.sort((a,b)=>b.s-a.s);
const top=rows.slice(0,+process.argv[2]||320);
const cl=x=>String(x??'').replace(/[\t\n\r|]/g,' ').trim();
const tsv=top.map(c=>[cl(c.name).slice(0,45),cl(c.type).slice(0,22),cl(c.city).slice(0,22),c.d,c.m[0]||'',cl(c.ph).slice(0,18),cl(c.o),c.pl||'',c.shop,c.vp,c.yr,cl(c.em).slice(0,45),c.dist].join('|')).join('\n');
fs.writeFileSync('top.tsv',tsv);
execSync('xz -9e -k -f top.tsv && base64 -w0 top.tsv.xz > top.b64 && rm -f ch_* && split -b 1900 -d -a 2 top.b64 ch_');
console.log('rows',rows.length,'top',top.length,'mob',top.filter(c=>c.m.length).length,'shop',top.filter(c=>c.shop).length,'simple',top.filter(c=>SIMPLE.test(c.pl||'')).length,'novp',top.filter(c=>!c.vp).length,'owner',top.filter(c=>c.o).length,'allmob',rows.filter(c=>c.m.length).length,'b64',fs.statSync('top.b64').size,'chunks',fs.readdirSync('.').filter(f=>f.startsWith('ch_')).length);
console.log(top.slice(0,6).map(c=>[c.name,c.d,c.m[0],c.o,c.pl,c.shop].join(' ; ')).join('\n'));
