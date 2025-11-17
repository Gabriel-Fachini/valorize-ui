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
import { useToast } from '@/hooks/useToast'
import { useAddWalletCredits } from '@/hooks/useCompanyMutations'
import { addCreditsSchema, type AddCreditsFormData } from './schemas'
import type { CompanyWalletStatus } from '@/types/company'

interface AddCreditsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId: string
  currentWallet: CompanyWalletStatus
}

export function AddCreditsDialog({
  open,
  onOpenChange,
  companyId,
  currentWallet,
}: AddCreditsDialogProps) {
  const { toast } = useToast()
  const addCreditsMutation = useAddWalletCredits(companyId)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AddCreditsFormData>({
    // @ts-expect-error - Type compatibility issue between Zod and react-hook-form
    resolver: zodResolver(addCreditsSchema),
    defaultValues: {
      amount: 0,
      reason: '',
    },
  })

  const amount = watch('amount')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const newBalance = currentWallet.balance + (amount || 0)

  const onSubmit = async (data: AddCreditsFormData) => {
    try {
      const result = await addCreditsMutation.mutateAsync({
        amount: data.amount,
        reason: data.reason || undefined,
      })

      if (!result.success) {
        throw new Error(result.error || 'Erro ao adicionar créditos')
      }

      toast({
        title: 'Sucesso!',
        description: `${formatCurrency(data.amount)} adicionados com sucesso!`,
        variant: 'default',
      })

      reset()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Erro ao adicionar créditos',
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
            <i className="ph ph-plus-circle text-green-600" style={{ fontSize: '1.5rem' }} />
            Adicionar Créditos à Carteira
          </DialogTitle>
          <DialogDescription>
            Adicione créditos à carteira da empresa. Esta ação será registrada na auditoria.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              Valor a Adicionar <span className="text-destructive">*</span>
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
                max="1000000"
                {...register('amount', { valueAsNumber: true })}
                placeholder="0.00"
                className="pl-10"
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          {/* New Balance Preview */}
          {amount > 0 && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-700">Novo Saldo</span>
                <span className="text-xl font-bold text-green-700">
                  {formatCurrency(newBalance)}
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                + {formatCurrency(amount)}
              </p>
            </div>
          )}

          {/* Reason Input */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Justificativa <span className="text-muted-foreground text-xs">(opcional)</span>
            </Label>
            <Textarea
              id="reason"
              {...register('reason')}
              placeholder="Descreva o motivo desta adição de créditos..."
              rows={3}
              maxLength={500}
            />
            {errors.reason && (
              <p className="text-sm text-destructive">{errors.reason.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Recomendamos adicionar uma justificativa para fins de auditoria.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={addCreditsMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={addCreditsMutation.isPending || !amount || amount <= 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {addCreditsMutation.isPending ? (
                <>
                  <i className="ph ph-spinner animate-spin mr-2" />
                  Adicionando...
                </>
              ) : (
                <>
                  <i className="ph ph-plus-circle mr-2" />
                  Adicionar Créditos
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
