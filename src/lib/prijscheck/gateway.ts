import 'server-only';
import { getVercelOidcToken } from '@vercel/oidc';

/**
 * Praat met modellen via Vercel AI Gateway (Anthropic-compatibele Messages API).
 * Op Vercel authenticeert dit automatisch via OIDC; lokaal kan AI_GATEWAY_API_KEY gezet worden.
 */
const BASE = 'https://ai-gateway.vercel.sh/v1/messages';
export const MODEL_FAST = process.env.PRIJSCHECK_MODEL_FAST || 'anthropic/claude-haiku-5.5';
export const MODEL_DESIGN = process.env.PRIJSCHECK_MODEL_DESIGN || 'anthropic/claude-sonnet-5.5';

async function token(): Promise<string> {
  if (process.env.AI_GATEWAY_API_KEY) return process.env.AI_GATEWAY_API_KEY;
  try {
    return await getVercelOidcToken();
  } catch {
    throw new GatewayError('AI is op dit moment niet beschikbaar.');
  }
}

export class GatewayError extends Error {}

type Msg = { role: 'user' | 'assistant'; content: string };

async function call(body: Record<string, unknown>) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { authorization: `Bearer ${await token()}`, 'content-type': 'application/json', 'anthropic-version': '2023-06-01' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('[prijscheck] gateway', res.status, detail.slice(0, 400));
    throw new GatewayError(res.status === 402 || res.status === 429 ? 'De AI is even druk. Probeer het over een paar minuten opnieuw.' : 'AI is op dit moment niet beschikbaar.');
  }
  return res;
}

export async function complete(opts: { model: string; system: string; messages: Msg[]; maxTokens: number }): Promise<string> {
  const res = await call({ model: opts.model, system: opts.system, messages: opts.messages, max_tokens: opts.maxTokens });
  const json = (await res.json()) as { content?: { type: string; text?: string }[] };
  return (json.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('');
}

/** Streamt alleen de tekst-delta's als platte tekst. */
export async function streamText(opts: { model: string; system: string; messages: Msg[]; maxTokens: number }): Promise<ReadableStream<Uint8Array>> {
  const res = await call({ model: opts.model, system: opts.system, messages: opts.messages, max_tokens: opts.maxTokens, stream: true });
  const reader = res.body!.getReader();
  const dec = new TextDecoder();
  const enc = new TextEncoder();
  let buf = '';
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) { controller.close(); return; }
      buf += dec.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop() || '';
      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (!data || data === '[DONE]') continue;
        try {
          const ev = JSON.parse(data) as { type: string; delta?: { type?: string; text?: string } };
          if (ev.type === 'content_block_delta' && ev.delta?.text) controller.enqueue(enc.encode(ev.delta.text));
        } catch { /* onvolledige regel */ }
      }
    },
    cancel() { reader.cancel().catch(() => {}); }
  });
}

/** Haalt het eerste JSON-object uit een modelantwoord. */
export function parseJson<T>(text: string): T {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end < start) throw new GatewayError('De analyse is niet gelukt. Probeer het opnieuw.');
  return JSON.parse(text.slice(start, end + 1)) as T;
}
