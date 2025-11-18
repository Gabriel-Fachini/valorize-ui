import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/useToast'
import { useRegisterPayment } from '@/hooks/useChargeMutations'
import { PaymentMethod } from '@/types/financial'
import { registerPaymentSchema, type RegisterPaymentFormData } from './schemas'

interface RegisterPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chargeId: string
  chargeDescription: string
  chargeAmount: number
  currentBalance?: number
}

export function RegisterPaymentDialog({
  open,
  onOpenChange,
  chargeId,
  chargeDescription,
  chargeAmount,
  currentBalance,
}: RegisterPaymentDialogProps) {
  const { toast } = useToast()
  const registerPaymentMutation = useRegisterPayment(chargeId)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<RegisterPaymentFormData>({
    // @ts-expect-error - Type compatibility issue between Zod and react-hook-form
    resolver: zodResolver(registerPaymentSchema),
    defaultValues: {
      amount: '',
      paidAt: new Date().toISOString().split('T')[0],
      paymentMethod: undefined,
      notes: '',
    },
  })

  const selectedPaymentMethod = watch('paymentMethod')

  const onSubmit = async (data: RegisterPaymentFormData) => {
    try {
      // Convert amount string to number
      const amount = parseFloat(data.amount.replace(/[^\d,.-]/g, '').replace(',', '.'))

      const result = await registerPaymentMutation.mutateAsync({
        amount,
        paidAt: data.paidAt,
        paymentMethod: data.paymentMethod!,
        notes: data.notes || undefined,
      })

      if (!result.success) {
        throw new Error(result.error || 'Erro ao registrar pagamento')
      }

      toast({
        title: 'Sucesso!',
        description: 'Pagamento registrado com sucesso!',
        variant: 'default',
      })

      reset()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Erro ao registrar pagamento',
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <i className="ph ph-money text-green-600" style={{ fontSize: '1.5rem' }} />
            Registrar Pagamento
          </DialogTitle>
          <DialogDescription>
            Registre um pagamento para esta cobrança. O status será atualizado automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg bg-muted p-4 space-y-2 mb-4">
          <p className="text-sm font-medium">Cobrança:</p>
          <p className="text-sm text-muted-foreground">{chargeDescription}</p>
          <div className="flex justify-between mt-2 pt-2 border-t">
            <span className="text-sm font-medium">Valor Total:</span>
            <span className="text-sm font-bold">{formatCurrency(chargeAmount)}</span>
          </div>
          {currentBalance !== undefined && currentBalance > 0 && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">Saldo Restante:</span>
              <span className="text-sm font-bold text-orange-600">
                {formatCurrency(currentBalance)}
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Amount and Date Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">
                Valor (R$) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="amount"
                type="text"
                {...register('amount')}
                placeholder="0,00"
                autoComplete="off"
              />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paidAt">
                Data Pagamento <span className="text-destructive">*</span>
              </Label>
              <Input id="paidAt" type="date" {...register('paidAt')} />
              {errors.paidAt && <p className="text-sm text-destructive">{errors.paidAt.message}</p>}
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">
              Método de Pagamento <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedPaymentMethod}
              onValueChange={(value) => setValue('paymentMethod', value as PaymentMethod)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PaymentMethod.BOLETO}>Boleto</SelectItem>
                <SelectItem value={PaymentMethod.PIX}>PIX</SelectItem>
                <SelectItem value={PaymentMethod.CREDIT_CARD}>Cartão de Crédito</SelectItem>
              </SelectContent>
            </Select>
            {errors.paymentMethod && (
              <p className="text-sm text-destructive">{errors.paymentMethod.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Observações sobre o pagamento (opcional)"
              rows={3}
            />
            {errors.notes && <p className="text-sm text-destructive">{errors.notes.message}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={registerPaymentMutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={registerPaymentMutation.isPending}>
              {registerPaymentMutation.isPending ? (
                <>
                  <i className="ph ph-spinner animate-spin mr-2" />
                  Registrando...
                </>
              ) : (
                <>
                  <i className="ph ph-check-circle mr-2" />
                  Registrar Pagamento
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
