import { useEffect, useRef, useCallback } from 'react'

interface SwipeGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  preventDefaultTouchmoveEvent?: boolean
  trackMouse?: boolean
  startArea?: {
    x: number
    y: number
    width: number
    height: number
  }
}

interface TouchPosition {
  x: number
  y: number
}

export const useSwipeGesture = (options: SwipeGestureOptions = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventDefaultTouchmoveEvent = false,
    trackMouse = false,
    startArea
  } = options

  const touchStart = useRef<TouchPosition | null>(null)
  const touchEnd = useRef<TouchPosition | null>(null)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (preventDefaultTouchmoveEvent) {
      e.preventDefault()
    }
    
    const touchX = e.targetTouches[0].clientX
    const touchY = e.targetTouches[0].clientY
    
    // Verificar se o toque começou na área especificada
    if (startArea) {
      const isInStartArea = touchX >= startArea.x && 
                           touchX <= startArea.x + startArea.width &&
                           touchY >= startArea.y && 
                           touchY <= startArea.y + startArea.height
      
      if (!isInStartArea) return
    }
    
    touchEnd.current = null
    touchStart.current = {
      x: touchX,
      y: touchY
    }
  }, [preventDefaultTouchmoveEvent, startArea])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (preventDefaultTouchmoveEvent) {
      e.preventDefault()
    }
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    }
  }, [preventDefaultTouchmoveEvent])

  const handleTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) return

    const deltaX = touchStart.current.x - touchEnd.current.x
    const deltaY = touchStart.current.y - touchEnd.current.y
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)
    
    // Verificar se o movimento é principalmente horizontal
    const isHorizontalSwipe = absDeltaX > absDeltaY
    const isLeftSwipe = deltaX > threshold && isHorizontalSwipe
    const isRightSwipe = deltaX < -threshold && isHorizontalSwipe
    const isUpSwipe = deltaY > threshold && !isHorizontalSwipe
    const isDownSwipe = deltaY < -threshold && !isHorizontalSwipe

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft()
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight()
    }
    if (isUpSwipe && onSwipeUp) {
      onSwipeUp()
    }
    if (isDownSwipe && onSwipeDown) {
      onSwipeDown()
    }
  }, [threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!trackMouse) return
    touchEnd.current = null
    touchStart.current = {
      x: e.clientX,
      y: e.clientY
    }
  }, [trackMouse])

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!trackMouse || !touchStart.current) return
    touchEnd.current = {
      x: e.clientX,
      y: e.clientY
    }
    handleTouchEnd()
  }, [trackMouse, handleTouchEnd])

  useEffect(() => {
    const element = document.body

    element.addEventListener('touchstart', handleTouchStart, { passive: !preventDefaultTouchmoveEvent })
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefaultTouchmoveEvent })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    if (trackMouse) {
      element.addEventListener('mousedown', handleMouseDown, { passive: true })
      element.addEventListener('mouseup', handleMouseUp, { passive: true })
    }

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      
      if (trackMouse) {
        element.removeEventListener('mousedown', handleMouseDown)
        element.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseUp, preventDefaultTouchmoveEvent, trackMouse])
}
