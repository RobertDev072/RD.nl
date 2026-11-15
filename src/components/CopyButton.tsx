'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" onClick={() => navigator.clipboard.writeText(text).then(() => { setDone(true); setTimeout(() => setDone(false), 2000); })}
      className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-white">
      {done ? <><Check size={16} /> Gekopieerd</> : <><Copy size={16} /> Kopieer tekst</>}
    </button>
  );
}
