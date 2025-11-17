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
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/useToast'
import { useFreezeWallet, useUnfreezeWallet } from '@/hooks/useCompanyMutations'
import type { CompanyWalletStatus } from '@/types/company'

interface FreezeWalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId: string
  currentWallet: CompanyWalletStatus
}

export function FreezeWalletDialog({
  open,
  onOpenChange,
  companyId,
  currentWallet,
}: FreezeWalletDialogProps) {
  const { toast } = useToast()
  const freezeMutation = useFreezeWallet()
  const unfreezeMutation = useUnfreezeWallet()
  const [confirmChecked, setConfirmChecked] = useState(false)

  const isCurrentlyFrozen = currentWallet.isFrozen
  const isLoading = freezeMutation.isPending || unfreezeMutation.isPending

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const handleFreeze = async () => {
    if (!confirmChecked) {
      toast({
        title: 'Confirmação necessária',
        description: 'Por favor, confirme que entende o impacto desta ação.',
        variant: 'destructive',
      })
      return
    }

    try {
      const result = await freezeMutation.mutateAsync(companyId)

      if (!result.success) {
        throw new Error(result.error || 'Erro ao congelar carteira')
      }

      toast({
        title: 'Carteira congelada',
        description: 'Resgates bloqueados. Os colaboradores não podem mais resgatar prêmios.',
        variant: 'default',
      })

      setConfirmChecked(false)
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Erro ao congelar carteira',
        description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.',
        variant: 'destructive',
      })
    }
  }

  const handleUnfreeze = async () => {
    if (!confirmChecked) {
      toast({
        title: 'Confirmação necessária',
        description: 'Por favor, confirme que deseja descongelar a carteira.',
        variant: 'destructive',
      })
      return
    }

    try {
      const result = await unfreezeMutation.mutateAsync(companyId)

      if (!result.success) {
        throw new Error(result.error || 'Erro ao descongelar carteira')
      }

      toast({
        title: 'Carteira descongelada',
        description: 'Resgates liberados. Os colaboradores podem voltar a resgatar prêmios.',
        variant: 'default',
      })

      setConfirmChecked(false)
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Erro ao descongelar carteira',
        description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.',
        variant: 'destructive',
      })
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setConfirmChecked(false)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCurrentlyFrozen ? (
              <>
                <i className="ph ph-fire text-orange-600" style={{ fontSize: '1.5rem' }} />
                Descongelar Carteira
              </>
            ) : (
              <>
                <i className="ph ph-snowflake text-blue-600" style={{ fontSize: '1.5rem' }} />
                Congelar Carteira
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isCurrentlyFrozen
              ? 'Restaure a capacidade dos colaboradores de resgatar prêmios.'
              : 'Bloqueie temporariamente todos os resgates de prêmios da empresa.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Wallet Info */}
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Saldo Disponível</span>
              <span className="text-lg font-bold">{formatCurrency(currentWallet.balance)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status Atual</span>
              <span className={`text-sm font-semibold ${isCurrentlyFrozen ? 'text-blue-600' : 'text-green-600'}`}>
                {isCurrentlyFrozen ? 'Congelada' : 'Ativa'}
              </span>
            </div>
          </div>

          {/* Freeze Warning */}
          {!isCurrentlyFrozen && (
            <>
              <Alert variant="default" className="border-blue-200 bg-blue-50">
                <AlertDescription className="text-sm space-y-2">
                  <div className="flex items-center gap-2 font-medium text-blue-800 mb-2">
                    <i className="ph ph-info" style={{ fontSize: '1rem' }} />
                    <span>O que acontece ao congelar a carteira:</span>
                  </div>
                  <ul className="space-y-1 text-blue-700 text-xs ml-6">
                    <li className="flex items-start gap-2">
                      <i className="ph ph-dot text-lg flex-shrink-0 mt-0.5" style={{ fontSize: '0.75rem' }} />
                      <span>Todos os resgates de prêmios serão bloqueados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ph ph-dot text-lg flex-shrink-0 mt-0.5" style={{ fontSize: '0.75rem' }} />
                      <span>Os colaboradores não poderão resgatar vouchers ou produtos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ph ph-dot text-lg flex-shrink-0 mt-0.5" style={{ fontSize: '0.75rem' }} />
                      <span>O saldo será mantido, mas ficará bloqueado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ph ph-dot text-lg flex-shrink-0 mt-0.5" style={{ fontSize: '0.75rem' }} />
                      <span>Campanhas de reconhecimento continuam ativas</span>
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <AlertDescription className="text-sm flex items-center gap-2">
                  <i className="ph ph-warning" style={{ fontSize: '1rem' }} />
                  <span>
                    Esta ação impacta TODOS os colaboradores da empresa. Use apenas quando necessário.
                  </span>
                </AlertDescription>
              </Alert>
            </>
          )}

          {/* Unfreeze Info */}
          {isCurrentlyFrozen && (
            <>
              <Alert variant="default" className="border-orange-200 bg-orange-50">
                <AlertDescription className="text-sm space-y-2">
                  <div className="flex items-center gap-2 font-medium text-orange-800 mb-2">
                    <i className="ph ph-info" style={{ fontSize: '1rem' }} />
                    <span>O que acontece ao descongelar a carteira:</span>
                  </div>
                  <ul className="space-y-1 text-orange-700 text-xs ml-6">
                    <li className="flex items-start gap-2">
                      <i className="ph ph-dot text-lg flex-shrink-0 mt-0.5" style={{ fontSize: '0.75rem' }} />
                      <span>Os colaboradores poderão voltar a resgatar prêmios</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ph ph-dot text-lg flex-shrink-0 mt-0.5" style={{ fontSize: '0.75rem' }} />
                      <span>O saldo de {formatCurrency(currentWallet.balance)} ficará disponível</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ph ph-dot text-lg flex-shrink-0 mt-0.5" style={{ fontSize: '0.75rem' }} />
                      <span>Resgates de vouchers e produtos serão liberados</span>
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>
            </>
          )}

          {/* Confirmation Checkbox */}
          <div className="flex items-start space-x-2 p-3 rounded-lg bg-muted">
            <Checkbox
              id="confirm"
              checked={confirmChecked}
              onCheckedChange={(checked) => setConfirmChecked(checked as boolean)}
            />
            <label
              htmlFor="confirm"
              className="text-sm font-medium leading-tight cursor-pointer"
            >
              {isCurrentlyFrozen
                ? 'Confirmo que desejo descongelar a carteira e liberar os resgates de prêmios.'
                : 'Confirmo que entendo que esta ação bloqueará todos os resgates de prêmios para todos os colaboradores.'}
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          {isCurrentlyFrozen ? (
            <Button
              onClick={handleUnfreeze}
              disabled={isLoading || !confirmChecked}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isLoading ? (
                <>
                  <i className="ph ph-spinner animate-spin mr-2" />
                  Descongelando...
                </>
              ) : (
                <>
                  <i className="ph ph-fire mr-2" />
                  Descongelar Carteira
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleFreeze}
              variant="destructive"
              disabled={isLoading || !confirmChecked}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <i className="ph ph-spinner animate-spin mr-2" />
                  Congelando...
                </>
              ) : (
                <>
                  <i className="ph ph-snowflake mr-2" />
                  Congelar Carteira
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
