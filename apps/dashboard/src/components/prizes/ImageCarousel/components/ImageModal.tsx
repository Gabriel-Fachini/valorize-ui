import { memo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useSpring, animated } from '@react-spring/web'
import { getAnimationConfig, getAnimationPreset } from '@/constants/animations'
import { ImageModalProps } from '../types'

export const ImageModal = memo<ImageModalProps>(({ isOpen, onClose, children }) => {
  const modalBackdropConfig = getAnimationConfig('modalBackdrop')
  const modalConfig = getAnimationConfig('modal')
  const modalPreset = getAnimationPreset('modalEntrance')

  const backdropSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    config: modalBackdropConfig,
    immediate: !isOpen,
  })

  const modalSpring = useSpring({
    ...modalPreset,
    opacity: isOpen ? 1 : 0,
    config: modalConfig,
    immediate: !isOpen,
  })

  // Body overflow management
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <animated.div
      style={backdropSpring}
      className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm p-4 sm:p-6"
      onClick={onClose}
    >
      <animated.div
        style={modalSpring}
        className="relative max-w-4xl max-h-[70vh] w-full bg-white dark:bg-[#262626] rounded-2xl shadow-2xl overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </animated.div>
    </animated.div>,
    document.body,
  )
})