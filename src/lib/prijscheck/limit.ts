import 'server-only';

/**
 * Eenvoudige rem tegen misbruik: per IP een maximum aantal scans per uur, per serverinstantie.
 * Samen met het maandbudget in Vercel AI Gateway voorkomt dit onverwachte kosten.
 */
const hits = new Map<string, number[]>();
const WINDOW = 60 * 60 * 1000;

export function limited(ip: string, max: number, key = 'scan'): boolean {
  const k = `${key}:${ip}`;
  const now = Date.now();
  const list = (hits.get(k) || []).filter((t) => now - t < WINDOW);
  if (list.length >= max) { hits.set(k, list); return true; }
  list.push(now);
  hits.set(k, list);
  if (hits.size > 5000) hits.clear();
  return false;
}

export const ipFrom = (req: Request) => (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'onbekend';
