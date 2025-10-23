import React, { useCallback } from 'react'
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from './modal'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface AlertDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
  isLoading?: boolean
  className?: string
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  isLoading = false,
  className,
}) => {
  const handleConfirm = useCallback(() => {
    onConfirm()
    onClose()
  }, [onConfirm, onClose])

  const confirmButtonVariant = variant === 'destructive' ? 'destructive' : 'default'
  const confirmButtonClass = variant === 'destructive' 
    ? 'bg-red-600 hover:bg-red-700 text-white' 
    : 'bg-green-600 hover:bg-green-700 text-white'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      className={className}
    >
      <ModalHeader>
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full',
            variant === 'destructive' 
              ? 'bg-red-100 dark:bg-red-500/20' 
              : 'bg-yellow-100 dark:bg-yellow-500/20'
          )}>
            <i className={cn(
              'text-2xl',
              variant === 'destructive' 
                ? 'ph-bold ph-warning-circle text-red-600 dark:text-red-400' 
                : 'ph-bold ph-question text-yellow-600 dark:text-yellow-400'
            )} />
          </div>
          <ModalTitle>{title}</ModalTitle>
        </div>
      </ModalHeader>

      <ModalContent>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </ModalContent>

      <ModalFooter>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          className="flex-1"
        >
          {cancelText}
        </Button>
        <Button
          variant={confirmButtonVariant}
          onClick={handleConfirm}
          disabled={isLoading}
          className={cn('flex-1', confirmButtonClass)}
        >
          {isLoading ? (
            <>
              <i className="ph ph-circle-notch animate-spin" />
              Processando...
            </>
          ) : (
            confirmText
          )}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

// Hook para facilitar uso do AlertDialog
export const useAlertDialog = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [config, setConfig] = React.useState<{
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: 'default' | 'destructive'
    onConfirm: () => void
  } | null>(null)

  const showAlert = useCallback((alertConfig: {
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: 'default' | 'destructive'
    onConfirm: () => void
  }) => {
    setConfig(alertConfig)
    setIsOpen(true)
  }, [])

  const closeAlert = useCallback(() => {
    setIsOpen(false)
    setConfig(null)
  }, [])

  const AlertDialogComponent = React.useMemo(() => {
    if (!config) return null

    return (
      <AlertDialog
        isOpen={isOpen}
        onClose={closeAlert}
        onConfirm={config.onConfirm}
        title={config.title}
        description={config.description}
        confirmText={config.confirmText}
        cancelText={config.cancelText}
        variant={config.variant}
      />
    )
  }, [isOpen, config, closeAlert])

  return {
    showAlert,
    AlertDialog: AlertDialogComponent,
  }
}
