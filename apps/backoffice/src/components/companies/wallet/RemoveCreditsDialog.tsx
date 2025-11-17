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
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/useToast'
import { useRemoveWalletCredits } from '@/hooks/useCompanyMutations'
import { removeCreditsSchema, type RemoveCreditsFormData } from './schemas'
import type { CompanyWalletStatus } from '@/types/company'
import { useState } from 'react'

interface RemoveCreditsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId: string
  currentWallet: CompanyWalletStatus
}

export function RemoveCreditsDialog({
  open,
  onOpenChange,
  companyId,
  currentWallet,
}: RemoveCreditsDialogProps) {
  const { toast } = useToast()
  const removeCreditsMutation = useRemoveWalletCredits(companyId)
  const [confirmChecked, setConfirmChecked] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<RemoveCreditsFormData>({
    // @ts-expect-error - Type compatibility issue between Zod and react-hook-form
    resolver: zodResolver(removeCreditsSchema),
    defaultValues: {
      amount: 0,
      reason: '',
    },
  })

  const amount = watch('amount')
  const reason = watch('reason')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const burnRate = currentWallet.burnRate ?? 0
  const newBalance = currentWallet.balance - (amount || 0)
  const isLargeRemoval = amount > currentWallet.balance * 0.5
  const exceedsBalance = amount > currentWallet.balance

  const onSubmit = async (data: RemoveCreditsFormData) => {
    if (!confirmChecked) {
      toast({
        title: 'Confirmação necessária',
        description: 'Por favor, confirme que entende que esta ação será auditada.',
        variant: 'destructive',
      })
      return
    }

    if (exceedsBalance) {
      toast({
        title: 'Valor inválido',
        description: 'O valor a remover não pode ser maior que o saldo atual.',
        variant: 'destructive',
      })
      return
    }

    try {
      const result = await removeCreditsMutation.mutateAsync({
        amount: data.amount,
        reason: data.reason,
      })

      if (!result.success) {
        throw new Error(result.error || 'Erro ao remover créditos')
      }

      toast({
        title: 'Créditos removidos',
        description: `${formatCurrency(data.amount)} removidos da carteira`,
        variant: 'default',
      })

      reset()
      setConfirmChecked(false)
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Erro ao remover créditos',
        description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.',
        variant: 'destructive',
      })
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset()
      setConfirmChecked(false)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <i className="ph ph-minus-circle text-red-600" style={{ fontSize: '1.5rem' }} />
            Remover Créditos da Carteira
          </DialogTitle>
          <DialogDescription>
            Remova créditos da carteira da empresa. Esta ação será auditada e requer justificativa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Audit Warning */}
          <Alert variant="default" className="border-yellow-200 bg-yellow-50">
            <AlertDescription className="text-sm flex items-center gap-2 text-yellow-800">
              <i className="ph ph-warning" style={{ fontSize: '1rem' }} />
              <span>
                Esta operação será registrada na auditoria e requer justificativa detalhada.
              </span>
            </AlertDescription>
          </Alert>

          {/* Current Balance */}
          <div className="rounded-lg bg-muted p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Saldo Atual</span>
              <span className="text-lg font-bold">{formatCurrency(currentWallet.balance)}</span>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              Valor a Remover <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                R$
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={currentWallet.balance}
                {...register('amount', { valueAsNumber: true })}
                placeholder="0.00"
                className="pl-10"
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
            {exceedsBalance && (
              <p className="text-sm text-destructive">
                O valor não pode ser maior que o saldo atual.
              </p>
            )}
          </div>

          {/* New Balance Preview */}
          {amount > 0 && !exceedsBalance && (
            <div
              className={`rounded-lg border p-4 ${
                isLargeRemoval
                  ? 'bg-red-50 border-red-200'
                  : newBalance < burnRate
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`text-sm font-medium ${
                    isLargeRemoval
                      ? 'text-red-700'
                      : newBalance < burnRate
                        ? 'text-yellow-700'
                        : 'text-gray-700'
                  }`}
                >
                  Novo Saldo
                </span>
                <span
                  className={`text-xl font-bold ${
                    isLargeRemoval
                      ? 'text-red-700'
                      : newBalance < burnRate
                        ? 'text-yellow-700'
                        : 'text-gray-900'
                  }`}
                >
                  {formatCurrency(newBalance)}
                </span>
              </div>
              <p
                className={`text-xs mt-1 ${
                  isLargeRemoval
                    ? 'text-red-600'
                    : newBalance < burnRate
                      ? 'text-yellow-600'
                      : 'text-gray-600'
                }`}
              >
                - {formatCurrency(amount)}
              </p>
              {isLargeRemoval && (
                <p className="text-xs text-red-600 mt-2 font-medium">
                  Atenção: Você está removendo mais de 50% do saldo atual!
                </p>
              )}
              {newBalance < burnRate && !isLargeRemoval && (
                <p className="text-xs text-yellow-600 mt-2 font-medium">
                  Atenção: O novo saldo ficará abaixo da taxa de queima mensal!
                </p>
              )}
            </div>
          )}

          {/* Reason Input - REQUIRED */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Justificativa <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              {...register('reason')}
              placeholder="Descreva detalhadamente o motivo desta remoção de créditos..."
              rows={4}
              maxLength={500}
              className={errors.reason ? 'border-destructive' : ''}
            />
            {errors.reason && (
              <p className="text-sm text-destructive">{errors.reason.message}</p>
            )}
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Mínimo 10 caracteres</span>
              <span>{reason?.length || 0}/500</span>
            </div>
          </div>

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
              Confirmo que entendo que esta ação será auditada e os créditos serão removidos
              permanentemente.
            </label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={removeCreditsMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={
                removeCreditsMutation.isPending ||
                !amount ||
                amount <= 0 ||
                exceedsBalance ||
                !reason ||
                reason.length < 10 ||
                !confirmChecked
              }
            >
              {removeCreditsMutation.isPending ? (
                <>
                  <i className="ph ph-spinner animate-spin mr-2" />
                  Removendo...
                </>
              ) : (
                <>
                  <i className="ph ph-minus-circle mr-2" />
                  Remover Créditos
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
