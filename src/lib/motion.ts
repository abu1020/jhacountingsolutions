import type { Variants, Transition } from 'framer-motion';

/**
 * JAS Motion System — single source of truth for animation.
 *
 * Rules (see docs/UI_UX_ENTERPRISE_REVIEW.md §3):
 *  - Animate `transform` and `opacity` ONLY. Never width/height/top/left
 *    on content surfaces (layout thrash = jank during data-heavy tasks).
 *  - Micro-interactions ≤ 200ms, panel transitions ≤ 280ms, reveals ≤ 450ms.
 *  - Every variant must remain legible with `prefers-reduced-motion`
 *    (handled globally via <MotionConfig reducedMotion="user"> in main.tsx,
 *    which collapses transform movement while keeping opacity feedback).
 *  - One easing family: ease-out-expo for entrances (fast start, soft settle
 *    = "precise instrument" feel), ease-in for exits (shorter than entrances).
 */

export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_IN: [number, number, number, number] = [0.4, 0, 1, 1];

export const DURATION = {
  micro: 0.15, // hover / press feedback
  fast: 0.2, // tabs, chips, tooltips
  panel: 0.28, // modals, drawers, tab panels
  reveal: 0.45, // scroll reveals, hero choreography
} as const;

export const transitionMicro: Transition = { duration: DURATION.micro, ease: EASE_OUT_EXPO };
export const transitionPanel: Transition = { duration: DURATION.panel, ease: EASE_OUT_EXPO };

/** Standard content entrance: 14px rise + fade. Use for cards & sections. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.reveal, ease: EASE_OUT_EXPO, delay },
  }),
  exit: { opacity: 0, y: -8, transition: { duration: DURATION.fast, ease: EASE_IN } },
};

/** Parent that staggers `fadeUp` children. Cap total stagger ≈ 400ms. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

/** Modal / dialog panel: scale from 0.97 + 8px rise. Never animate layout size. */
export const scaleInPanel: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: DURATION.panel, ease: EASE_OUT_EXPO },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 4,
    transition: { duration: DURATION.fast, ease: EASE_IN },
  },
};

/** Cross-fading detail panels (e.g. GST state switch, dashboard tabs). */
export const crossfadePanel: Variants = {
  hidden: { opacity: 0, x: 12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.panel, ease: EASE_OUT_EXPO },
  },
  exit: { opacity: 0, x: -8, transition: { duration: 0.15, ease: EASE_IN } },
};

/** Shared-element spring for active-tab pills / nav indicators (layoutId). */
export const springPill: Transition = {
  type: 'spring',
  stiffness: 480,
  damping: 42,
  mass: 0.9,
};

/** Press feedback for primary CTAs — pair with whileHover lift where apt. */
export const tapScale = { scale: 0.98 } as const;
