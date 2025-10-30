/**
 * Animation Constants
 * Centralized animation configurations and presets for consistency across the app
 */

import type { SpringConfig } from '@react-spring/web'

// Base animation configurations
export const ANIMATION_CONFIGS: Record<string, SpringConfig> = {
  // Page-level animations
  page: { tension: 200, friction: 15 },
  pageHeader: { tension: 280, friction: 15 },

  // Component animations
  card: { tension: 200, friction: 15 },
  cardHover: { tension: 300, friction: 20 },

  // Modal and overlay animations
  modal: { tension: 280, friction: 20 },
  modalBackdrop: { tension: 200, friction: 25 },

  // Button animations
  button: { tension: 260, friction: 15 },
  fab: { tension: 260, friction: 15 },

  // Success and feedback animations
  success: { tension: 200, friction: 15 },
  feedback: { tension: 300, friction: 20 },

  // Trail animations for lists
  trail: { tension: 200, friction: 15 },
  trailFast: { tension: 280, friction: 20 },
}

// Animation preset configurations
export const ANIMATION_PRESETS = {
  // Page entrance animations
  pageEntrance: {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
  },

  pageHeaderEntrance: {
    from: { opacity: 0, transform: 'translateY(-30px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
  },

  // Card animations
  cardEntrance: {
    from: { opacity: 0, transform: 'translateY(50px) scale(0.9)' },
    to: { opacity: 1, transform: 'translateY(0px) scale(1)' },
  },

  cardHover: {
    from: { transform: 'scale(1) translateY(0px)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
    to: { transform: 'scale(1.02) translateY(-2px)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)' },
  },

  // Modal animations
  modalEntrance: {
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
  },

  modalBackdrop: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },

  // Button animations
  buttonHover: {
    from: { transform: 'scale(1)' },
    to: { transform: 'scale(1.05)' },
  },

  fabEntrance: {
    from: { scale: 0, rotate: -180, opacity: 0 },
    to: { scale: 1, rotate: 0, opacity: 1 },
  },

  // Success animations
  successEntrance: {
    from: { opacity: 0, transform: 'scale(0.8) rotate(-10deg)' },
    to: { opacity: 1, transform: 'scale(1) rotate(0deg)' },
  },

  successExit: {
    from: { opacity: 1, transform: 'scale(1) rotate(0deg)' },
    to: { opacity: 0, transform: 'scale(0.8) rotate(10deg)' },
  },

  // Filter and side animations
  slideInLeft: {
    from: { opacity: 0, transform: 'translateX(-20px)' },
    to: { opacity: 1, transform: 'translateX(0px)' },
  },

  slideInRight: {
    from: { opacity: 0, transform: 'translateX(20px)' },
    to: { opacity: 1, transform: 'translateX(0px)' },
  },

  // Generic animations
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },

  scaleIn: {
    from: { opacity: 0, transform: 'scale(0.4)' },
    to: { opacity: 1, transform: 'scale(1)' },
  },

  slideUp: {
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
  },
}

// Animation timing presets
export const ANIMATION_DELAYS = {
  immediate: 0,
  short: 100,
  medium: 200,
  long: 300,
  extraLong: 400,
  pageHeader: 200,
  pageContent: 300,
  trailStep: 100,
  fab: 800,
} as const

// Stagger configurations for trail animations
export const STAGGER_CONFIGS = {
  cards: {
    mass: 1,
    tension: 200,
    friction: 15,
    clamp: true,
  },
  stats: {
    mass: 1,
    tension: 200,
    friction: 15,
    clamp: true,
  },
  buttons: {
    mass: 0.5,
    tension: 280,
    friction: 20,
    clamp: true,
  },
}

// Helper function to get animation config
export const getAnimationConfig = (type: keyof typeof ANIMATION_CONFIGS) => {
  return ANIMATION_CONFIGS[type] || ANIMATION_CONFIGS.page
}

// Helper function to get animation preset
export const getAnimationPreset = (preset: keyof typeof ANIMATION_PRESETS) => {
  return ANIMATION_PRESETS[preset] || ANIMATION_PRESETS.fadeIn
}
