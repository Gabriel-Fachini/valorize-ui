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

// NOVOS HOOKS: Evitam chamar hooks dentro de funções dinâmicas, reduzindo risco de
// ciclos de renderização e obedecendo estritamente as regras de hooks.

export const usePageEntrance = (delay = ANIMATION_DELAYS.immediate) => {
  return useSpring({
    ...getAnimationPreset('pageEntrance'),
    delay,
    config: getAnimationConfig('page'),
  })
}

export const usePageHeaderEntrance = (delay = ANIMATION_DELAYS.pageHeader) => {
  return useSpring({
    ...getAnimationPreset('pageHeaderEntrance'),
    delay,
    config: getAnimationConfig('pageHeader'),
  })
}

export const useStatsTrail = (count: number) =>
  useTrail(count, {
    from: { opacity: 0, scale: 0.4, y: 20 },
    to: { opacity: 1, scale: 1, y: 0 },
    config: config.gentle,
  })

export const useCardEntrance = (delay = ANIMATION_DELAYS.medium) => {
  return useSpring({
    ...getAnimationPreset('cardEntrance'),
    delay,
    config: getAnimationConfig('card'),
  })
}

export const useCardTrail = <T>(items: T[], delay = ANIMATION_DELAYS.medium) => {
  return useTrail(items.length, {
    from: { opacity: 0, y: 50, scale: 0.9 },
    to: { opacity: 1, y: 0, scale: 1 },
    delay,
    config: getAnimationConfig('trail'),
  })
}

export const useModalTransition = (isOpen: boolean) => {
  return useTransition(isOpen, {
    from: getAnimationPreset('modalEntrance').from,
    enter: getAnimationPreset('modalEntrance').to,
    leave: getAnimationPreset('modalEntrance').from,
    config: getAnimationConfig('modal'),
  })
}

export const useFabEntrance = (delay = ANIMATION_DELAYS.fab) => {
  return useSpring({
    ...getAnimationPreset('fabEntrance'),
    delay,
    config: getAnimationConfig('fab'),
  })
}

export const useSuccessTransition = (isVisible: boolean) => {
  return useTransition(isVisible, {
    from: getAnimationPreset('successEntrance').from,
    enter: getAnimationPreset('successEntrance').to,
    leave: getAnimationPreset('successExit').to,
    config: getAnimationConfig('success'),
  })
}

export const useListTrail = <T>(items: T[]) => {
  return useTrail(items.length, {
    from: { opacity: 0, scale: 0.7 },
    to: { opacity: 1, scale: 1 },
    delay: 0,
    config: config.gentle,
  })
}

// Wrapper legado para compatibilidade (DEPRECATED). Mantido temporariamente.
// Recomenda-se migrar para os hooks individuais acima.
export const useAnimations = () => {
  // Este hook coleta animações padrão sem parâmetros dinâmicos.
  const page = usePageEntrance()
  const header = usePageHeaderEntrance()
  const card = useCardEntrance()
  const fab = useFabEntrance()
  return {
    pageEntrance: page,
    pageHeaderEntrance: header,
    cardEntrance: card,
    fabEntrance: fab,
  }
}