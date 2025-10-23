import React from 'react'
import { useTrail, animated } from '@react-spring/web'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRedemptionTimeline, type TimelineStep } from '@/hooks/useRedemptionTimeline'
import type { Redemption } from '@/types/redemption.types'

interface RedemptionTimelineProps {
  redemption: Redemption | null
  className?: string
}

const TimelineStepComponent: React.FC<{
  step: TimelineStep
  index: number
  isLast: boolean
  style: any
}> = ({ step, isLast, style }) => {
  return (
    <animated.div style={style}>
      <div className="relative flex gap-4">
        {/* Timeline Line */}
        {!isLast && (
          <div className={`absolute left-5 top-10 w-0.5 h-full ${
            step.done ? 'bg-green-500' : 'bg-gray-300 dark:bg-neutral-700'
          }`} />
        )}
        
        {/* Timeline Dot */}
        <div className="relative shrink-0">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            step.done 
              ? 'bg-green-500 border-green-500' 
              : 'bg-gray-200 dark:bg-neutral-700 border-gray-300 dark:border-neutral-600'
          }`}>
            {step.done ? (
              <i className="ph-bold ph-check text-lg text-white" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-neutral-500" />
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 pb-2">
          <h3 className={`text-base font-bold mb-1 ${
            step.done 
              ? 'text-gray-900 dark:text-white' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {step.title}
          </h3>
          <div className={`flex items-center gap-2 text-sm ${
            step.done 
              ? 'text-gray-600 dark:text-gray-400' 
              : 'text-gray-500 dark:text-gray-500'
          }`}>
            <i className="ph-bold ph-clock text-base" />
            {step.time}
          </div>
        </div>
      </div>
    </animated.div>
  )
}


export const RedemptionTimeline: React.FC<RedemptionTimelineProps> = ({
  redemption,
  className,
}) => {
  const { steps } = useRedemptionTimeline(redemption)

  const trail = useTrail(steps.length, {
    from: { opacity: 0, transform: 'translateX(-12px)' },
    to: { opacity: 1, transform: 'translateX(0px)' },
    config: { tension: 280, friction: 60 },
  })

  // Safety check for trail length
  if (trail.length !== steps.length) {
    console.warn('Trail length mismatch with steps length')
  }

  // Early return if no steps
  if (!steps.length) {
    return (
      <Card className={`border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 ${className}`}>
        <CardHeader className="pb-6 bg-white dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-950 rounded-xl">
              <i className="ph-bold ph-clock-countdown text-2xl text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="text-2xl">Acompanhamento do Pedido</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Veja o status e histórico do seu resgate
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Nenhum status disponível
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 ${className}`}>
      <CardHeader className="pb-6 bg-white dark:bg-neutral-900">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 dark:bg-green-950 rounded-xl">
            <i className="ph-bold ph-clock-countdown text-2xl text-green-600 dark:text-green-400" />
          </div>
          <div>
            <CardTitle className="text-2xl">Acompanhamento do Pedido</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Veja o status e histórico do seu resgate
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6 bg-white dark:bg-neutral-900">
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1
            const style = trail[idx] || { opacity: 1, transform: 'translateX(0px)' }
            
            return (
              <TimelineStepComponent
                key={`${step.title}-${idx}`}
                step={step}
                index={idx}
                isLast={isLast}
                style={style}
              />
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
