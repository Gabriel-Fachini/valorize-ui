import { memo, useEffect, useRef } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { getAnimationConfig } from '@/constants/animations'
import { ImageViewerProps } from '../types'

export const ImageViewer = memo<ImageViewerProps>(({ 
  images, 
  currentIndex, 
  zoom, 
  position, 
  isImageDragging, 
  onImageDrag, 
  onWheel,
}) => {
  const buttonConfig = getAnimationConfig('button')
  const containerRef = useRef<HTMLDivElement>(null)

  const zoomSpring = useSpring({
    scale: zoom,
    x: position.x,
    y: position.y,
    config: buttonConfig,
  })

  // Drag gesture for image panning
  const imageDragBind = useDrag(
    ({ offset, dragging }) => {
      onImageDrag(offset, dragging)
    },
    {
      filterTaps: true,
      bounds: { left: -400, right: 400, top: -400, bottom: 400 },
    },
  )

  // Handle wheel events with proper event listener
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      onWheel(e)
    }

    // Add event listener with { passive: false } to allow preventDefault
    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [onWheel])

  return (
    <div 
      ref={containerRef}
      className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden"
      style={{ touchAction: 'none' }}
    >
      <div className="relative max-w-full max-h-full">
        <animated.img
          {...imageDragBind()}
          style={{ ...zoomSpring, touchAction: 'none' }}
          src={images[currentIndex]}
          alt={`Imagem ${currentIndex + 1}`}
          className={`max-h-[70vh] max-w-full object-contain select-none ${
            isImageDragging ? 'cursor-grabbing' : zoom > 1 ? 'cursor-grab' : 'cursor-default'
          }`}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          loading="eager"
          decoding="async"
          draggable={false}
        />
      </div>
    </div>
  )
})