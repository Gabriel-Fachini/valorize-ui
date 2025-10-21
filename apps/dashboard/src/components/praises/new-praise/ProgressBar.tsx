/**
 * Progress Bar Component
 * Barra de progresso dos steps com animação react-spring
 */

import { animated, useSpring } from '@react-spring/web'
import type { PraiseStep } from '@/types/praise.types'

interface ProgressBarProps {
  currentStep: PraiseStep
  totalSteps: number
}

export const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const progressAnimation = useSpring({
    from: { scaleX: 0 },
    to: { scaleX: 1 },
    config: { tension: 300, friction: 30 },
  })

  return (
    <div className="flex space-x-2">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index <= currentStep
        
        return (
          <div
            key={index}
            className="flex-1 h-2 rounded-full overflow-hidden"
          >
            <animated.div
              style={isActive ? progressAnimation : { scaleX: 0 }}
              className={`h-full transition-colors duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                  : 'bg-[#e5e5e5] dark:bg-[#404040]'
              }`}
            />
          </div>
        )
      })}
    </div>
  )
}
