import React from 'react'
import { TourProvider } from '@reactour/tour'
import { OnboardingContext } from './onboarding'
import { useTourController } from './hooks/useTourController'
import { getTourSteps } from './config/tourSteps'
import { getTourStyles } from './config/tourStyles'
import { isMobile } from './utils/device'
import { ONBOARDING_STORAGE_KEY } from './config/constants'

interface OnboardingProviderProps {
  children: React.ReactNode
}

const OnboardingControllerContent = ({ children }: { children: React.ReactNode }) => {
  const value = useTourController()
  
  return (
    <OnboardingContext value={value}>
      {children}
    </OnboardingContext>
  )
}

export const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
  return (
    <TourProvider
      steps={getTourSteps()}
      styles={getTourStyles()}
      showBadge={true}
      showCloseButton={true}
      showNavigation={true}
      showDots={true}
      scrollSmooth={true}
      disableInteraction={false}
      onClickMask={({ setIsOpen, currentStep, steps }) => {
        if (steps && currentStep === steps.length - 1) return
        setIsOpen(false)
      }}
      onClickClose={({ setIsOpen, currentStep, steps }) => {
        if (steps && currentStep === steps.length - 1) {
          localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true')
        }
        setIsOpen(false)
      }}
      beforeClose={() => {
        if (isMobile()) {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('onboarding:close-mobile-sidebar'))
          }, 100)
        }
      }}
    >
      <OnboardingControllerContent>
        {children}
      </OnboardingControllerContent>
    </TourProvider>
  )
}
