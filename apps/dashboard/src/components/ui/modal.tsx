import React, { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useModalTransition } from '@/hooks/useAnimations'
import { animated } from '@react-spring/web'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-4xl',
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
}) => {
  const modalTransition = useModalTransition(isOpen)

  // Handle escape key
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && closeOnEscape) {
      onClose()
    }
  }, [onClose, closeOnEscape])

  // Handle backdrop click
  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose()
    }
  }, [onClose, closeOnBackdropClick])

  // Body overflow management
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return createPortal(
    modalTransition((style, item) =>
      item ? (
        <animated.div
          style={style as any}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/50 p-4 backdrop-blur-sm"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
        >
          <animated.div
            role="document"
            className={cn(
              'relative w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white/95 dark:bg-[#262626]/95 p-6 backdrop-blur-xl shadow-2xl max-h-[90vh] overflow-y-auto',
              sizeClasses[size],
              className,
            )}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Fechar modal"
              >
                <i className="ph ph-x text-xl text-gray-500 dark:text-gray-400" />
              </button>
            )}
            {children}
          </animated.div>
        </animated.div>
      ) : null,
    ),
    document.body,
  )
}

interface ModalHeaderProps {
  children: React.ReactNode
  className?: string
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn('mb-6', className)}>
      {children}
    </div>
  )
}

interface ModalTitleProps {
  children: React.ReactNode
  className?: string
}

export const ModalTitle: React.FC<ModalTitleProps> = ({ children, className }) => {
  return (
    <h2 className={cn('text-2xl font-bold text-gray-900 dark:text-white', className)}>
      {children}
    </h2>
  )
}

interface ModalContentProps {
  children: React.ReactNode
  className?: string
}

export const ModalContent: React.FC<ModalContentProps> = ({ children, className }) => {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  )
}

interface ModalFooterProps {
  children: React.ReactNode
  className?: string
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ children, className }) => {
  return (
    <div className={cn('flex gap-3 pt-4', className)}>
      {children}
    </div>
  )
}
