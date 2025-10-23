import { useReducer, useEffect, memo, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { getAnimationConfig, getAnimationPreset } from '@/constants/animations'

interface ImageCarouselProps {
  images: string[]
  title: string
}

// State interface for useReducer
interface CarouselState {
  currentIndex: number
  isModalOpen: boolean
  zoom: number
  isDragging: boolean
  imagePosition: { x: number; y: number }
  isImageDragging: boolean
}

// Action types for useReducer
type CarouselAction =
  | { type: 'SET_CURRENT_INDEX'; payload: number }
  | { type: 'SET_MODAL_OPEN'; payload: boolean }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'SET_DRAGGING'; payload: boolean }
  | { type: 'SET_IMAGE_POSITION'; payload: { x: number; y: number } }
  | { type: 'SET_IMAGE_DRAGGING'; payload: boolean }
  | { type: 'RESET_ZOOM_AND_POSITION' }
  | { type: 'GO_TO_PREVIOUS'; payload: number }
  | { type: 'GO_TO_NEXT'; payload: number }
  | { type: 'ADJUST_ZOOM'; payload: number }
  | { type: 'UPDATE_IMAGE_POSITION'; payload: { offset: [number, number]; zoom: number } }

// Reducer function
const carouselReducer = (state: CarouselState, action: CarouselAction): CarouselState => {
  switch (action.type) {
    case 'SET_CURRENT_INDEX':
      return { ...state, currentIndex: action.payload }
    
    case 'SET_MODAL_OPEN':
      return { 
        ...state, 
        isModalOpen: action.payload,
        ...(action.payload ? {} : { zoom: 1, imagePosition: { x: 0, y: 0 } }),
      }
    
    case 'SET_ZOOM':
      return { ...state, zoom: action.payload }
    
    case 'SET_DRAGGING':
      return { ...state, isDragging: action.payload }
    
    case 'SET_IMAGE_POSITION':
      return { ...state, imagePosition: action.payload }
    
    case 'SET_IMAGE_DRAGGING':
      return { ...state, isImageDragging: action.payload }
    
    case 'RESET_ZOOM_AND_POSITION':
      return { ...state, zoom: 1, imagePosition: { x: 0, y: 0 } }
    
    case 'GO_TO_PREVIOUS':
      return {
        ...state,
        currentIndex: state.currentIndex > 0 ? state.currentIndex - 1 : action.payload - 1,
        zoom: 1,
        imagePosition: { x: 0, y: 0 },
      }
    
    case 'GO_TO_NEXT':
      return {
        ...state,
        currentIndex: state.currentIndex < action.payload - 1 ? state.currentIndex + 1 : 0,
        zoom: 1,
        imagePosition: { x: 0, y: 0 },
      }
    
    case 'ADJUST_ZOOM':
      return { ...state, zoom: Math.max(0.9, Math.min(3, state.zoom + action.payload)) }
    
    case 'UPDATE_IMAGE_POSITION': {
      const { offset, zoom } = action.payload
      const zoomFactor = zoom - 1
      const baseOffset = 150
      const maxOffset = baseOffset + (zoomFactor * 200)
      
      const clampedX = Math.max(-maxOffset, Math.min(maxOffset, offset[0]))
      const clampedY = Math.max(-maxOffset, Math.min(maxOffset, offset[1]))
      
      return { ...state, imagePosition: { x: clampedX, y: clampedY } }
    }
    
    default:
      return state
  }
}

export const ImageCarousel = memo<ImageCarouselProps>(({ images, title }) => {
  const [state, dispatch] = useReducer(carouselReducer, {
    currentIndex: 0,
    isModalOpen: false,
    zoom: 1,
    isDragging: false,
    imagePosition: { x: 0, y: 0 },
    isImageDragging: false,
  })

  // Animation configs - simplified
  const cardConfig = getAnimationConfig('card')
  const modalBackdropConfig = getAnimationConfig('modalBackdrop')
  const modalConfig = getAnimationConfig('modal')
  const buttonConfig = getAnimationConfig('button')
  const modalPreset = getAnimationPreset('modalEntrance')

  // Spring animations
  const slideSpring = useSpring({
    transform: `translateX(-${state.currentIndex * 100}%)`,
    config: cardConfig,
  })

  const backdropSpring = useSpring({
    opacity: state.isModalOpen ? 1 : 0,
    config: modalBackdropConfig,
    immediate: !state.isModalOpen,
  })

  const modalSpring = useSpring({
    ...modalPreset,
    opacity: state.isModalOpen ? 1 : 0,
    config: modalConfig,
    immediate: !state.isModalOpen,
  })

  const zoomSpring = useSpring({
    scale: state.zoom,
    x: state.imagePosition.x,
    y: state.imagePosition.y,
    config: buttonConfig,
  })

  // Simplified handlers using dispatch
  const goToSlide = useCallback((index: number) => {
    dispatch({ type: 'SET_CURRENT_INDEX', payload: index })
    dispatch({ type: 'RESET_ZOOM_AND_POSITION' })
  }, [])

  const goToPrevious = useCallback(() => {
    dispatch({ type: 'GO_TO_PREVIOUS', payload: images.length })
  }, [images.length])

  const goToNext = useCallback(() => {
    dispatch({ type: 'GO_TO_NEXT', payload: images.length })
  }, [images.length])

  const handleZoomIn = useCallback(() => {
    dispatch({ type: 'ADJUST_ZOOM', payload: 0.5 })
  }, [])

  const handleZoomOut = useCallback(() => {
    dispatch({ type: 'ADJUST_ZOOM', payload: -0.5 })
  }, [])

  const resetZoom = useCallback(() => {
    dispatch({ type: 'RESET_ZOOM_AND_POSITION' })
  }, [])

  const openModal = useCallback(() => {
    dispatch({ type: 'SET_MODAL_OPEN', payload: true })
  }, [])

  const closeModal = useCallback(() => {
    dispatch({ type: 'SET_MODAL_OPEN', payload: false })
  }, [])

  // Handle scroll zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (!state.isModalOpen) return
    
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    dispatch({ type: 'ADJUST_ZOOM', payload: delta })
  }

  // Handle image drag for panning when zoomed
  const handleImageDrag = ({ offset, dragging }: { offset: [number, number], dragging?: boolean }) => {
    if (!dragging) {
      dispatch({ type: 'SET_IMAGE_DRAGGING', payload: false })
      return
    }

    dispatch({ type: 'SET_IMAGE_DRAGGING', payload: true })
    dispatch({ type: 'UPDATE_IMAGE_POSITION', payload: { offset, zoom: state.zoom } })
  }

  // Drag gesture for image panning
  const imageDragBind = useDrag(handleImageDrag, {
    filterTaps: true,
    bounds: { left: -400, right: 400, top: -400, bottom: 400 },
  })

  // Body overflow management
  useEffect(() => {
    if (state.isModalOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [state.isModalOpen])

  // Drag gesture for carousel
  const bind = useDrag(
    ({ direction: [xDir], distance, down }) => {
      dispatch({ type: 'SET_DRAGGING', payload: down })
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

  // Keyboard navigation
  useEffect(() => {
    if (!state.isModalOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
          goToNext()
          break
        case 'Escape':
          closeModal()
          break
        case '+':
        case '=':
          handleZoomIn()
          break
        case '-':
          handleZoomOut()
          break
        case '0':
          resetZoom()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.isModalOpen, goToPrevious, goToNext, closeModal, handleZoomIn, handleZoomOut, resetZoom])

  // Memoized empty state to prevent recreation
  const emptyState = useMemo(() => (
    <div className="aspect-[4/3] flex items-center justify-center rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl">
      <p className="text-gray-500 dark:text-gray-400">Nenhuma imagem disponível</p>
    </div>
  ), [])

  // Image elements - simplified memoization
  const imageElements = useMemo(() => {
    if (!images || images.length === 0) return null
    
    return images.map((image, index) => {
      const shouldRender = Math.abs(index - state.currentIndex) <= 1
      
      return (
        <div
          key={`${image}-${index}`}
          className="relative h-full w-full flex-shrink-0"
          onClick={openModal}
        >
          {shouldRender ? (
            <img
              src={image}
              alt={`${title} - Imagem ${index + 1}`}
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
  }, [images, state.currentIndex, title, openModal])

  // Early return for empty images
  if (!images || images.length === 0) {
    return emptyState
  }

  return (
    <>
      {/* Main Carousel Preview */}
      <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl">
        <animated.div
          {...bind()}
          style={slideSpring}
          className={`flex h-full ${state.isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        >
          {imageElements}
        </animated.div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-900 dark:bg-[#171717] text-white hover:bg-gray-800 dark:hover:bg-[#262626] opacity-0 group-hover:opacity-100 transition-all shadow-lg border border-gray-700 dark:border-gray-600 flex items-center justify-center"
              aria-label="Imagem anterior"
              type="button"
            >
              <i className="ph ph-caret-left text-lg sm:text-xl" />
            </button>

            <button
              onClick={goToNext}
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
          onClick={openModal}
          className="absolute right-3 top-3 w-10 h-10 rounded-full bg-gray-900 dark:bg-[#171717] text-white hover:bg-gray-800 dark:hover:bg-[#262626] opacity-0 group-hover:opacity-100 transition-all shadow-lg border border-gray-700 dark:border-gray-600 flex items-center justify-center"
          aria-label="Ver em tela cheia"
          type="button"
        >
          <i className="ph ph-arrows-out text-lg" />
        </button>

        {/* Image Counter */}
        <div className="absolute left-3 top-3 rounded-full bg-gray-900/90 dark:bg-[#171717]/90 backdrop-blur-sm px-3 py-1.5 text-xs sm:text-sm font-medium text-white shadow-lg border border-gray-700 dark:border-gray-600">
          {state.currentIndex + 1} / {images.length}
        </div>

        {/* Dot Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 bg-gray-900/80 dark:bg-[#171717]/80 backdrop-blur-sm rounded-full px-3 py-2 border border-gray-700 dark:border-gray-600">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  state.currentIndex === index
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Full Screen Modal - Rendered via Portal to escape layout constraints */}
      {state.isModalOpen && createPortal(
        <animated.div
          style={backdropSpring}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/90 dark:bg-black/90 backdrop-blur-md p-4 sm:p-6"
          onClick={closeModal}
        >
          <animated.div
            style={modalSpring}
            className="relative max-w-4xl max-h-[70vh] w-full bg-white dark:bg-[#262626] rounded-2xl shadow-2xl overflow-hidden flex"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Thumbnail Sidebar - Memoized for performance */}
            {images.length > 1 && (
              <div className="hidden md:flex flex-col gap-3 p-6 overflow-y-auto max-h-screen w-32 bg-white/10 dark:bg-[#171717] backdrop-blur-lg border-r border-white/10">
                {images.map((image, index) => (
                  <button
                    key={`thumb-${image}-${index}`}
                    onClick={() => goToSlide(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg flex-shrink-0 border-2 transition-all ${
                      state.currentIndex === index
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
                      decoding="async"
                    />
                    {state.currentIndex === index && (
                      <div className="absolute inset-0 bg-white/20" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Main Image Container */}
            <div 
              className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden"
              onWheel={handleWheel}
            >
              <div className="relative max-w-full max-h-full">
                <animated.img
                  {...imageDragBind()}
                  style={zoomSpring}
                  src={images[state.currentIndex]}
                  alt={`${title} - Imagem ${state.currentIndex + 1}`}
                  className={`max-h-[70vh] max-w-full object-contain select-none ${
                    state.isImageDragging ? 'cursor-grabbing' : state.zoom > 1 ? 'cursor-grab' : 'cursor-default'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                  loading="eager"
                  decoding="async"
                  draggable={false}
                />
              </div>
            </div>

            {/* Top Controls Bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-gray-900/80 dark:from-[#171717]/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-900 dark:bg-[#171717] px-4 py-2 text-sm font-semibold text-white shadow-lg border border-gray-700 dark:border-gray-600">
                  {state.currentIndex + 1} / {images.length}
                </div>
                <div className="hidden sm:block rounded-lg bg-gray-800 dark:bg-[#262626] px-4 py-2 text-sm text-white shadow-lg border border-gray-700 dark:border-gray-600">
                  Use ← → para navegar
                </div>
              </div>

              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-lg bg-gray-900 dark:bg-[#171717] text-white hover:bg-gray-800 dark:hover:bg-[#262626] transition-all shadow-lg border border-gray-700 dark:border-gray-600 flex items-center justify-center"
                aria-label="Fechar visualizador"
                type="button"
              >
                <i className="ph ph-x text-xl" />
              </button>
            </div>

            {/* Bottom Zoom Controls */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center p-6 bg-gradient-to-t from-gray-900/80 dark:from-[#171717]/80 to-transparent">
              <div className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 dark:bg-[#171717] p-3 shadow-lg border border-gray-700 dark:border-gray-600 md:ml-32">
                <button
                  onClick={handleZoomOut}
                  disabled={state.zoom <= 0.9}
                  className="w-10 h-10 rounded-md bg-gray-800 dark:bg-[#262626] text-white hover:bg-gray-700 dark:hover:bg-[#404040] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  aria-label="Diminuir zoom"
                  type="button"
                >
                  <i className="ph ph-magnifying-glass-minus text-lg" />
                </button>

                <div className="px-4 py-2 text-sm font-medium text-white min-w-[60px] text-center bg-gray-800 dark:bg-[#262626] rounded-md border border-gray-700 dark:border-gray-600">
                  {Math.round(state.zoom * 100)}%
                </div>

                <button
                  onClick={handleZoomIn}
                  disabled={state.zoom >= 3}
                  className="w-10 h-10 rounded-md bg-gray-800 dark:bg-[#262626] text-white hover:bg-gray-700 dark:hover:bg-[#404040] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  aria-label="Aumentar zoom"
                  type="button"
                >
                  <i className="ph ph-magnifying-glass-plus text-lg" />
                </button>

                {state.zoom > 1 && (
                  <button
                    onClick={resetZoom}
                    className="ml-2 rounded-md px-4 py-2 text-sm font-medium text-white bg-gray-800 dark:bg-[#262626] hover:bg-gray-700 dark:hover:bg-[#404040] transition-colors border border-gray-700 dark:border-gray-600"
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
                  className="absolute left-4 md:left-36 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-900 dark:bg-[#171717] text-white hover:bg-gray-800 dark:hover:bg-[#262626] transition-all shadow-lg border border-gray-700 dark:border-gray-600 flex items-center justify-center"
                  aria-label="Imagem anterior"
                  type="button"
                >
                  <i className="ph ph-caret-left text-2xl sm:text-3xl" />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-900 dark:bg-[#171717] text-white hover:bg-gray-800 dark:hover:bg-[#262626] transition-all shadow-lg border border-gray-700 dark:border-gray-600 flex items-center justify-center"
                  aria-label="Próxima imagem"
                  type="button"
                >
                  <i className="ph ph-caret-right text-2xl sm:text-3xl" />
                </button>
              </>
            )}
          </animated.div>
        </animated.div>,
        document.body,
      )}
    </>
  )
})