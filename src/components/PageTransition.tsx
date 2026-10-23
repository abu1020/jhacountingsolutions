import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  activeKey: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, activeKey }) => {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={activeKey}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ willChange: 'opacity, transform' }}
        className="w-full transform-gpu"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
