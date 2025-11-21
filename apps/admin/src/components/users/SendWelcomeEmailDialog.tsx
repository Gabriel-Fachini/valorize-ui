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

interface SendWelcomeEmailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User
  onConfirm: () => Promise<void>
  isSending?: boolean
}

export const SendWelcomeEmailDialog: FC<SendWelcomeEmailDialogProps> = ({
  open,
  onOpenChange,
  user,
  onConfirm,
  isSending,
}) => {
  const handleConfirm = async () => {
    await onConfirm()
    onOpenChange(false)
  }

  if (!user) return null

  const emailCount = user.welcomeEmailSendCount || 0
  const canSend = emailCount < 3
  const isAtLimit = emailCount >= 3

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enviar Email de Boas-Vindas</DialogTitle>
          <DialogDescription>
            Enviar email de boas-vindas para <strong>{user.name}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Status de envio:</p>
            <Badge variant={isAtLimit ? 'destructive' : emailCount > 0 ? 'secondary' : 'default'}>
              {emailCount}/3 emails enviados
            </Badge>
          </div>
          {user.lastWelcomeEmailSentAt && (
            <p className="text-sm text-muted-foreground">
              Último envio:{' '}
              <span className="font-medium">
                {new Date(user.lastWelcomeEmailSentAt).toLocaleString('pt-BR')}
              </span>
            </p>
          )}
          {isAtLimit ? (
            <p className="text-sm text-destructive font-medium">
              Limite de envios atingido. Este usuário já recebeu 3 emails de boas-vindas.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              O email será enviado para <strong>{user.email}</strong> contendo instruções para
              definir a senha e acessar o sistema.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSending}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isSending || isAtLimit}>
            {isSending ? 'Enviando...' : 'Enviar Email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
