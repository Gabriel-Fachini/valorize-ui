// Shared types for ImageCarousel components

export interface ImageCarouselProps {
  images: string[]
  title: string
}

export interface CarouselState {
  currentIndex: number
  isModalOpen: boolean
  isDragging: boolean
}

export interface ZoomState {
  zoom: number
  position: { x: number; y: number }
  isImageDragging: boolean
}

export interface NavigationProps {
  currentIndex: number
  totalImages: number
  onPrevious: () => void
  onNext: () => void
  onGoToSlide: (index: number) => void
}

export interface ImageControlsProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
  onClose: () => void
  showReset?: boolean
}

export interface ImageViewerProps {
  images: string[]
  currentIndex: number
  zoom: number
  position: { x: number; y: number }
  isImageDragging: boolean
  onImageDrag: (offset: [number, number], dragging?: boolean) => void
  onWheel: (e: React.WheelEvent) => void
}

export interface ThumbnailSidebarProps {
  images: string[]
  currentIndex: number
  onImageSelect: (index: number) => void
}

export interface CarouselPreviewProps {
  images: string[]
  currentIndex: number
  isDragging: boolean
  onImageClick: () => void
  onNavigate: (direction: 'prev' | 'next') => void
  onGoToSlide: (index: number) => void
}

export interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export interface NavigationArrowsProps {
  onPrevious: () => void
  onNext: () => void
  disabled?: boolean
  className?: string
}

// Action types for useReducer
export type CarouselAction =
  | { type: 'SET_CURRENT_INDEX'; payload: number }
  | { type: 'SET_MODAL_OPEN'; payload: boolean }
  | { type: 'SET_DRAGGING'; payload: boolean }
  | { type: 'GO_TO_PREVIOUS'; payload: number }
  | { type: 'GO_TO_NEXT'; payload: number }

export type ZoomAction =
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'SET_POSITION'; payload: { x: number; y: number } }
  | { type: 'SET_IMAGE_DRAGGING'; payload: boolean }
  | { type: 'RESET_ZOOM_AND_POSITION' }
  | { type: 'ADJUST_ZOOM'; payload: number }
  | { type: 'UPDATE_IMAGE_POSITION'; payload: { offset: [number, number]; zoom: number } }