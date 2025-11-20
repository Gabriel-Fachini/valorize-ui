import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreateResponseNew } from '@/types/company'

interface CompanyCreatedSuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: CreateResponseNew
}

export function CompanyCreatedSuccessDialog({
  open,
  onOpenChange,
  data,
}: CompanyCreatedSuccessDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(data.passwordResetUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reload page to refresh company list
    window.location.reload()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <i className="ph ph-check-circle text-green-600" style={{ fontSize: '1.5rem' }} />
            <DialogTitle>Empresa criada com sucesso!</DialogTitle>
          </div>
          <DialogDescription>
            A empresa <strong>{data.company.name}</strong> foi criada e o primeiro administrador foi configurado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Admin Info */}
          <Alert>
            <i className="ph ph-envelope" style={{ fontSize: '1rem' }} />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-semibold">Administrador criado:</p>
                <p className="text-sm">
                  <strong>Nome:</strong> {data.firstAdmin.name}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {data.firstAdmin.email}
                </p>
                <p className="text-sm">
                  <strong>Função:</strong> {data.firstAdmin.roles.join(', ')}
                </p>
              </div>
            </AlertDescription>
          </Alert>

          {/* Password Reset Link */}
          <div className="space-y-2">
            <Label>Link de Configuração de Senha</Label>
            <div className="flex gap-2">
              <Input
                value={data.passwordResetUrl}
                readOnly
                className="font-mono text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {copied ? (
                  <i className="ph ph-check text-green-600" style={{ fontSize: '1rem' }} />
                ) : (
                  <i className="ph ph-copy" style={{ fontSize: '1rem' }} />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Este link permite que o administrador configure sua senha e acesse o sistema pela primeira vez.
            </p>
          </div>

          {/* Instructions */}
          <Alert>
            <AlertDescription className="text-sm">
              <strong>Próximos passos:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Copie o link acima (clique no botão de copiar)</li>
                <li>Envie o link para o administrador por email ou WhatsApp</li>
                <li>O administrador deve clicar no link e definir sua senha</li>
                <li>Após definir a senha, o administrador poderá fazer login no sistema</li>
              </ol>
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button onClick={handleClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
