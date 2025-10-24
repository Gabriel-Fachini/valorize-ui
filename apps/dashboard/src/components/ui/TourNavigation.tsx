import React from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface NavigationProps {
  styles?: any
  setCurrentStep: (step: number) => void
  steps: any[]
  currentStep: number
  setIsOpen: (open: boolean) => void
  hideButtons?: boolean
  hideDots?: boolean
  disableAll?: boolean
  rtl?: boolean
}

export const TourNavigation: React.FC<NavigationProps> = ({
  styles,
  currentStep,
  steps,
  setCurrentStep,
  setIsOpen,
  hideButtons = false,
  hideDots = false,
  disableAll = false,
  rtl = false,
}) => {
  const totalSteps = steps?.length || 0
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  const handleNext = () => {
    if (isLastStep) {
      setIsOpen(false)
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (hideButtons) return null

  return (
    <div className="mt-6 flex items-center justify-between" style={styles}>
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrev}
        disabled={isFirstStep || disableAll}
        className={cn(
          'flex items-center gap-2',
          isFirstStep && 'opacity-50 cursor-not-allowed',
        )}
      >
        <i className="ph ph-arrow-left text-base" />
        {rtl ? 'Próximo' : 'Anterior'}
      </Button>

      {/* Dots Navigation */}
      {!hideDots && (
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              disabled={disableAll}
              className={cn(
                'h-2 w-2 rounded-full transition-all duration-200',
                index === currentStep
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 scale-125'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500',
                disableAll && 'cursor-not-allowed opacity-50',
              )}
            />
          ))}
        </div>
      )}

      {/* Next Button */}
      <Button
        variant="default"
        size="sm"
        onClick={handleNext}
        disabled={disableAll}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
      >
        {isLastStep ? (
          <>
            <i className="ph ph-check text-base" />
            Concluir
          </>
        ) : (
          <>
            {rtl ? 'Anterior' : 'Próximo'}
            <i className="ph ph-arrow-right text-base" />
          </>
        )}
      </Button>
    </div>
  )
}
