/**
 * Generic Animation Hook
 * Provides reusable animation utilities for the entire application
 */

import { useSpring, useTrail, useTransition, config } from '@react-spring/web'
import { 
  ANIMATION_DELAYS,
  getAnimationConfig,
  getAnimationPreset,
} from '@/constants/animations'

export const useAnimations = () => {
  
  // Page-level animations
  const pageEntrance = (delay = ANIMATION_DELAYS.immediate) => {
    return useSpring({
      ...getAnimationPreset('pageEntrance'),
      delay,
      config: getAnimationConfig('page'),
    })
  }
  
  const pageHeaderEntrance = (delay = ANIMATION_DELAYS.pageHeader) => {
    return useSpring({
      ...getAnimationPreset('pageHeaderEntrance'),
      delay,
      config: getAnimationConfig('pageHeader'),
    })
  }
  
  // Card animations
  const cardEntrance = (delay = ANIMATION_DELAYS.medium) => {
    return useSpring({
      ...getAnimationPreset('cardEntrance'),
      delay,
      config: getAnimationConfig('card'),
    })
  }
  
  const cardTrail = <T>(items: T[], delay = ANIMATION_DELAYS.medium) => {
    return useTrail(items.length, {
      from: { opacity: 0, y: 50, scale: 0.9 },
      to: { opacity: 1, y: 0, scale: 1 },
      delay,
      config: getAnimationConfig('trail'),
    })
  }
  
  // Modal animations
  const modalTransition = (isOpen: boolean) => {
    return useTransition(isOpen, {
      from: getAnimationPreset('modalEntrance').from,
      enter: getAnimationPreset('modalEntrance').to,
      leave: getAnimationPreset('modalEntrance').from,
      config: getAnimationConfig('modal'),
    })
  }
  
  // Button animations
  const fabEntrance = (delay = ANIMATION_DELAYS.fab) => {
    return useSpring({
      ...getAnimationPreset('fabEntrance'),
      delay,
      config: getAnimationConfig('fab'),
    })
  }
  
  // Success and feedback animations
  const successTransition = (isVisible: boolean) => {
    return useTransition(isVisible, {
      from: getAnimationPreset('successEntrance').from,
      enter: getAnimationPreset('successEntrance').to,
      leave: getAnimationPreset('successExit').to,
      config: getAnimationConfig('success'),
    })
  }
  
  // Trail animations for lists
  const statsTrail = (count: number, delay = ANIMATION_DELAYS.pageContent) => {
    return useTrail(count, {
      from: { opacity: 0, scale: 0.4, y: 20 },
      to: { opacity: 1, scale: 1, y: 0 },
      delay,
      config: getAnimationConfig('trail'),
    })
  }
  
  const listTrail = <T>(items: T[]) => {
    return useTrail(items.length, {
      from: { opacity: 0, scale: 0.7 },
      to: { opacity: 1, scale: 1 },
      delay: 0,
      // config: getAnimationConfig('trail'),
      config: config.gentle,
      // loop: true
    })
  }
  
  return {
    pageEntrance,
    pageHeaderEntrance,
    cardEntrance,
    cardTrail,
    modalTransition,
    fabEntrance,
    successTransition,
    statsTrail,
    listTrail,
  }
}