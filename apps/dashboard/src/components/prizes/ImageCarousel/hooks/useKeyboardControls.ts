import { useEffect } from 'react'

interface KeyboardControlsProps {
  isModalOpen: boolean
  onPrevious: () => void
  onNext: () => void
  onClose: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
}

export const useKeyboardControls = ({
  isModalOpen,
  onPrevious,
  onNext,
  onClose,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}: KeyboardControlsProps) => {
  useEffect(() => {
    if (!isModalOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          onPrevious()
          break
        case 'ArrowRight':
          onNext()
          break
        case 'Escape':
          onClose()
          break
        case '+':
        case '=':
          onZoomIn()
          break
        case '-':
          onZoomOut()
          break
        case '0':
          onResetZoom()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, onPrevious, onNext, onClose, onZoomIn, onZoomOut, onResetZoom])
}