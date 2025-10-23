import React from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { getAnimationConfig, getAnimationPreset } from '@/constants/animations'

interface ImageCarouselProps {
  images: string[]
  title: string
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [zoom, setZoom] = React.useState(1)
  const [isDragging, setIsDragging] = React.useState(false)

  // Main carousel slide animation
  const slideSpring = useSpring({
    transform: `translateX(-${currentIndex * 100}%)`,
    config: getAnimationConfig('card'),
  })

  // Modal backdrop animation
  const backdropSpring = useSpring({
    opacity: isModalOpen ? 1 : 0,
    config: getAnimationConfig('modalBackdrop'),
  })

  // Modal content animation
  const modalSpring = useSpring({
    ...getAnimationPreset('modalEntrance'),
    opacity: isModalOpen ? 1 : 0,
    config: getAnimationConfig('modal'),
  })

  // Zoom animation
  const zoomSpring = useSpring({
    scale: zoom,
    config: getAnimationConfig('button'),
  })

  // Memoized handlers for stable references
  const goToSlide = React.useCallback((index: number) => {
    setCurrentIndex(index)
    setZoom(1)
  }, [])

  const goToPrevious = React.useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))
    setZoom(1)
  }, [images.length])

  const goToNext = React.useCallback(() => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))
    setZoom(1)
  }, [images.length])

  const handleZoomIn = React.useCallback(() => {
    setZoom(prev => Math.min(prev + 0.5, 3))
  }, [])

  const handleZoomOut = React.useCallback(() => {
    setZoom(prev => Math.max(prev - 0.5, 1))
  }, [])

  const resetZoom = React.useCallback(() => {
    setZoom(1)
  }, [])

  const openModal = React.useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const closeModal = React.useCallback(() => {
    setIsModalOpen(false)
    setZoom(1)
  }, [])

  // Body overflow management - proper cleanup
  React.useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  // Drag gesture for carousel
  // Note: useDrag callback has stable references via useCallback above
  const bind = useDrag(
    ({ direction: [xDir], distance, down }) => {
      setIsDragging(down)
      if (!down && distance[0] > 50) {
        if (xDir > 0) {
          goToPrevious()
        } else if (xDir < 0) {
          goToNext()
        }
      }
    },
    {
      axis: 'x',
      filterTaps: true,
    },
  )

  // Keyboard navigation - now with proper dependencies
  React.useEffect(() => {
    if (!isModalOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
      if (e.key === 'Escape') closeModal()
      if (e.key === '+' || e.key === '=') handleZoomIn()
      if (e.key === '-') handleZoomOut()
      if (e.key === '0') resetZoom()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, goToPrevious, goToNext, closeModal, handleZoomIn, handleZoomOut, resetZoom])

  // Early return for empty images
  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/3] flex items-center justify-center rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl">
        <p className="text-gray-500 dark:text-gray-400">Nenhuma imagem disponível</p>
      </div>
    )
  }

  return (
    <>
      {/* Main Carousel Preview */}
      <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl">
        <animated.div
          {...bind()}
          style={slideSpring}
          className={`flex h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="relative h-full w-full flex-shrink-0"
              onClick={openModal}
            >
              <img
                src={image}
                alt={`${title} - Imagem ${index + 1}`}
                className="h-full w-full object-contain"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </animated.div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 dark:bg-white/10 p-2 sm:p-3 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 hover:bg-black/80 dark:hover:bg-white/20 transition-all"
              aria-label="Imagem anterior"
              type="button"
            >
              <i className="ph ph-caret-left text-lg sm:text-xl" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 dark:bg-white/10 p-2 sm:p-3 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 hover:bg-black/80 dark:hover:bg-white/20 transition-all"
              aria-label="Próxima imagem"
              type="button"
            >
              <i className="ph ph-caret-right text-lg sm:text-xl" />
            </button>
          </>
        )}

        {/* Expand Button */}
        <button
          onClick={openModal}
          className="absolute right-3 top-3 rounded-full bg-black/60 dark:bg-white/10 p-2 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 hover:bg-black/80 dark:hover:bg-white/20 transition-all"
          aria-label="Ver em tela cheia"
          type="button"
        >
          <i className="ph ph-arrows-out text-lg" />
        </button>

        {/* Image Counter */}
        <div className="absolute left-3 top-3 rounded-full bg-black/60 dark:bg-white/10 px-3 py-1.5 text-xs sm:text-sm font-medium text-white backdrop-blur-md">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Dot Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
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

      {/* Full Screen Modal */}
      {isModalOpen && (
        <animated.div
          style={backdropSpring}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/90 dark:bg-black/90 backdrop-blur-md"
          onClick={closeModal}
        >
          <animated.div
            style={modalSpring}
            className="relative h-full w-full flex"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Thumbnail Sidebar */}
            {images.length > 1 && (
              <div className="hidden md:flex flex-col gap-3 p-6 overflow-y-auto max-h-screen w-32 bg-white/10 dark:bg-black/30 backdrop-blur-lg border-r border-white/10">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg flex-shrink-0 border-2 transition-all ${
                      currentIndex === index
                        ? 'border-white ring-2 ring-white/50'
                        : 'border-white/30 hover:border-white/60'
                    }`}
                    aria-label={`Ver imagem ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`Miniatura ${index + 1}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    {currentIndex === index && (
                      <div className="absolute inset-0 bg-white/20" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Main Image Container */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
              <div className="relative max-w-full max-h-full">
                <animated.img
                  style={zoomSpring}
                  src={images[currentIndex]}
                  alt={`${title} - Imagem ${currentIndex + 1}`}
                  className="max-h-[85vh] max-w-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Top Controls Bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-gray-900/80 dark:from-black/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white/20 dark:bg-white/10 backdrop-blur-md px-4 py-2 text-sm font-semibold text-white shadow-lg">
                  {currentIndex + 1} / {images.length}
                </div>
                <div className="hidden sm:block rounded-lg bg-white/10 dark:bg-white/5 backdrop-blur-md px-4 py-2 text-sm text-white shadow-lg">
                  Use ← → para navegar
                </div>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg bg-white/20 dark:bg-white/10 backdrop-blur-md p-2.5 text-white hover:bg-white/30 dark:hover:bg-white/20 transition-all shadow-lg"
                aria-label="Fechar visualizador"
                type="button"
              >
                <i className="ph ph-x text-xl" />
              </button>
            </div>

            {/* Bottom Zoom Controls */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center p-6 bg-gradient-to-t from-gray-900/80 dark:from-black/80 to-transparent">
              <div className="flex items-center gap-2 rounded-lg bg-white/20 dark:bg-white/10 backdrop-blur-md p-2 shadow-lg">
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= 1}
                  className="rounded-md p-2 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Diminuir zoom"
                  type="button"
                >
                  <i className="ph ph-magnifying-glass-minus text-lg" />
                </button>

                <div className="px-3 text-sm font-medium text-white min-w-[60px] text-center">
                  {Math.round(zoom * 100)}%
                </div>

                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                  className="rounded-md p-2 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Aumentar zoom"
                  type="button"
                >
                  <i className="ph ph-magnifying-glass-plus text-lg" />
                </button>

                {zoom > 1 && (
                  <button
                    onClick={resetZoom}
                    className="ml-2 rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors"
                    aria-label="Resetar zoom"
                    type="button"
                  >
                    Resetar
                  </button>
                )}
              </div>
            </div>

            {/* Navigation Arrows in Modal */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 md:left-36 top-1/2 -translate-y-1/2 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-md p-3 sm:p-4 text-white hover:bg-white/30 dark:hover:bg-white/20 transition-all shadow-lg"
                  aria-label="Imagem anterior"
                  type="button"
                >
                  <i className="ph ph-caret-left text-2xl sm:text-3xl" />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-md p-3 sm:p-4 text-white hover:bg-white/30 dark:hover:bg-white/20 transition-all shadow-lg"
                  aria-label="Próxima imagem"
                  type="button"
                >
                  <i className="ph ph-caret-right text-2xl sm:text-3xl" />
                </button>
              </>
            )}
          </animated.div>
        </animated.div>
      )}
    </>
  )
}