import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ScrollRevealProps { children: React.ReactNode; className?: string; delayMs?: number }

export function ScrollReveal({ children, className, delayMs = 0 }: ScrollRevealProps) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, delay: Math.min(delayMs, 240) / 1000, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
