import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTour as useReactTour } from '@reactour/tour'
import { useAuth } from '@/hooks/useAuth'
import { getTourSteps } from '../config/tourSteps'
import { ONBOARDING_STORAGE_KEY, STEP_TO_ROUTE_MAP } from '../config/constants'
import { useTourSidebar } from './useTourSidebar'
import { useTourAutoStart } from './useTourAutoStart'
import type { OnboardingContextType } from '../onboarding'

export const useTourController = (): OnboardingContextType => {
  const { setIsOpen, currentStep, setCurrentStep, isOpen, setSteps } = useReactTour()
  const { user, isLoading } = useAuth()
  
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true'
  })
  
  const previousRouteRef = useRef<string>('')
  
  // Hooks especializados
  const { openSidebarOnStart, closeSidebarOnComplete } = useTourSidebar({ isOpen, currentStep })
  
  // Atualiza steps quando tour abre ou tela muda de tamanho
  useEffect(() => {
    if (!isOpen || !setSteps) return
    
    const updateSteps = () => {
      const updatedSteps = getTourSteps()
      setSteps(updatedSteps)
    }
    
    updateSteps()
    window.addEventListener('resize', updateSteps)
    return () => window.removeEventListener('resize', updateSteps)
  }, [isOpen, setSteps])
  
  // Callbacks memoizados
  const startTour = useCallback(() => {
    setIsOpen(true)
    openSidebarOnStart()
  }, [setIsOpen, openSidebarOnStart])
  
  const completeTour = useCallback(() => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true')
    setHasCompletedOnboarding(true)
    setIsOpen(false)
    closeSidebarOnComplete()
  }, [setIsOpen, closeSidebarOnComplete])
  
  const resetTour = useCallback(() => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY)
    setHasCompletedOnboarding(false)
  }, [])
  
  const handleRouteChange = useCallback((pathname: string) => {
    if (!isOpen) return
    
    const expectedRoute = STEP_TO_ROUTE_MAP[currentStep]
    
    if (expectedRoute && pathname === expectedRoute && previousRouteRef.current !== expectedRoute) {
      const delay = window.innerWidth < 1024 ? 500 : 300
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        if (setSteps) {
          setSteps(getTourSteps())
        }
      }, delay)
    }
    
    previousRouteRef.current = pathname
  }, [isOpen, currentStep, setCurrentStep, setSteps])
  
  // Auto-start
  useTourAutoStart({
    isLoading,
    hasUser: !!user,
    hasCompletedOnboarding,
    onStart: startTour,
    onOpenSidebar: openSidebarOnStart,
  })
  
  // Listen for completion event
  useEffect(() => {
    const handleComplete = () => completeTour()
    window.addEventListener('onboarding:complete', handleComplete)
    return () => window.removeEventListener('onboarding:complete', handleComplete)
  }, [completeTour])
  
  // Close tour when user logs out
  useEffect(() => {
    if (!isLoading && !user && isOpen) {
      setIsOpen(false)
      closeSidebarOnComplete()
    }
  }, [isLoading, user, isOpen, setIsOpen, closeSidebarOnComplete])
  
  return useMemo(() => ({
    startTour,
    completeTour,
    resetTour,
    hasCompletedOnboarding,
    handleRouteChange,
  }), [startTour, completeTour, resetTour, hasCompletedOnboarding, handleRouteChange])
}
