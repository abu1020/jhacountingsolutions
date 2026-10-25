import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  activeKey: string;
  children: React.ReactNode;
}

/**
 * Route switch: instant view swap with a quick 120ms opacity fade.
 * No exit animation — navigation never waits on the outgoing page.
 */
export function PageTransition({ activeKey, children }: PageTransitionProps) {
  return (
    <motion.div
      key={activeKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.12 }}
    >
      {children}
    </motion.div>
  );
}
