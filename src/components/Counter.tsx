'use client';
import { animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function Counter({ to, suffix = '', duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration, ease: [0.2, 0.7, 0.2, 1], onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [inView, to, duration]);
  return <span ref={ref} className="tabular-nums">{v}{suffix}</span>;
}
