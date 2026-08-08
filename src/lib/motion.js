import { useReducedMotion } from 'framer-motion';

export const EASE_BRAND = [0.16, 1, 0.3, 1];

export const VIEWPORT = { once: true, margin: '-80px' };

const STATIC = { hidden: { opacity: 1 }, visible: { opacity: 1, transition: { duration: 0 } } };

export const fadeUp = (reduce, { delay = 0, distance = 20, duration = 0.55 } = {}) =>
  reduce
    ? STATIC
    : {
        hidden: { opacity: 0, y: distance },
        visible: { opacity: 1, y: 0, transition: { duration, delay, ease: EASE_BRAND } },
      };

export const fadeIn = (reduce, { delay = 0, duration = 0.4 } = {}) =>
  reduce ? STATIC : { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration, delay } } };

export const stagger = (reduce, { each = 0.08, delay = 0 } = {}) => ({
  hidden: {},
  visible: { transition: reduce ? { staggerChildren: 0, delayChildren: 0 } : { staggerChildren: each, delayChildren: delay } },
});

export const maskReveal = (reduce, { delay = 0, duration = 0.6 } = {}) =>
  reduce
    ? STATIC
    : {
        hidden: { opacity: 0, y: '0.4em', filter: 'blur(6px)' },
        visible: { opacity: 1, y: '0em', filter: 'blur(0px)', transition: { duration, delay, ease: EASE_BRAND } },
      };

export const drawPath = (reduce, { delay = 0, duration = 1.1 } = {}) =>
  reduce
    ? { hidden: { pathLength: 1, opacity: 1 }, visible: { pathLength: 1, opacity: 1, transition: { duration: 0 } } }
    : {
        hidden: { pathLength: 0, opacity: 0 },
        visible: { pathLength: 1, opacity: 1, transition: { pathLength: { duration, delay, ease: 'easeInOut' }, opacity: { duration: 0.2, delay } } },
      };

export { useReducedMotion };
