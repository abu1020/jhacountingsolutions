import React, { useEffect, useRef } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  useReducedMotion,
  animate
} from 'framer-motion';
import { EASE_OUT_EXPO } from '../lib/motion';

interface CountingNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * Animated counter driven by a MotionValue: the number updates on the
 * compositor via framer-motion's DOM binding, so React re-renders ZERO
 * times during the count (the previous rAF + setState version re-rendered
 * the whole StatsBar subtree ~60x/sec and re-ran on every scroll pass).
 * Counts once, settles, and stays — the enterprise pattern.
 */
export const CountingNumber: React.FC<CountingNumberProps> = ({
  value,
  duration = 1.6,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = ''
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const prefersReducedMotion = useReducedMotion();

  const motionValue = useMotionValue(0);
  const displayText = useTransform(motionValue, (current) => {
    const formatted =
      decimals > 0
        ? current.toFixed(decimals)
        : Math.floor(current).toLocaleString('en-IN');
    return `${prefix}${formatted}${suffix}`;
  });

  useEffect(() => {
    if (!isInView) return;

    if (prefersReducedMotion) {
      motionValue.set(value);
      return;
    }

    const controls = animate(motionValue, value, {
      duration,
      ease: EASE_OUT_EXPO
    });
    return () => controls.stop();
  }, [isInView, value, duration, prefersReducedMotion, motionValue]);

  return (
    <motion.span ref={ref} className={`tabular-nums ${className}`}>
      {displayText}
    </motion.span>
  );
};
