import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { crossfadePanel } from '../lib/motion';

interface PageTransitionProps {
  children: React.ReactNode;
  activeKey: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, activeKey }) => {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={activeKey}
        variants={crossfadePanel}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
