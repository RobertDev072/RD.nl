import type { ReactNode } from 'react';

export default function Marquee({ items, className = '' }: { items: ReactNode[]; className?: string }) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center gap-16 pr-16" aria-hidden={hidden || undefined}>
      {items.map((it, i) => <div key={i} className="shrink-0">{it}</div>)}
    </div>
  );
  return (
    <div className={'relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] ' + className}>
      <div className="flex w-max animate-marquee motion-reduce:animate-none">{row(false)}{row(true)}</div>
    </div>
  );
}
