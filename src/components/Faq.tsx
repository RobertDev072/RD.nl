'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((it, i) => (
        <li key={it.q}>
          <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-6 py-6 text-left">
            <span className="text-[clamp(18px,1.6vw,22px)] font-semibold tracking-tight">{it.q}</span>
            <span className={'grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-500 ' + (open === i ? 'rotate-45 border-ink bg-ink text-white' : 'border-line')}><Plus size={18} /></span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }} className="overflow-hidden">
                <p className="max-w-[70ch] pb-7 text-[16px] leading-relaxed text-muted">{it.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </li>
      ))}
    </ul>
  );
}
