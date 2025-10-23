import { useMemo } from 'react'
import type { Redemption } from '@/types/redemption.types'

export interface TimelineStep {
  title: string
  time: string
  done: boolean
}

export const useRedemptionTimeline = (redemption: Redemption | null) => {
  const steps = useMemo((): TimelineStep[] => {
    if (!redemption) return []
    
    const status = redemption.status.toLowerCase()
    const redeemedDate = redemption.redeemedAt 
      ? new Date(redemption.redeemedAt).toLocaleString('pt-BR') 
      : null
    
    return [
      { 
        title: 'Pedido recebido', 
        time: redeemedDate ?? '-', 
        done: true,
      },
      { 
        title: 'Processando pedido', 
        time: '-', 
        done: status !== 'pending',
      },
      { 
        title: 'Despachado para entrega', 
        time: '-', 
        done: status === 'shipped' || status === 'completed' || status === 'delivered',
      },
      { 
        title: 'Entregue', 
        time: '-', 
        done: status === 'completed' || status === 'delivered',
      },
    ]
  }, [redemption])

  const progressPercentage = useMemo(() => {
    if (!steps.length) return 0
    const completedSteps = steps.filter(step => step.done).length
    return (completedSteps / steps.length) * 100
  }, [steps])

  return {
    steps,
    progressPercentage,
  }
}
