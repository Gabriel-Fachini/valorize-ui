import { useMobileSidebarGesture } from '@/hooks/useMobileSidebarGesture'

interface MobileGestureAreaProps {
  enabled?: boolean
  swipeThreshold?: number
  edgeThreshold?: number
}

export const MobileGestureArea = ({ 
  enabled = true, 
  swipeThreshold = 50,
  edgeThreshold = 20,
}: MobileGestureAreaProps) => {
  useMobileSidebarGesture({
    enabled,
    swipeThreshold,
    edgeThreshold,
  })

  if (!enabled) return null

  // Área invisível na borda esquerda para melhor detecção de gestos
  return (
    <div 
      className="fixed left-0 top-0 w-4 h-full z-40 lg:hidden"
      style={{ 
        touchAction: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        pointerEvents: 'auto',
      }}
      aria-hidden="true"
    />
  )
}
