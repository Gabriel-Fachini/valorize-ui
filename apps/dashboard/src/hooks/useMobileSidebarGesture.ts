import { useSwipeGesture } from './useSwipeGesture'
import { useSidebar } from './useSidebar'

interface UseMobileSidebarGestureOptions {
  enabled?: boolean
  swipeThreshold?: number
  edgeThreshold?: number
  enableHapticFeedback?: boolean
}

export const useMobileSidebarGesture = (options: UseMobileSidebarGestureOptions = {}) => {
  const { 
    enabled = true, 
    swipeThreshold = 50, 
    edgeThreshold = 20,
    enableHapticFeedback = true,
  } = options
  const { mobileSidebarOpen, setMobileSidebarOpen } = useSidebar()

  const handleSwipeRight = () => {
    if (!enabled || mobileSidebarOpen) return
    
    // Adicionar vibração se disponível e habilitado
    if (enableHapticFeedback && navigator.vibrate) {
      navigator.vibrate(50)
    }
    
    setMobileSidebarOpen(true)
  }

  const handleSwipeLeft = () => {
    if (!enabled || !mobileSidebarOpen) return
    
    setMobileSidebarOpen(false)
  }

  useSwipeGesture({
    onSwipeRight: handleSwipeRight,
    onSwipeLeft: handleSwipeLeft,
    threshold: swipeThreshold,
    preventDefaultTouchmoveEvent: false,
    startArea: {
      x: 0,
      y: 0,
      width: edgeThreshold,
      height: window.innerHeight,
    },
  })

  return {
    isEnabled: enabled,
    isOpen: mobileSidebarOpen,
    enableHapticFeedback,
  }
}
