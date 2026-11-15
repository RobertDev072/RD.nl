import { NextResponse } from 'next/server';
import { rest } from '@/lib/crm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ACTIONS = new Set(['letter_delivered', 'contacted', 'proposal', 'won', 'lost', 'note']);

// Protected by middleware (Basic Auth). Plain HTML form posts → redirect back to /admin.
export async function POST(req: Request) {
  const f = await req.formData();
  const id = String(f.get('id') || ''), action = String(f.get('action') || '');
  if (!/^[0-9a-f-]{36}$/.test(id) || !ACTIONS.has(action)) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  await rest('rpc/admin_update_lead', { method: 'POST', prefer: 'return=minimal', body: JSON.stringify({ p_id: id, p_action: action, p_note: null }) });
  return NextResponse.redirect(new URL('/admin', req.url), 303);
}
