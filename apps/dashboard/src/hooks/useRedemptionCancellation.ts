import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useCancelRedemption } from './useRedemptions'
import { canCancelRedemption, COUNTDOWN_SECONDS } from '@/lib/redemptionUtils'
import type { Redemption } from '@/types/redemption.types'

interface CancellationState {
  showModal: boolean
  reason: string
  success: boolean
  error: string | null
  countdown: number
}

export const useRedemptionCancellation = (redemption: Redemption | null) => {
  const navigate = useNavigate()
  const cancelMutation = useCancelRedemption()
  
  const [state, setState] = useState<CancellationState>({
    showModal: false,
    reason: '',
    success: false,
    error: null,
    countdown: COUNTDOWN_SECONDS,
  })

  const canCancel = useMemo(() => canCancelRedemption(redemption), [redemption])

  // Effect to handle countdown and navigation after successful cancellation
  useEffect(() => {
    if (!state.success || state.countdown === 0) return

    const timer = setInterval(() => {
      setState(prev => {
        if (prev.countdown <= 1) {
          navigate({ to: '/resgates' })
          return { ...prev, countdown: 0 }
        }
        return { ...prev, countdown: prev.countdown - 1 }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [state.success, state.countdown, navigate])

  const handleCancelClick = () => {
    setState(prev => ({
      ...prev,
      showModal: true,
      success: false,
      error: null,
      reason: '',
    }))
  }

  const handleCancelSubmit = async () => {
    if (!redemption || !state.reason.trim()) return
    
    setState(prev => ({ ...prev, error: null }))
    
    try {
      await cancelMutation.mutateAsync({ 
        id: redemption.id, 
        reason: state.reason.trim(),
      })
      
      setState(prev => ({
        ...prev,
        success: true,
        countdown: COUNTDOWN_SECONDS,
      }))
    } catch (e) {
      setState(prev => ({
        ...prev,
        error: (e as Error).message || 'Erro ao cancelar resgate',
      }))
    }
  }

  const handleCancelClose = () => {
    setState({
      showModal: false,
      reason: '',
      success: false,
      error: null,
      countdown: COUNTDOWN_SECONDS,
    })
  }

  const handleGoToRedemptions = () => {
    navigate({ to: '/resgates' })
  }

  const updateReason = (reason: string) => {
    setState(prev => ({ ...prev, reason }))
  }

  return {
    canCancel,
    state,
    isLoading: cancelMutation.isPending,
    handleCancelClick,
    handleCancelSubmit,
    handleCancelClose,
    handleGoToRedemptions,
    updateReason,
  }
}
