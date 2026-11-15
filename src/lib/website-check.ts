import 'server-only';
import { lookup as dnsLookup, type LookupAddress, type LookupOptions } from 'node:dns';
import http from 'node:http';
import https from 'node:https';
import { isIP } from 'node:net';

// Public website audit used by the free "Website-check". Runs on the server only.
// Safety: only http(s) on standard ports, public IP addresses only (re-checked on every
// redirect), short timeouts, size cap, no cookies or credentials sent.

const MAX_BYTES = 1_500_000;
const TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 4;
const UA = 'Mozilla/5.0 (compatible; LorvexWebsiteCheck/1.0; +https://lorvex.nl/website-check)';

export type Finding = { id: string; ok: boolean; title: string; detail: string; weight: number };
export type CheckResult = {
  url: string;
  finalUrl: string;
  domain: string;
  score: number;
  loadMs: number;
  pageKb: number;
  platform: string;
  findings: Finding[];
  /** Text on the page suggesting the business stopped or the domain is parked (evidence for verification). */
  inactiveSignal?: string;
};

export class CheckError extends Error {
  constructor(public code: 'invalid_url' | 'blocked' | 'unreachable' | 'not_html' | 'too_large', message: string) {
    super(message);
  }
}

export function normaliseUrl(input: string): URL {
  const raw = input.trim();
  if (!raw || raw.length > 300) throw new CheckError('invalid_url', 'Vul een geldig webadres in.');
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    throw new CheckError('invalid_url', 'Vul een geldig webadres in.');
  }
  if (!['http:', 'https:'].includes(url.protocol)) throw new CheckError('invalid_url', 'Alleen http en https worden ondersteund.');
  if (url.username || url.password) throw new CheckError('invalid_url', 'Vul een geldig webadres in.');
  if (url.port && !['80', '443'].includes(url.port)) throw new CheckError('blocked', 'Dit adres kan niet gecontroleerd worden.');
  const host = url.hostname.toLowerCase();
  if (!host.includes('.') || host.endsWith('.local') || host.endsWith('.internal') || host === 'localhost') {
    throw new CheckError('blocked', 'Dit adres kan niet gecontroleerd worden.');
  }
  url.hash = '';
  return url;
}

export function isPublicIp(ip: string): boolean {
  if (isIP(ip) === 4) {
    const [a, b] = ip.split('.').map(Number);
    if (a === 10 || a === 127 || a === 0 || a >= 224) return false;
    if (a === 169 && b === 254) return false;
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 192 && b === 168) return false;
    if (a === 100 && b >= 64 && b <= 127) return false; // CGNAT
    if (a === 192 && b === 0) return false;
    if (a === 198 && (b === 18 || b === 19)) return false;
    return true;
  }
  if (isIP(ip) === 6) {
    const v = ip.toLowerCase();
    if (v === '::' || v === '::1') return false;
    if (v.startsWith('fc') || v.startsWith('fd') || v.startsWith('fe8') || v.startsWith('fe9') || v.startsWith('fea') || v.startsWith('feb')) return false;
    if (v.startsWith('::ffff:')) return isPublicIp(v.slice(7));
    return true;
  }
  return false;
}

// DNS-rebinding-safe lookup: the address we validate is the address the socket connects to,
// because Node calls this function at connect time and uses exactly what we return.
function pinnedLookup(
  hostname: string,
  options: LookupOptions,
  cb: (err: NodeJS.ErrnoException | null, address: string | LookupAddress[], family?: number) => void
) {
  dnsLookup(hostname, { all: true }, (err, addrs) => {
    if (err) return cb(err, '');
    const list = (addrs as LookupAddress[]).filter((a) => isPublicIp(a.address));
    if (!list.length || list.length !== (addrs as LookupAddress[]).length) {
      const e: NodeJS.ErrnoException = new Error('blocked-address');
      e.code = 'EBLOCKED';
      return cb(e, '');
    }
    if (options.all) return cb(null, list);
    cb(null, list[0].address, list[0].family);
  });
}

type RawResponse = { status: number; location: string | null; contentType: string; body: string };

function requestOnce(url: URL): Promise<RawResponse> {
  if (isIP(url.hostname) && !isPublicIp(url.hostname)) {
    return Promise.reject(new CheckError('blocked', 'Dit adres kan niet gecontroleerd worden.'));
  }
  const mod = url.protocol === 'https:' ? https : http;
  return new Promise((resolve, reject) => {
    const req = mod.request(
      url,
      {
        method: 'GET',
        lookup: pinnedLookup,
        agent: false, // fresh socket per request: no reuse of a connection to another address
        timeout: TIMEOUT_MS,
        headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml', 'accept-language': 'nl-NL,nl;q=0.9' }
      },
      (res) => {
        const status = res.statusCode || 0;
        const location = (res.headers.location as string | undefined) || null;
        const contentType = String(res.headers['content-type'] || '');
        if ((status >= 300 && status < 400) || !contentType.includes('html')) {
          res.resume();
          return resolve({ status, location, contentType, body: '' });
        }
        const chunks: Buffer[] = [];
        let total = 0;
        res.on('data', (c: Buffer) => {
          total += c.length;
          if (total > MAX_BYTES) { res.destroy(); return; }
          chunks.push(c);
        });
        res.on('close', () => resolve({ status, location, contentType, body: Buffer.concat(chunks).toString('utf8') }));
        res.on('error', () => resolve({ status, location, contentType, body: Buffer.concat(chunks).toString('utf8') }));
      }
    );
    const deadline = setTimeout(() => req.destroy(new Error('timeout')), TIMEOUT_MS);
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', (err: NodeJS.ErrnoException) => {
      clearTimeout(deadline);
      reject(err.code === 'EBLOCKED' ? new CheckError('blocked', 'Dit adres kan niet gecontroleerd worden.') : err);
    });
    req.on('close', () => clearTimeout(deadline));
    req.end();
  });
}

async function safeFetch(start: URL): Promise<{ url: URL; ms: number; html: string }> {
  let url = start;
  const t0 = Date.now();
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    let res: RawResponse;
    try {
      res = await requestOnce(url);
    } catch (e) {
      if (e instanceof CheckError) throw e;
      if (hop === 0 && url.protocol === 'https:') {
        // Some small sites still only answer on http.
        url = new URL(url.href.replace(/^https:/, 'http:'));
        continue;
      }
      throw new CheckError('unreachable', 'Deze website is niet bereikbaar. Klopt het adres?');
    }
    if (res.status >= 300 && res.status < 400 && res.location) {
      url = normaliseUrl(new URL(res.location, url).href); // every hop is re-validated
      continue;
    }
    if (res.status < 200 || res.status >= 300) throw new CheckError('unreachable', `De website gaf een foutmelding (${res.status}).`);
    if (!res.contentType.includes('html')) throw new CheckError('not_html', 'Op dit adres staat geen webpagina.');
    return { url, ms: Date.now() - t0, html: res.body };
  }
  throw new CheckError('unreachable', 'De website stuurt te vaak door.');
}

const has = (re: RegExp, s: string) => re.test(s);

export function detectPlatform(html: string): string {
  const l = html.toLowerCase();
  const map: [string, string][] = [
    ['jwwb.nl', 'JouwWeb'], ['jouwweb', 'JouwWeb'], ['wixstatic', 'Wix'], ['cdn.shopify', 'Shopify'],
    ['woocommerce', 'WooCommerce'], ['mijnwebwinkel', 'Mijnwebwinkel'], ['myonlinestore', 'Mijnwebwinkel'],
    ['webshopapp', 'Lightspeed'], ['weebly', 'Weebly'], ['webnode', 'Webnode'], ['squarespace', 'Squarespace'],
    ['wp-content', 'WordPress'], ['joomla', 'Joomla'], ['/_next/', 'Next.js'], ['framer', 'Framer'], ['webflow', 'Webflow']
  ];
  for (const [needle, name] of map) if (l.includes(needle)) return name;
  return '';
}

export function analyse(html: string, finalUrl: URL, loadMs: number): Omit<CheckResult, 'url'> {
  const l = html.toLowerCase();
  const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const years = [...text.matchAll(/(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?(20\d\d)/gi)].map((m) => Number(m[1]));
  const year = years.length ? Math.max(...years) : 0;
  const now = new Date().getFullYear();
  const title = (html.match(/<title[^>]*>([^<]*)/i)?.[1] || '').trim();
  const pageKb = Math.round(Buffer.byteLength(html) / 1024);

  const f: Finding[] = [
    {
      id: 'https', ok: finalUrl.protocol === 'https:', weight: 15,
      title: 'Beveiligde verbinding (https)',
      detail: finalUrl.protocol === 'https:' ? 'Je website gebruikt een beveiligde verbinding.' : 'Browsers tonen "Niet veilig". Bezoekers haken daardoor sneller af en Google waardeert dit lager.'
    },
    {
      id: 'mobile', ok: has(/<meta[^>]+name=["']viewport/i, html), weight: 20,
      title: 'Geschikt voor mobiel',
      detail: has(/<meta[^>]+name=["']viewport/i, html) ? 'Je website is ingesteld voor telefoons.' : 'Je website is niet ingesteld voor telefoons. Meer dan de helft van je bezoekers zoekt op mobiel.'
    },
    {
      id: 'speed', ok: loadMs < 2500, weight: 15,
      title: 'Laadsnelheid',
      detail: `De pagina laadde in ${(loadMs / 1000).toFixed(1)} seconden.` + (loadMs < 2500 ? ' Dat is goed.' : ' Boven de 2,5 seconde haken veel bezoekers af.')
    },
    {
      id: 'title', ok: title.length >= 10 && title.length <= 70, weight: 10,
      title: 'Titel voor Google',
      detail: title ? `Je paginatitel is: "${title.slice(0, 80)}".` + (title.length >= 10 && title.length <= 70 ? '' : ' Die is te kort of te lang voor Google.') : 'Je website heeft geen titel. Google weet dan niet goed waar je pagina over gaat.'
    },
    {
      id: 'description', ok: has(/<meta[^>]+name=["']description["'][^>]+content=["'][^"']{50,}/i, html), weight: 10,
      title: 'Omschrijving in Google',
      detail: has(/<meta[^>]+name=["']description/i, html) ? 'Er is een omschrijving voor zoekmachines.' : 'Er is geen omschrijving voor Google. Google kiest dan zelf een willekeurig stukje tekst.'
    },
    {
      id: 'contact', ok: has(/href=["'](?:tel:|https?:\/\/(?:wa\.me|api\.whatsapp\.com))/i, html), weight: 10,
      title: 'Direct bellen of appen',
      detail: has(/href=["'](?:tel:|https?:\/\/(?:wa\.me|api\.whatsapp\.com))/i, html) ? 'Bezoekers kunnen je met één tik bellen of appen.' : 'Er is geen knop om direct te bellen of te appen. Op mobiel kost dat je aanvragen.'
    },
    {
      id: 'booking', ok: has(/afspraak|reserveer|reserveren|boek nu|book now|booking|salonized|treatwell|planway|calendly/i, l), weight: 10,
      title: 'Online afspraak of reservering',
      detail: has(/afspraak|reserveer|reserveren|boek nu|book now|booking|salonized|treatwell|planway|calendly/i, l) ? 'Klanten kunnen online een afspraak of reservering maken of aanvragen.' : 'Klanten kunnen niet online een afspraak maken. Dat kan dag en nacht nieuwe klanten opleveren.'
    },
    {
      id: 'fresh', ok: !year || year >= now - 1, weight: 5,
      title: 'Actueel',
      detail: year && year < now - 1 ? `Onderaan staat © ${year}. Dat geeft bezoekers de indruk dat de website niet meer wordt bijgehouden.` : 'De website oogt actueel.'
    },
    {
      id: 'social', ok: has(/property=["']og:image/i, html), weight: 5,
      title: 'Voorbeeld bij delen',
      detail: has(/property=["']og:image/i, html) ? 'Bij delen via WhatsApp of social media verschijnt een afbeelding.' : 'Als iemand je website deelt via WhatsApp, verschijnt er geen mooie preview.'
    }
  ];
  const total = f.reduce((s, x) => s + x.weight, 0);
  const score = Math.round((f.filter((x) => x.ok).reduce((s, x) => s + x.weight, 0) / total) * 100);
  const inactive = text.match(/definitief gesloten|permanent gesloten|wij zijn gestopt|we zijn gestopt|is gestopt|opgeheven|failliet|domein(naam)? (is )?te koop|domain (is )?for sale|this domain is parked|binnenkort online|coming soon|under construction|website in aanbouw/i);
  return { finalUrl: finalUrl.href, domain: finalUrl.hostname.replace(/^www\./, ''), score, loadMs, pageKb, platform: detectPlatform(html), findings: f, inactiveSignal: inactive?.[0] };
}

export async function checkWebsite(input: string): Promise<CheckResult> {
  return (await checkWebsiteWithHtml(input)).result;
}

/** Same as checkWebsite, but also returns the HTML (for brand extraction; never stored raw). */
export async function checkWebsiteWithHtml(input: string): Promise<{ result: CheckResult; html: string; finalUrl: URL }> {
  const start = normaliseUrl(input);
  const { url, ms, html } = await safeFetch(start);
  return { result: { url: start.href, ...analyse(html, url, ms) }, html, finalUrl: url };
}
