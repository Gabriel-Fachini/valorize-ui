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

interface PasswordSetupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
  resetLink: string
  expiresIn?: string
}

export const PasswordSetupModal: FC<PasswordSetupModalProps> = ({
  open,
  onOpenChange,
  email,
  resetLink,
  expiresIn = '24 horas',
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(resetLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <i className="ph ph-check-circle text-2xl text-green-500" />
            Usuário Criado com Sucesso
          </DialogTitle>
          <DialogDescription>
            Compartilhe o link de configuração de senha com o usuário
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
            <p className="text-sm text-muted-foreground">Email do usuário</p>
            <p className="font-medium">{email}</p>
          </div>

          {/* Password Setup Link */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Link de Configuração de Senha</label>
              <Badge variant="outline">Válido por {expiresIn}</Badge>
            </div>
            <div className="flex gap-2">
              <SimpleInput
                value={resetLink}
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
          <div className="space-y-2 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
            <p className="flex items-start gap-2 text-sm font-medium text-yellow-800 dark:text-yellow-200">
              <i className="ph ph-info mt-0.5" />
              Importante
            </p>
            <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
              <li>• O usuário deve clicar no link para configurar sua própria senha</li>
              <li>• O link é válido por {expiresIn}</li>
              <li>• Após a configuração, o usuário poderá fazer login com suas credenciais</li>
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
                // Aqui você pode adicionar integração com email se necessário
              }}
            >
              <i className="ph ph-envelope mr-2" />
              Compartilhar por Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
