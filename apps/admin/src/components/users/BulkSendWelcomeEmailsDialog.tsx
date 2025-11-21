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
import { Badge } from '@/components/ui/badge'
import type { User } from '@/types/users'

interface BulkSendWelcomeEmailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  users: User[]
  onConfirm: () => Promise<void>
  isSending?: boolean
}

export const BulkSendWelcomeEmailsDialog: FC<BulkSendWelcomeEmailsDialogProps> = ({
  open,
  onOpenChange,
  users,
  onConfirm,
  isSending,
}) => {
  const handleConfirm = async () => {
    await onConfirm()
    onOpenChange(false)
  }

  const totalUsers = users.length
  const usersAtLimit = users.filter((u) => (u.welcomeEmailSendCount || 0) >= 3).length
  const usersToReceive = totalUsers - usersAtLimit
  const hasUsersAtLimit = usersAtLimit > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enviar Emails de Boas-Vindas em Lote</DialogTitle>
          <DialogDescription>
            Enviar emails de boas-vindas para os usuários selecionados
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total selecionado</p>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Receberão email</p>
              <p className="text-2xl font-bold text-green-600">{usersToReceive}</p>
            </div>
          </div>

          {hasUsersAtLimit && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-start gap-2">
                <i className="ph ph-warning text-destructive text-xl flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive mb-1">
                    {usersAtLimit} {usersAtLimit === 1 ? 'usuário' : 'usuários'} no limite
                  </p>
                  <p className="text-xs text-destructive/80">
                    {usersAtLimit === 1
                      ? 'Este usuário já recebeu 3 emails e será ignorado.'
                      : 'Estes usuários já receberam 3 emails e serão ignorados.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium">O que acontecerá:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-start gap-2">
                <i className="ph ph-check text-green-600 mt-0.5" />
                <span>Emails serão enviados para {usersToReceive} usuário{usersToReceive !== 1 ? 's' : ''}</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="ph ph-check text-green-600 mt-0.5" />
                <span>Cada email contém instruções para definir senha</span>
              </li>
              {hasUsersAtLimit && (
                <li className="flex items-start gap-2">
                  <i className="ph ph-x text-destructive mt-0.5" />
                  <span>Usuários no limite (3/3) serão ignorados</span>
                </li>
              )}
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSending}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isSending || usersToReceive === 0}>
            {isSending ? 'Enviando...' : `Enviar ${usersToReceive} email${usersToReceive !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
