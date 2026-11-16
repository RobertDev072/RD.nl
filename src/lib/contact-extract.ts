// Business contact details published on the company's own website (no paid AI, no external lookups).
// Phone: prefers a Dutch mobile (06) number, then a landline. E-mail: prefers mailto links on the site's domain.

const NL_PHONE = /(?:\+31|0031|\b0)[\s.-]?(?:\(0\)[\s.-]?)?(?:[1-9](?:[\s.-]?\d){8})\b/g;
const EMAIL = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
const JUNK_EMAIL = /\.(png|jpe?g|gif|svg|webp|css|js)$|example\.|sentry|wixpress|domain\.|email\.com$|yourdomain|@2x/i;

/** Normalises a Dutch number to 0xx-format digits (e.g. "+31 6 1234 5678" → "0612345678"); null if not Dutch. */
export function normaliseNlPhone(raw: string): string | null {
  let d = raw.replace(/\(0\)/g, '').replace(/[^\d+]/g, '');
  if (d.startsWith('+31')) d = '0' + d.slice(3);
  else if (d.startsWith('0031')) d = '0' + d.slice(4);
  if (!/^0[1-9]\d{8}$/.test(d)) return null;
  if (/^0(800|900|906|909)/.test(d)) return null; // service numbers
  return d;
}

export const isMobile = (p: string | null) => Boolean(p && /^06\d{8}$/.test(p.replace(/\D/g, '').replace(/^316/, '06')));

export function extractContacts(html: string, siteUrl: string): { phone: string | null; email: string | null } {
  const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ');
  const phones = new Set<string>();
  for (const m of text.matchAll(/href=["']tel:([^"']+)["']/gi)) { const p = normaliseNlPhone(decodeURIComponent(m[1])); if (p) phones.add(p); }
  for (const m of text.replace(/<[^>]+>/g, ' ').matchAll(NL_PHONE)) { const p = normaliseNlPhone(m[0]); if (p) phones.add(p); }
  const list = [...phones];
  const phone = list.find((p) => p.startsWith('06')) ?? list[0] ?? null;

  let host = '';
  try { host = new URL(siteUrl).hostname.replace(/^www\./, '').toLowerCase(); } catch { /* ignore */ }
  const emails = new Set<string>();
  for (const m of text.matchAll(/href=["']mailto:([^"'?]+)/gi)) { const e = decodeURIComponent(m[1]).trim().toLowerCase(); if (!JUNK_EMAIL.test(e)) emails.add(e); }
  for (const m of text.matchAll(EMAIL)) { const e = m[0].toLowerCase(); if (!JUNK_EMAIL.test(e)) emails.add(e); }
  const elist = [...emails].filter((e) => /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(e));
  const email = elist.find((e) => host && e.endsWith('@' + host)) ?? elist[0] ?? null;
  return { phone, email };
}

/** Readable Dutch format: 06-12345678 or 072-5112233 (best effort). */
export function formatPhone(p: string | null): string | null {
  if (!p) return null;
  const d = normaliseNlPhone(p);
  if (!d) return p;
  if (d.startsWith('06')) return `06-${d.slice(2)}`;
  const three = /^0(10|13|15|20|23|24|26|30|33|35|36|38|40|43|45|46|50|53|55|58|70|71|72|73|74|75|76|77|78|79|85|88|91)/.test(d);
  return three ? `${d.slice(0, 3)}-${d.slice(3)}` : `${d.slice(0, 4)}-${d.slice(4)}`;
}
