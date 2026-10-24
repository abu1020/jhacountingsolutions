import React from 'react';
import { motion } from 'framer-motion';
import { EASE_OUT_EXPO, DURATION } from '../lib/motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  staggerMs?: number;
  delayMs?: number;
}

/**
 * Scroll-triggered reveal (API unchanged from the previous
 * IntersectionObserver version, so every call site upgrades for free).
 *
 * Improvements over the hand-rolled observer:
 *  - `once: true` — content never re-hides/re-animates on scroll-back
 *    (re-animating financial data on every pass erodes trust and wastes frames).
 *  - No permanent `will-change` layers — Framer Motion promotes only
 *    during the animation, then releases the compositor layer.
 *  - `prefers-reduced-motion` is honoured globally by
 *    <MotionConfig reducedMotion="user"> (transform collapses, fade remains).
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  staggerMs = 0,
  delayMs = 0
}) => {
  const totalDelay = Math.min(250, delayMs + staggerMs) / 1000;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px 60px 0px' }}
      transition={{ duration: DURATION.reveal, ease: EASE_OUT_EXPO, delay: totalDelay }}
    >
      {children}
    </motion.div>
  );
};
