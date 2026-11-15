import 'server-only';
import { createHash } from 'node:crypto';

// Rate limiting shared by all Vercel instances, backed by the Postgres function rate_limit_hit().
// Falls back to a per-instance in-memory limiter only while the CRM is not configured
// (local development / previews without Supabase).

const URL_ = process.env.SUPABASE_URL?.replace(/\/$/, '');
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const memory = new Map<string, number[]>();

function memoryLimited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const list = (memory.get(key) || []).filter((t) => now - t < windowMs);
  list.push(now);
  memory.set(key, list);
  if (memory.size > 5000) memory.clear();
  return list.length > max;
}

export async function rateLimited(key: string, max: number, windowMs: number): Promise<boolean> {
  // Never store raw IPs: the key is hashed.
  const hashed = createHash('sha256').update(key).digest('hex').slice(0, 40);
  if (!URL_ || !KEY) return memoryLimited(hashed, max, windowMs);
  try {
    const res = await fetch(`${URL_}/rest/v1/rpc/rate_limit_hit`, {
      method: 'POST',
      headers: { apikey: KEY, authorization: `Bearer ${KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ p_key: hashed, p_max: max, p_window_seconds: Math.ceil(windowMs / 1000) }),
      cache: 'no-store',
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) throw new Error(String(res.status));
    return (await res.json()) === true;
  } catch {
    // Fail closed-ish: if the shared limiter is down, still apply the local one.
    return memoryLimited(hashed, max, windowMs);
  }
}

// On Vercel, x-forwarded-for is set by the platform; the first entry is the client.
export const clientIp = (h: Headers) => h.get('x-real-ip') || h.get('x-forwarded-for')?.split(',')[0].trim() || null;
