import { useState, useCallback } from 'react'
import { useSpring } from '@react-spring/web'

export interface OnboardingStep {
  target: string
  content: string
  title: string
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'auto'
  disableBeacon?: boolean
  disableOverlayClose?: boolean
  hideCloseButton?: boolean
  spotlightClicks?: boolean
  styles?: {
    options?: {
      primaryColor?: string
      backgroundColor?: string
      textColor?: string
      overlayColor?: string
      spotlightShadow?: string
    }
  }
}

export const useOnboarding = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const fadeIn = useSpring({
    opacity: isVisible ? 1 : 0,
    config: { tension: 300, friction: 30 },
  })

  const startTour = useCallback(() => {
    setIsRunning(true)
    setIsVisible(true)
  }, [])

  const stopTour = useCallback(() => {
    setIsRunning(false)
    setIsVisible(false)
  }, [])

  return {
    isRunning,
    isVisible,
    fadeIn,
    startTour,
    stopTour,
  }
}
