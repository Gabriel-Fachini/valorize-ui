import { type FC } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { User } from '@/types/users'

interface UserDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User
  onConfirm: () => Promise<void>
  isDeleting?: boolean
}

export const UserDeleteDialog: FC<UserDeleteDialogProps> = ({
  open,
  onOpenChange,
  user,
  onConfirm,
  isDeleting,
}) => {
  const handleConfirm = async () => {
    await onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja desativar o usuário <strong>{user?.name}</strong>?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Esta ação irá desativar o usuário, mas os dados permanecerão no sistema. O usuário não
            poderá mais fazer login.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
