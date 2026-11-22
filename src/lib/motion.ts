import type { Variants, Transition } from 'framer-motion';

/**
 * JAS Motion System — single source of truth for smooth, GPU-composited animation.
 *
 *  - Animates `transform` and `opacity` ONLY (zero layout thrash).
 *  - Respects `prefers-reduced-motion` globally via <MotionConfig reducedMotion="user">.
 *  - Uses a silky deceleration curve ([0.22, 1, 0.36, 1]) for fluid entrances.
 */

export const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_IN: [number, number, number, number] = [0.4, 0, 1, 1];

export const DURATION = {
  micro: 0.14,
  fast: 0.18,
  panel: 0.26,
  reveal: 0.42,
} as const;

export const transitionMicro: Transition = { duration: DURATION.micro, ease: EASE_OUT_EXPO };
export const transitionPanel: Transition = { duration: DURATION.panel, ease: EASE_OUT_EXPO };

/** Smooth content entrance with subtle vertical glide. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.reveal, ease: EASE_OUT_EXPO, delay },
  }),
  exit: { opacity: 0, y: -4, transition: { duration: DURATION.fast, ease: EASE_IN } },
};

/** Parent that staggers `fadeUp` children smoothly. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

/** Modal / dialog panel: subtle scale + vertical settle. */
export const scaleInPanel: Variants = {
  hidden: { opacity: 0, scale: 0.985, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: DURATION.panel, ease: EASE_OUT_EXPO },
  },
  exit: {
    opacity: 0,
    scale: 0.985,
    y: 6,
    transition: { duration: DURATION.fast, ease: EASE_IN },
  },
};

/** Smooth cross-fading detail panels (e.g. GST state switch, workspace tabs). */
export const crossfadePanel: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.panel, ease: EASE_OUT_EXPO },
  },
  exit: { opacity: 0, y: -4, transition: { duration: DURATION.fast, ease: EASE_IN } },
};

/** Shared-element spring for active-tab pills / nav indicators (layoutId). */
export const springPill: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 34,
  mass: 0.85,
};

/** Press feedback for primary CTAs. */
export const tapScale = { scale: 0.985 } as const;
