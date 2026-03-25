/**
 * Core motion (animation) tokens.
 */
export const coreMotion = {
  duration: {
    fast: '120ms',
    normal: '180ms',
    slow: '240ms',
    xslow: '320ms',
  },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    decelerate: 'cubic-bezier(0, 0, 0, 1)',
    accelerate: 'cubic-bezier(0.3, 0, 1, 1)',
    emphasized: 'cubic-bezier(0.2, 0, 0, 1.2)',
  },
} as const;
