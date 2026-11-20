import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
interface PageTransitionProps { activeKey: string; children: React.ReactNode }
/** A short entrance only: navigation never waits for an exit animation. */
export function PageTransition({ activeKey, children }: PageTransitionProps) {
  const reduced = useReducedMotion();
  return <motion.div key={activeKey} initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.2, ease: 'easeOut' }}>{children}</motion.div>;
}
