import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/useToast'
import { useAddAllowedDomain } from '@/hooks/useCompanyMutations'
import { addDomainSchema, type AddDomainFormData } from './schemas'

interface AddDomainDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId: string
  primaryDomain: string
  additionalDomains?: string[]
}

export function AddDomainDialog({
  open,
  onOpenChange,
  companyId,
  primaryDomain,
  additionalDomains = [],
}: AddDomainDialogProps) {
  const { toast } = useToast()
  const addDomainMutation = useAddAllowedDomain(companyId)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<AddDomainFormData>({
    // @ts-expect-error - Type compatibility issue between Zod and react-hook-form
    resolver: zodResolver(addDomainSchema),
    defaultValues: {
      domain: '',
    },
  })

  const onSubmit = async (data: AddDomainFormData) => {
    // Validar duplicação no frontend
    const allDomains = [primaryDomain, ...additionalDomains]
    if (allDomains.includes(data.domain)) {
      setError('domain', {
        type: 'manual',
        message: 'Este domínio já está cadastrado',
      })
      return
    }

    try {
      const result = await addDomainMutation.mutateAsync({
        domain: data.domain,
      })

      if (!result.success) {
        throw new Error(result.error || 'Erro ao adicionar domínio')
      }

      toast({
        title: 'Sucesso!',
        description: `Domínio ${data.domain} adicionado com sucesso!`,
        variant: 'default',
      })

      reset()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Erro ao adicionar domínio',
        description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.',
        variant: 'destructive',
      })
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <i className="ph ph-globe text-blue-600" style={{ fontSize: '1.5rem' }} />
            Adicionar Domínio SSO
          </DialogTitle>
          <DialogDescription>
            Adicione um domínio permitido para autenticação SSO. Usuários com email deste domínio
            poderão acessar a empresa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain">
              Domínio <span className="text-destructive">*</span>
            </Label>
            <Input
              id="domain"
              type="text"
              {...register('domain')}
              placeholder="exemplo.com.br"
              autoComplete="off"
            />
            {errors.domain && (
              <p className="text-sm text-destructive">{errors.domain.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Digite apenas o domínio, sem prefixos (ex: exemplo.com, nao www.exemplo.com)
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-3">
            <div>
              <p className="text-sm font-medium mb-2">Domínios já cadastrados:</p>

              {/* Domínio Principal */}
              <div className="flex items-center gap-2 mb-2 p-2 rounded bg-primary/10 border border-primary/20">
                <i className="ph ph-star-fill text-primary text-xs" />
                <span className="font-mono text-sm font-semibold">{primaryDomain}</span>
                <Badge variant="default" className="ml-auto text-xs">Principal</Badge>
              </div>

              {/* Domínios Adicionais */}
              {additionalDomains.length > 0 && (
                <div className="space-y-1 mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Adicionais:</p>
                  {additionalDomains.map((domain) => (
                    <div key={domain} className="flex items-center gap-2 text-sm pl-2">
                      <i className="ph ph-circle text-[6px]" />
                      <span className="font-mono">{domain}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={addDomainMutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={addDomainMutation.isPending}>
              {addDomainMutation.isPending ? (
                <>
                  <i className="ph ph-spinner animate-spin mr-2" />
                  Adicionando...
                </>
              ) : (
                <>
                  <i className="ph ph-plus-circle mr-2" />
                  Adicionar Domínio
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
