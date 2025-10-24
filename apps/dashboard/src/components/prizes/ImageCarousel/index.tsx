import { memo } from 'react'
import { ImageCarouselProps } from './types'
import { useCarouselState } from './hooks/useCarouselState'
import { useImageZoom } from './hooks/useImageZoom'
import { useKeyboardControls } from './hooks/useKeyboardControls'
import { CarouselPreview } from './components/CarouselPreview'
import { ImageModal } from './components/ImageModal'
import { ImageViewer } from './components/ImageViewer'
import { ImageControls } from './components/ImageControls'
import { ThumbnailSidebar } from './components/ThumbnailSidebar'
import { NavigationArrows } from './components/NavigationArrows'

export const ImageCarousel = memo<ImageCarouselProps>(({ images }) => {
  // Hooks especializados
  const carouselState = useCarouselState(images)
  const zoomState = useImageZoom()

  // Keyboard controls
  useKeyboardControls({
    isModalOpen: carouselState.isModalOpen,
    onPrevious: carouselState.goToPrevious,
    onNext: carouselState.goToNext,
    onClose: carouselState.closeModal,
    onZoomIn: zoomState.zoomIn,
    onZoomOut: zoomState.zoomOut,
    onResetZoom: zoomState.resetZoom,
  })

  // Handlers para navegação
  const handleNavigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      carouselState.goToPrevious()
    } else {
      carouselState.goToNext()
    }
    // Reset zoom when navigating
    zoomState.resetZoom()
  }

  const handleImageSelect = (index: number) => {
    carouselState.goToSlide(index)
    zoomState.resetZoom()
  }

  return (
    <>
      {/* Main Carousel Preview */}
      <CarouselPreview
        images={images}
        currentIndex={carouselState.currentIndex}
        isDragging={carouselState.isDragging}
        onImageClick={carouselState.openModal}
        onNavigate={handleNavigate}
        onGoToSlide={handleImageSelect}
      />

      {/* Full Screen Modal */}
      <ImageModal
        isOpen={carouselState.isModalOpen}
        onClose={carouselState.closeModal}
      >
        {/* Thumbnail Sidebar */}
        <ThumbnailSidebar
          images={images}
          currentIndex={carouselState.currentIndex}
          onImageSelect={handleImageSelect}
        />

        {/* Main Image Container */}
        <div className="flex-1 flex flex-col">
          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-10 rounded-lg bg-gray-100 dark:bg-[#171717] px-4 py-2 text-sm font-semibold text-gray-700 dark:text-white shadow-lg border border-gray-300 dark:border-gray-600">
            {carouselState.currentIndex + 1} / {images.length}
          </div>

          {/* Image Viewer */}
          <ImageViewer
            images={images}
            currentIndex={carouselState.currentIndex}
            zoom={zoomState.zoom}
            position={zoomState.position}
            isImageDragging={zoomState.isImageDragging}
            onImageDrag={(offset, dragging) => zoomState.handleImageDrag({ offset, dragging })}
            onWheel={zoomState.handleWheel}
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <NavigationArrows
              onPrevious={carouselState.goToPrevious}
              onNext={carouselState.goToNext}
            />
          )}

          {/* Image Controls */}
          <ImageControls
            zoom={zoomState.zoom}
            onZoomIn={zoomState.zoomIn}
            onZoomOut={zoomState.zoomOut}
            onResetZoom={zoomState.resetZoom}
            onClose={carouselState.closeModal}
          />
        </div>
      </ImageModal>
    </>
  )
})
