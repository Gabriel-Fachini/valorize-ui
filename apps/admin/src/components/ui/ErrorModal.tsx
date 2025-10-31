import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog'
import { Button } from './button'

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  onRetry?: () => void
  title: string
  message: string
}

export const ErrorModal = ({
  isOpen,
  onClose,
  onRetry,
  title,
  message,
}: ErrorModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex flex-col items-center justify-center text-red-500 mb-2">
            <i className="ph ph-x-circle text-5xl" />
          </div>
          <DialogTitle className="text-center text-xl font-bold text-red-600">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-700">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2">
          {onRetry && (
            <Button onClick={onRetry} variant="destructive">
              Tentar Novamente
            </Button>
          )}
          <Button onClick={onClose} variant="outline">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
