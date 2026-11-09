'use client';
import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

const ease = [0.2, 0.7, 0.2, 1] as const;

export function Reveal({ children, delay = 0, y = 28, className, ...rest }: { children: ReactNode; delay?: number; y?: number } & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.9, ease, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Headline that reveals word by word. Words wrapped in *stars* render in the script accent. */
export function SplitHeading({ text, className, as = 'h2', delay = 0 }: { text: string; className?: string; as?: 'h1' | 'h2'; delay?: number }) {
  const Tag = motion[as];
  const words = text.split(' ');
  return (
    <Tag className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-10% 0px' }} aria-label={text.replace(/\*/g, '')}>
      {words.map((w, i) => {
        const accent = w.startsWith('*');
        const clean = w.replace(/\*/g, '');
        return (
          <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className={'inline-block ' + (accent ? 'script px-[0.04em] text-[1.18em] leading-[0.8]' : '')}
              variants={{ hidden: { y: '110%', opacity: 0 }, show: { y: '0%', opacity: 1 } }}
              transition={{ duration: 0.85, ease, delay: delay + i * 0.06 }}
            >
              {clean}
            </motion.span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </Tag>
  );
}
