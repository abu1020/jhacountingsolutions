import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
interface ScrollRevealProps { children: React.ReactNode; className?: string; delayMs?: number }
export function ScrollReveal({ children, className, delayMs = 0 }: ScrollRevealProps) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return <motion.div className={className} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -30px 0px' }} transition={{ duration: .5, delay: Math.min(delayMs, 240) / 1000, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
