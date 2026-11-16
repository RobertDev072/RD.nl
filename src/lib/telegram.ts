import 'server-only';

// Sends a message to Robert's own Telegram chat via the Telegram Bot API (free).
// Needs TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID; without them it does nothing.
export const telegramConfigured = () => Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);

export const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function sendTelegram(html: string): Promise<boolean> {
  if (!telegramConfigured()) return false;
  // Telegram limit is 4096 characters per message: split on blank lines.
  const parts: string[] = [];
  let cur = '';
  for (const block of html.split('\n\n')) {
    if ((cur + '\n\n' + block).length > 3900 && cur) { parts.push(cur); cur = block; } else cur = cur ? cur + '\n\n' + block : block;
  }
  if (cur) parts.push(cur);
  let ok = true;
  for (const text of parts) {
    const r = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text, parse_mode: 'HTML', disable_web_page_preview: true }),
      signal: AbortSignal.timeout(10_000)
    }).catch(() => null);
    if (!r?.ok) ok = false;
  }
  return ok;
}
