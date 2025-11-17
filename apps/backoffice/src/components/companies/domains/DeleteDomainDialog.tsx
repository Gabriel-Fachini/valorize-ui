import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/useToast'
import { useDeleteAllowedDomain } from '@/hooks/useCompanyMutations'
import type { AllowedDomain } from '@/types/company'

interface DeleteDomainDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId: string
  domain: AllowedDomain | null
}

export function DeleteDomainDialog({
  open,
  onOpenChange,
  companyId,
  domain,
}: DeleteDomainDialogProps) {
  const { toast } = useToast()
  const deleteDomainMutation = useDeleteAllowedDomain(companyId)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!domain) return

    setIsDeleting(true)
    try {
      const result = await deleteDomainMutation.mutateAsync(domain.id)

      if (!result.success) {
        throw new Error(result.error || 'Erro ao remover domínio')
      }

      toast({
        title: 'Domínio removido',
        description: `O domínio ${domain.domain} foi removido com sucesso!`,
        variant: 'default',
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Erro ao remover domínio',
        description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isDeleting) {
      onOpenChange(newOpen)
    }
  }

  if (!domain) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <i className="ph ph-warning text-red-600" style={{ fontSize: '1.5rem' }} />
            Remover Domínio SSO
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover este domínio? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="default" className="border-yellow-200 bg-yellow-50">
            <AlertDescription className="text-sm flex items-center gap-2 text-yellow-800">
              <i className="ph ph-warning" style={{ fontSize: '1rem' }} />
              <span>Esta ação será registrada na auditoria do sistema.</span>
            </AlertDescription>
          </Alert>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground mb-1">Domínio a ser removido:</p>
            <p className="font-mono font-bold text-lg">{domain.domain}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Cadastrado em: {new Date(domain.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-800">
              <strong>Atenção:</strong> Após a remoção, usuários com email deste domínio não
              poderão mais acessar a empresa através de autenticação SSO.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <i className="ph ph-spinner animate-spin mr-2" />
                Removendo...
              </>
            ) : (
              <>
                <i className="ph ph-trash mr-2" />
                Remover Domínio
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
