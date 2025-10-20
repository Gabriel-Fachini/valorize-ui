import { createContext } from 'react'

export interface OnboardingContextType {
  startTour: () => void
  completeTour: () => void
  resetTour: () => void
  hasCompletedOnboarding: boolean
  handleRouteChange: (pathname: string) => void
}

export const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)
