import { memo, useMemo } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { getAnimationConfig } from '@/constants/animations'
import { CarouselPreviewProps } from '../types'

// Number of slides to render adjacent to the current slide (for performance)
const ADJACENT_SLIDE_RENDER_DISTANCE = 1

export const CarouselPreview = memo<CarouselPreviewProps>(({ 
  images, 
  currentIndex, 
  isDragging, 
  onImageClick, 
  onNavigate, 
  onGoToSlide,
}) => {
  const cardConfig = getAnimationConfig('card')

  const slideSpring = useSpring({
    transform: `translateX(-${currentIndex * 100}%)`,
    config: cardConfig,
  })

  // Image elements - simplified memoization
  const imageElements = useMemo(() => {
    if (!images || images.length === 0) return null
    
    return images.map((image, index) => {
      const shouldRender = Math.abs(index - currentIndex) <= ADJACENT_SLIDE_RENDER_DISTANCE
      
      return (
        <div
          key={`${image}-${index}`}
          className="relative h-full w-full flex-shrink-0"
          onClick={onImageClick}
        >
          {shouldRender ? (
            <img
              src={image}
              alt={`Imagem ${index + 1}`}
              className="h-full w-full object-contain"
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          ) : (
            <div className="h-full w-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
          )}
        </div>
      )
    })
  }, [images, currentIndex, onImageClick])

  // Drag gesture for carousel
  const bind = useDrag(
    ({ direction: [xDir], distance, down }) => {
      if (!down && distance[0] > 50) {
        if (xDir > 0) {
          onNavigate('prev')
        } else if (xDir < 0) {
          onNavigate('next')
        }
      }
    },
    {
      axis: 'x',
      filterTaps: true,
    },
  )

  // Early return for empty images
  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/3] flex items-center justify-center rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl">
        <p className="text-gray-500 dark:text-gray-400">Nenhuma imagem disponível</p>
      </div>
    )
  }

  return (
    <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl">
      <animated.div
        {...bind()}
        style={slideSpring}
        className={`flex h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {imageElements}
      </animated.div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => onNavigate('prev')}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-900 dark:bg-[#171717] text-white hover:bg-gray-800 dark:hover:bg-[#262626] opacity-0 group-hover:opacity-100 transition-all shadow-lg border border-gray-700 dark:border-gray-600 flex items-center justify-center"
            aria-label="Imagem anterior"
            type="button"
          >
            <i className="ph ph-caret-left text-lg sm:text-xl" />
          </button>

          <button
            onClick={() => onNavigate('next')}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-900 dark:bg-[#171717] text-white hover:bg-gray-800 dark:hover:bg-[#262626] opacity-0 group-hover:opacity-100 transition-all shadow-lg border border-gray-700 dark:border-gray-600 flex items-center justify-center"
            aria-label="Próxima imagem"
            type="button"
          >
            <i className="ph ph-caret-right text-lg sm:text-xl" />
          </button>
        </>
      )}

      {/* Expand Button */}
      <button
        onClick={onImageClick}
        className="absolute right-3 top-3 w-10 h-10 rounded-full bg-gray-900 dark:bg-[#171717] text-white hover:bg-gray-800 dark:hover:bg-[#262626] opacity-0 group-hover:opacity-100 transition-all shadow-lg border border-gray-700 dark:border-gray-600 flex items-center justify-center"
        aria-label="Ver em tela cheia"
        type="button"
      >
        <i className="ph ph-arrows-out text-lg" />
      </button>

      {/* Image Counter */}
      <div className="absolute left-3 top-3 rounded-full bg-gray-900/90 dark:bg-[#171717]/90 backdrop-blur-sm px-3 py-1.5 text-xs sm:text-sm font-medium text-white shadow-lg border border-gray-700 dark:border-gray-600">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Dot Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 bg-gray-900/80 dark:bg-[#171717]/80 backdrop-blur-sm rounded-full px-3 py-2 border border-gray-700 dark:border-gray-600">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => onGoToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === index
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Ir para imagem ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
})