import { type FC } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { User } from '@/types/users'

interface PasswordResetConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | undefined
  onConfirm: () => Promise<void>
  isLoading?: boolean
}

export const PasswordResetConfirmModal: FC<PasswordResetConfirmModalProps> = ({
  open,
  onOpenChange,
  user,
  onConfirm,
  isLoading = false,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao redefinir senha:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <i className="ph ph-warning text-2xl text-amber-600" />
            Confirmar Redefinição de Senha
          </DialogTitle>
          <DialogDescription>
            Esta ação gerará um novo link de redefinição de senha para o usuário
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
            <p className="text-sm text-amber-900 dark:text-amber-100">
              <span className="font-medium">Email:</span> {user?.email || 'Carregando...'}
            </p>
            {user?.name && (
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
                <span className="font-medium">Nome:</span> {user.name}
              </p>
            )}
          </div>

          {/* Info Message */}
          <div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950">
            <p className="flex items-start gap-2 text-sm font-medium text-blue-800 dark:text-blue-200">
              <i className="ph ph-info mt-0.5 flex-shrink-0" />
              O que acontecerá
            </p>
            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>• Um novo link de reset será gerado</li>
              <li>• O link será válido por 24 horas</li>
              <li>• O usuário poderá redefinir sua senha usando o link</li>
              <li>• Links anteriores continuarão válidos por 24h</li>
            </ul>
          </div>

          {/* Warning Message */}
          <div className="space-y-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950">
            <p className="flex items-start gap-2 text-sm font-medium text-red-800 dark:text-red-200">
              <i className="ph ph-warning mt-0.5 flex-shrink-0" />
              Certifique-se de que o usuário solicitou essa ação
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={handleConfirm}
              disabled={isLoading}
              variant="destructive"
            >
              {isLoading ? (
                <>
                  <i className="ph ph-spinner mr-2 animate-spin" />
                  Gerando link...
                </>
              ) : (
                <>
                  <i className="ph ph-key mr-2" />
                  Redefinir Senha
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
