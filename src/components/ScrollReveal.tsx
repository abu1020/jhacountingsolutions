import React from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Kept for API compatibility — staggered entrance delays were removed
   *  so content paints immediately when it enters the viewport. */
  delayMs?: number;
}

/**
 * Scroll-triggered reveal: fast opacity-only fade (no translate, no delay).
 * Global MotionConfig reducedMotion="user" keeps it instant for
 * motion-sensitive users.
 */
export function ScrollReveal({ children, className }: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.22 }}
    >
      {children}
    </motion.div>
  );
}
