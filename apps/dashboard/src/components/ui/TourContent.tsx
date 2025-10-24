import React from 'react'
import { TourPopover } from './TourPopover'

interface ContentProps {
  content: React.ReactNode
  currentStep: number
  setIsOpen?: (open: boolean) => void
  setCurrentStep: (step: number) => void
  steps?: any[]
}

export const TourContent: React.FC<ContentProps> = ({
  content,
  currentStep,
  setIsOpen,
  setCurrentStep,
  steps,
}) => {
  const totalSteps = steps?.length ?? 0
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  const handleNext = () => {
    if (isLastStep) {
      setIsOpen?.(false)
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    setIsOpen?.(false)
  }

  return (
    <TourPopover
      content={content}
      currentStep={currentStep}
      totalSteps={totalSteps}
      onClose={handleClose}
      onNext={handleNext}
      onPrev={handlePrev}
      isFirstStep={isFirstStep}
      isLastStep={isLastStep}
    />
  )
}
