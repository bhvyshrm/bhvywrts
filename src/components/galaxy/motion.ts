/**
 * Galaxy Journal 3.0 — Unified Motion System
 *
 * Defines reusable easing curves, durations, and motion variants
 * for a coherent, cinematic experience across the homepage.
 */

export const GALAXY_EASING = {
  // Smooth editorial deceleration
  editorial: [0.16, 1, 0.3, 1] as const,
  // Subtle expressive curve for cards & glass panels
  expressive: [0.22, 1, 0.36, 1] as const,
  // Gentle ambient shift
  ambient: [0.4, 0, 0.2, 1] as const,
}

export const GALAXY_DURATIONS = {
  micro: 0.18,       // 180ms
  small: 0.28,       // 280ms
  cardHover: 0.35,   // 350ms
  section: 0.65,     // 650ms
  cinematic: 0.85,   // 850ms
}

export const GALAXY_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: GALAXY_DURATIONS.section, ease: GALAXY_EASING.editorial },
    },
  },
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: GALAXY_DURATIONS.section, ease: GALAXY_EASING.editorial },
    },
  },
  cardScale: {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.02,
      y: -4,
      transition: { duration: GALAXY_DURATIONS.cardHover, ease: GALAXY_EASING.editorial },
    },
  },
}
