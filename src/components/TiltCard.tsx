'use client';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { ReactNode, PointerEvent } from 'react';

export default function TiltCard({ children, className = '', max = 9 }: { children: ReactNode; className?: string; max?: number }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const sx = useSpring(x, { stiffness: 180, damping: 18 });
  const sy = useSpring(y, { stiffness: 180, damping: 18 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, rgba(31,92,255,.16), transparent 60%)`;

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width);
    y.set((e.clientY - r.top) / r.height);
  };
  const leave = () => { x.set(0.5); y.set(0.5); };

  return (
    <div style={{ perspective: 1100 }} className="h-full">
      <motion.div
        onPointerMove={move}
        onPointerLeave={leave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.015 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className={'group relative h-full ' + className}
      >
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: glare }} />
        {children}
      </motion.div>
    </div>
  );
}
