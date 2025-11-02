import { type FC, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { SimpleInput } from '@/components/ui/simple-input'
import { Badge } from '@/components/ui/badge'

interface PasswordResetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ticketUrl: string
  expiresIn?: string
}

export const PasswordResetModal: FC<PasswordResetModalProps> = ({
  open,
  onOpenChange,
  ticketUrl,
  expiresIn = '24 horas',
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(ticketUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <i className="ph ph-key text-2xl text-primary" />
            Link de Redefinição de Senha
          </DialogTitle>
          <DialogDescription>
            Um novo link foi gerado para redefinição de senha
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Password Reset Link */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Link de Redefinição</label>
              <Badge variant="outline">Válido por {expiresIn}</Badge>
            </div>
            <div className="flex gap-2">
              <SimpleInput
                value={ticketUrl}
                readOnly
                className="cursor-text font-mono text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="min-w-[100px]"
              >
                <i className={`ph ${copied ? 'ph-check' : 'ph-copy'} mr-2`} />
                {copied ? 'Copiado!' : 'Copiar'}
              </Button>
            </div>
          </div>

          {/* Info Message */}
          <div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
            <p className="flex items-start gap-2 text-sm font-medium text-blue-800 dark:text-blue-200">
              <i className="ph ph-info mt-0.5" />
              Como funciona
            </p>
            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>• O usuário clicará no link para redefinir a senha</li>
              <li>• O link é válido por {expiresIn}</li>
              <li>• Após redefinir, o usuário poderá fazer login com a nova senha</li>
              <li>• Compartilhe o link por um canal seguro</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Fechar
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={() => {
                handleCopyLink()
              }}
            >
              <i className="ph ph-envelope mr-2" />
              Enviar por Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
