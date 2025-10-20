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
  
  // Specialized hooks
  const { openSidebarOnStart, closeSidebarOnComplete } = useTourSidebar({ isOpen, currentStep })
  
  // Update steps when tour opens or screen size changes
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
  
  // Memoized callbacks
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
  
  // Auto-start when user is authenticated and onboarding is not completed
  useTourAutoStart({
    isLoading,
    hasUser: !!user,
    hasCompletedOnboarding,
    onStart: startTour,
    onOpenSidebar: openSidebarOnStart,
  })
  
  // Listen for completion event to mark onboarding as completed
  useEffect(() => {
    const handleComplete = () => completeTour()
    window.addEventListener('onboarding:complete', handleComplete)
    return () => window.removeEventListener('onboarding:complete', handleComplete)
  }, [completeTour])
  
  // Close tour when user logs out and onboarding is not completed
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
