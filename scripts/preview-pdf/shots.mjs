// Maakt screenshots van de live preview (desktop + mobiel)
import { chromium, devices } from 'playwright';
import fs from 'fs';
const U = 'https://jehaarwinkel-concept.vercel.app';
const out = '/vercel/p/s'; fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch();
const settle = async p => { await p.waitForLoadState('networkidle').catch(() => {}); await p.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].filter(i => !i.complete && i.loading !== 'lazy').map(i => new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 4000); }))); }); await p.waitForTimeout(700); };
const lazyAll = async p => { await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } scrollTo(0, 0); }); await p.waitForTimeout(800); };
const shot = (p, n) => p.screenshot({ path: `${out}/${n}.jpg`, type: 'jpeg', quality: 82 });
const log = [];
async function run(name, ctxOpts, fn) {
  const ctx = await b.newContext(ctxOpts); const p = await ctx.newPage();
  try { await fn(p); log.push(name + ' ok'); } catch (e) { log.push(name + ' ERR ' + e.message.slice(0, 120)); }
  await ctx.close();
}
const D = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 };
const M = { ...devices['iPhone 13'] };

await run('d-home', D, async p => { await p.goto(U + '/'); await settle(p); await lazyAll(p); await shot(p, 'd-home');
  await p.evaluate(() => scrollTo(0, document.querySelector('.ptiles').getBoundingClientRect().top + scrollY - 120)); await p.waitForTimeout(900); await shot(p, 'd-home2');
  await p.evaluate(() => scrollTo(0, document.querySelector('.lines3').getBoundingClientRect().top + scrollY - 140)); await p.waitForTimeout(900); await shot(p, 'd-home3');
  await p.evaluate(() => scrollTo(0, document.querySelector('.advice').getBoundingClientRect().top + scrollY - 140)); await p.waitForTimeout(900); await shot(p, 'd-home4'); });
await run('d-mega', D, async p => { await p.goto(U + '/'); await settle(p); await p.hover('.nav-item:nth-child(2) .nav-link'); await p.waitForTimeout(700); await shot(p, 'd-mega'); });
await run('d-shop', D, async p => { await p.goto(U + '/shop'); await settle(p); await p.waitForSelector('.card'); await lazyAll(p); await p.evaluate(() => scrollTo(0, 120)); await p.waitForTimeout(600); await shot(p, 'd-shop'); });
await run('d-search', D, async p => { await p.goto(U + '/'); await settle(p); await p.click('#hq'); await p.keyboard.type('zilver', { delay: 60 }); await p.waitForTimeout(1200); await shot(p, 'd-search'); });
await run('d-quick', D, async p => { await p.goto(U + '/shop'); await settle(p); await p.waitForSelector('.card'); await p.hover('.card >> nth=1'); await p.click('.card >> nth=1 >> .qbtn'); await p.waitForTimeout(1200); await shot(p, 'd-quick'); });
let pdpUrl = '';
await run('d-pdp', D, async p => { await p.goto(U + '/shop'); await settle(p); await p.waitForSelector('.card'); pdpUrl = await p.$eval('.card .name', a => a.getAttribute('href'));
  const v = await p.$$eval('.card', cs => { const c = cs.find(c => c.querySelector('.opts') && c.querySelector('.badge.sale')) || cs.find(c => c.querySelector('.opts')); return c ? c.querySelector('.name').getAttribute('href') : null; }); if (v) pdpUrl = v;
  await p.goto(U + pdpUrl); await settle(p); await shot(p, 'd-pdp'); });
await run('d-cart', D, async p => { await p.goto(U + '/shop'); await settle(p); await p.waitForSelector('.card');
  const btns = await p.$$('.card .addbtn'); let n = 0; for (const bt of btns) { const l = await bt.getAttribute('aria-label'); if (l && l.includes('in winkelmand') && n < 3) { await bt.click(); n++; await p.waitForTimeout(400); } }
  await p.click('.hcart'); await p.waitForTimeout(1200); await shot(p, 'd-cart');
  await p.goto(U + '/afrekenen'); await settle(p); await shot(p, 'd-checkout'); });
await run('d-advies', D, async p => { await p.goto(U + '/advies?doel=verzorging'); await settle(p); await p.click('.adv-card >> nth=5'); await p.waitForTimeout(1200); await p.evaluate(() => scrollTo(0, 260)); await p.waitForTimeout(500); await shot(p, 'd-advies'); });

await run('m-home', M, async p => { await p.goto(U + '/'); await settle(p); await lazyAll(p); await shot(p, 'm-home'); await p.evaluate(() => scrollTo(0, document.querySelector('.ptiles').getBoundingClientRect().top + scrollY - 90)); await p.waitForTimeout(900); await shot(p, 'm-home2'); });
await run('m-shop', M, async p => { await p.goto(U + '/shop'); await settle(p); await p.waitForSelector('.card'); await lazyAll(p); await p.evaluate(() => scrollTo(0, 330)); await p.waitForTimeout(700); await shot(p, 'm-shop'); await p.click('.filterbtn'); await p.waitForTimeout(900); await shot(p, 'm-filter'); });
await run('m-search', M, async p => { await p.goto(U + '/'); await settle(p); await p.click('.bnav button'); await p.waitForTimeout(400); await p.keyboard.type('orchid', { delay: 60 }); await p.waitForTimeout(1200); await shot(p, 'm-search'); });
await run('m-pdp', M, async p => { await p.goto(U + pdpUrl); await settle(p); await shot(p, 'm-pdp'); });
await run('m-quick', M, async p => { await p.goto(U + '/shop'); await settle(p); await p.waitForSelector('.card'); const i = await p.$$eval('.card', cs => cs.findIndex(c => c.querySelector('.opts'))); if (i >= 0) { await p.click(`.card >> nth=${i} >> .addbtn`); await p.waitForTimeout(1200); } await shot(p, 'm-quick'); });
await run('m-cart', M, async p => { await p.goto(U + '/shop'); await settle(p); await p.waitForSelector('.card');
  const btns = await p.$$('.card .addbtn'); let n = 0; for (const bt of btns) { const l = await bt.getAttribute('aria-label'); if (l && l.includes('in winkelmand') && n < 2) { await bt.click(); n++; await p.waitForTimeout(400); } }
  await p.click('.bnav .cart'); await p.waitForTimeout(1200); await shot(p, 'm-cart');
  await p.goto(U + '/afrekenen'); await settle(p); await shot(p, 'm-checkout'); });
await run('m-menu', M, async p => { await p.goto(U + '/'); await settle(p); await p.click('.menubtn'); await p.waitForTimeout(800); await p.click('.mnav details >> nth=0 >> summary'); await p.waitForTimeout(500); await shot(p, 'm-menu'); });
await b.close();
fs.writeFileSync('/vercel/p/shots.log', log.join('\n') + '\npdp ' + pdpUrl + '\n');
console.log(log.join('\n'));
