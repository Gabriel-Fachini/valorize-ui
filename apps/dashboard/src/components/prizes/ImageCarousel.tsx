import React from 'react'
import { useSpring, animated, useSpringRef, useChain } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'

interface ImageCarouselProps {
  images: string[]
  title: string
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  const slideRef = useSpringRef()
  const slideSpring = useSpring({
    ref: slideRef,
    transform: `translateX(-${currentIndex * 100}%)`,
    config: { tension: 280, friction: 60 },
  })

  const scaleRef = useSpringRef()
  const scaleSpring = useSpring({
    ref: scaleRef,
    scale: isFullscreen ? 1.1 : 1,
    config: { tension: 300, friction: 30 },
  })

  useChain([slideRef, scaleRef], [0, 0.1])

  const bind = useDrag(({ direction: [xDir], distance, cancel }) => {
    const dist = Math.sqrt(distance[0] ** 2 + distance[1] ** 2)
    if (dist > 50) {
      cancel()
      if (xDir > 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1)
      } else if (xDir < 0 && currentIndex < images.length - 1) {
        setCurrentIndex(prev => prev + 1)
      }
    }
  })

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious()
    if (e.key === 'ArrowRight') goToNext()
    if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false)
  }

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, isFullscreen])

  return (
    <>
      <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl">
        <animated.div
          {...bind()}
          style={slideSpring}
          className="flex h-full touch-pan-y cursor-grab active:cursor-grabbing"
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="relative h-full w-full flex-shrink-0"
            >
              <animated.img
                style={scaleSpring}
                src={image}
                alt={`${title} - Imagem ${index + 1}`}
                className="h-full w-full object-contain"
                loading={index === 0 ? 'eager' : 'lazy'}
                onClick={toggleFullscreen}
              />
            </div>
          ))}
        </animated.div>

        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition-all hover:bg-black/70 group-hover:opacity-100 opacity-0"
              aria-label="Imagem anterior"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition-all hover:bg-black/70 group-hover:opacity-100 opacity-0"
              aria-label="Próxima imagem"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 transition-all ${
                    currentIndex === index
                      ? 'w-8 bg-white'
                      : 'w-2 bg-white/50 hover:bg-white/75'
                  } rounded-full`}
                  aria-label={`Ir para imagem ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <button
          onClick={toggleFullscreen}
          className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition-all hover:bg-black/70 group-hover:opacity-100 opacity-0"
          aria-label="Tela cheia"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </button>

        <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-md">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={e => e.stopPropagation()}
          >
            <animated.div
              {...bind()}
              style={slideSpring}
              className="flex h-full"
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative flex h-full w-full flex-shrink-0 items-center justify-center"
                >
                  <img
                    src={image}
                    alt={`${title} - Imagem ${index + 1}`}
                    className="max-h-[90vh] max-w-[90vw] object-contain"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              ))}
            </animated.div>

            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20"
                >
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20"
                >
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white backdrop-blur-md transition-all hover:bg-white/20"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}