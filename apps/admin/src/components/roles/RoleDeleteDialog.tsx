import { type FC } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { RoleWithCounts } from '@/types/roles'

interface RoleDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: RoleWithCounts
  onConfirm: () => Promise<void>
  isLoading?: boolean
}

export const RoleDeleteDialog: FC<RoleDeleteDialogProps> = ({
  open,
  onOpenChange,
  role,
  onConfirm,
  isLoading = false,
}) => {
  const handleDelete = async () => {
    if (role && !isLoading) {
      await onConfirm()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deletar Cargo</DialogTitle>
          <DialogDescription>
            {role?.usersCount && role.usersCount > 0 ? (
              <div className="space-y-2">
                <p>
                  ⚠️ Este cargo possui <strong>{role.usersCount}</strong> usuário
                  {role.usersCount !== 1 ? 's' : ''} atribuído
                  {role.usersCount !== 1 ? 's' : ''}.
                </p>
                <p>
                  Você precisa remover todos os usuários antes de deletar este cargo.
                </p>
              </div>
            ) : (
              <p>
                Tem certeza que deseja deletar o cargo <strong>{role?.name}</strong>? Esta ação não pode ser desfeita.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          {!role?.usersCount || role.usersCount === 0 ? (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Deletando...' : 'Deletar'}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
