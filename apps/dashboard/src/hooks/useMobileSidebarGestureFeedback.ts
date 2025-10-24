import { useState, useCallback } from 'react'
import { useSidebar } from './useSidebar'

interface UseMobileSidebarGestureFeedbackOptions {
  enabled?: boolean
  feedbackThreshold?: number
}

export const useMobileSidebarGestureFeedback = (options: UseMobileSidebarGestureFeedbackOptions = {}) => {
  const { enabled = true, feedbackThreshold = 30 } = options
  const { mobileSidebarOpen } = useSidebar()
  const [isGestureActive, setIsGestureActive] = useState(false)
  const [gestureProgress, setGestureProgress] = useState(0)

  const handleGestureStart = useCallback(() => {
    if (!enabled || mobileSidebarOpen) return
    setIsGestureActive(true)
  }, [enabled, mobileSidebarOpen])

  const handleGestureMove = useCallback((progress: number) => {
    if (!enabled || !isGestureActive) return
    setGestureProgress(Math.min(progress, 1))
  }, [enabled, isGestureActive])

  const handleGestureEnd = useCallback(() => {
    setIsGestureActive(false)
    setGestureProgress(0)
  }, [])

  const shouldShowFeedback = isGestureActive && gestureProgress > 0.1

  return {
    isGestureActive,
    gestureProgress,
    shouldShowFeedback,
    handleGestureStart,
    handleGestureMove,
    handleGestureEnd
  }
}
