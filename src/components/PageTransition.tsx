import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface PageTransitionProps { activeKey: string; children: React.ReactNode }

/** Smooth GPU-composited entrance when switching views. */
export function PageTransition({ activeKey, children }: PageTransitionProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      key={activeKey}
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
