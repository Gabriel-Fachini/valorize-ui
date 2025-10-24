import React from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface TourPopoverProps {
  content: React.ReactNode
  currentStep: number
  totalSteps: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  showNavigation?: boolean
  showCloseButton?: boolean
  showBadge?: boolean
  isFirstStep?: boolean
  isLastStep?: boolean
  className?: string
}

export const TourPopover: React.FC<TourPopoverProps> = ({
  content,
  currentStep,
  totalSteps,
  onClose,
  onNext,
  onPrev,
  showNavigation = true,
  showCloseButton = true,
  showBadge = true,
  isFirstStep = false,
  isLastStep = false,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative max-w-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg p-6',
        className,
      )}
    >
      {/* Badge */}
      {showBadge && (
        <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold shadow-lg">
          {currentStep + 1}
        </div>
      )}

      {/* Close Button */}
      {showCloseButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <i className="ph ph-x text-base" />
        </Button>
      )}

      {/* Content */}
      <div className="pr-8">
        {typeof content === 'string' ? (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {content}
          </p>
        ) : (
          content
        )}
      </div>

      {/* Navigation */}
      {showNavigation && (
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrev}
            disabled={isFirstStep}
            className="flex items-center gap-2"
          >
            <i className="ph ph-arrow-left text-base" />
            Anterior
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={index}
                className={cn(
                  'h-2 w-2 rounded-full transition-colors',
                  index === currentStep
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600'
                    : 'bg-gray-300 dark:bg-gray-600',
                )}
              />
            ))}
          </div>

          <Button
            variant="default"
            size="sm"
            onClick={onNext}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isLastStep ? (
              <>
                <i className="ph ph-check text-base" />
                Concluir
              </>
            ) : (
              <>
                Próximo
                <i className="ph ph-arrow-right text-base" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
