// Screenshots van de live House of Nails-preview (desktop + mobiel)
import { chromium, devices } from 'playwright';
import fs from 'fs';
const U = 'https://house-of-nails-concept.vercel.app';
const out = '/vercel/p/h'; fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch();
const settle = async p => { await p.waitForLoadState('networkidle').catch(() => {}); await p.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].filter(i => !i.complete).map(i => new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 5000); }))); }); await p.waitForTimeout(800); };
const lazyAll = async p => { await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); } scrollTo(0, 0); }); await settle(p); };
const to = async (p, sel, off) => { await p.evaluate(([s, o]) => scrollTo(0, document.querySelector(s).getBoundingClientRect().top + scrollY - o), [sel, off]); await p.waitForTimeout(900); };
const shot = (p, n) => p.screenshot({ path: `${out}/${n}.jpg`, type: 'jpeg', quality: 82 });
const log = [];
async function run(name, o, fn) { const ctx = await b.newContext(o); const p = await ctx.newPage(); try { await fn(p); log.push(name + ' ok'); } catch (e) { log.push(name + ' ERR ' + e.message.slice(0, 140)); } await ctx.close(); }
const D = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 };
const M = { ...devices['iPhone 13'] };
async function checkout(p) {
  await p.goto(U + '/behandelingen/biab-nieuwe-set'); await settle(p);
  await p.click('.choice >> nth=1'); await p.click('.xopt >> nth=0');
  await p.evaluate(() => [...document.querySelectorAll('.pbuy .btn, .stickybuy .btn')].find(b => b.offsetParent && /datum/i.test(b.textContent)).click());
  await p.waitForURL('**/afrekenen'); await settle(p);
  await p.click('.day:not([disabled]) >> nth=2'); await p.click('.slot >> nth=3'); await p.waitForTimeout(300);
  await p.fill('#name', 'Sanne de Vries'); await p.fill('#email', 'sanne@voorbeeld.nl'); await p.fill('#phone', '06 12345678');
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(500);
}
await run('d-home', D, async p => { await p.goto(U + '/'); await settle(p); await lazyAll(p); await shot(p, 'd-home');
  await to(p, '.tgrid', 160); await shot(p, 'd-home2'); await to(p, 'section.dark', 0); await shot(p, 'd-home3'); await to(p, '.giftband', 60); await shot(p, 'd-home4'); await to(p, '.info3', 120); await shot(p, 'd-home5'); });
await run('d-list', D, async p => { await p.goto(U + '/behandelingen'); await settle(p); await lazyAll(p); await p.evaluate(() => scrollTo(0, 180)); await p.waitForTimeout(600); await shot(p, 'd-list'); });
await run('d-detail', D, async p => { await p.goto(U + '/behandelingen/biab-nieuwe-set'); await settle(p); await p.click('.choice >> nth=1'); await p.click('.choice >> nth=2'); await p.click('.xopt >> nth=0'); await p.waitForTimeout(400); await shot(p, 'd-detail'); });
await run('d-checkout', D, async p => { await checkout(p); await shot(p, 'd-checkout'); });
await run('d-gift', D, async p => { await p.goto(U + '/cadeaubon'); await settle(p); await p.click('.amt >> nth=2'); await p.fill('#gto', 'Mama'); await p.fill('#gmsg', 'Fijne verjaardag, geniet ervan!'); await p.waitForTimeout(400); await shot(p, 'd-gift'); });
await run('d-prijzen', D, async p => { await p.goto(U + '/prijzen'); await settle(p); await p.evaluate(() => scrollTo(0, 120)); await p.waitForTimeout(400); await shot(p, 'd-prijzen'); });
await run('d-impressie', D, async p => { await p.goto(U + '/impressie'); await settle(p); await lazyAll(p); await p.evaluate(() => scrollTo(0, 200)); await p.waitForTimeout(600); await shot(p, 'd-impressie'); await p.click('.gal button >> nth=4'); await settle(p); await shot(p, 'd-lightbox'); });
await run('m-home', M, async p => { await p.goto(U + '/'); await settle(p); await lazyAll(p); await shot(p, 'm-home'); await to(p, '.tgrid', 130); await shot(p, 'm-home2'); });
await run('m-detail', M, async p => { await p.goto(U + '/behandelingen/biab-nieuwe-set'); await settle(p); await p.click('.choice >> nth=1'); await p.click('.xopt >> nth=0'); await p.evaluate(() => scrollTo(0, 420)); await p.waitForTimeout(600); await shot(p, 'm-detail'); });
await run('m-checkout', M, async p => { await checkout(p); await to(p, '.days', 140); await shot(p, 'm-checkout'); });
await run('m-gift', M, async p => { await p.goto(U + '/cadeaubon'); await settle(p); await p.click('.amt >> nth=1'); await p.fill('#gto', 'Mama'); await p.evaluate(() => scrollTo(0, 60)); await p.waitForTimeout(500); await shot(p, 'm-gift'); });
await run('m-gallery', M, async p => { await p.goto(U + '/impressie'); await settle(p); await lazyAll(p); await p.evaluate(() => scrollTo(0, 250)); await p.waitForTimeout(600); await shot(p, 'm-gallery'); });
await run('m-menu', M, async p => { await p.goto(U + '/'); await settle(p); await p.click('.menubtn'); await p.waitForTimeout(900); await shot(p, 'm-menu'); });
await run('m-reviews', M, async p => { await p.goto(U + '/reviews'); await settle(p); await shot(p, 'm-reviews'); });
await b.close();
fs.writeFileSync('/vercel/p/hshots.log', log.join('\n'));
console.log(log.join('\n'));
