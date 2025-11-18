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
import { useCreateCharge } from '@/hooks/useChargeMutations'
import { useCompanies } from '@/hooks/useCompanies'
import { PaymentMethod } from '@/types/financial'
import { createChargeSchema, type CreateChargeFormData } from './schemas'

interface CreateChargeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateChargeDialog({ open, onOpenChange }: CreateChargeDialogProps) {
  const { toast } = useToast()
  const createChargeMutation = useCreateCharge()

  // Fetch companies for selection
  const { data: companiesData, isLoading: isLoadingCompanies } = useCompanies(
    {},
    { page: 1, limit: 100 },
    { sortBy: 'name', sortOrder: 'asc' }
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateChargeFormData>({
    // @ts-expect-error - Type compatibility issue between Zod and react-hook-form
    resolver: zodResolver(createChargeSchema),
    defaultValues: {
      companyId: '',
      amount: '',
      description: '',
      dueDate: '',
      issueDate: new Date().toISOString().split('T')[0],
      paymentMethod: undefined,
      notes: '',
    },
  })

  const selectedPaymentMethod = watch('paymentMethod')

  const onSubmit = async (data: CreateChargeFormData) => {
    try {
      // Convert amount string to number
      const amount = parseFloat(data.amount.replace(/[^\d,.-]/g, '').replace(',', '.'))

      const result = await createChargeMutation.mutateAsync({
        companyId: data.companyId,
        amount,
        description: data.description,
        dueDate: data.dueDate,
        issueDate: data.issueDate,
        paymentMethod: data.paymentMethod,
        notes: data.notes || undefined,
      })

      if (!result.success) {
        throw new Error(result.error || 'Erro ao criar cobrança')
      }

      toast({
        title: 'Sucesso!',
        description: 'Cobrança criada com sucesso!',
        variant: 'default',
      })

      reset()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Erro ao criar cobrança',
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <i className="ph ph-plus-circle text-blue-600" style={{ fontSize: '1.5rem' }} />
            Nova Cobrança
          </DialogTitle>
          <DialogDescription>
            Crie uma nova cobrança para uma empresa. Todos os campos marcados com * são
            obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Company Selection */}
          <div className="space-y-2">
            <Label htmlFor="companyId">
              Empresa <span className="text-destructive">*</span>
            </Label>
            <Select
              value={watch('companyId')}
              onValueChange={(value) => setValue('companyId', value)}
              disabled={isLoadingCompanies}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
              <SelectContent>
                {companiesData?.data?.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.companyId && (
              <p className="text-sm text-destructive">{errors.companyId.message}</p>
            )}
          </div>

          {/* Amount and Dates Row */}
          <div className="grid grid-cols-3 gap-4">
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
              <Label htmlFor="issueDate">
                Data Emissão <span className="text-destructive">*</span>
              </Label>
              <Input id="issueDate" type="date" {...register('issueDate')} />
              {errors.issueDate && (
                <p className="text-sm text-destructive">{errors.issueDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">
                Vencimento <span className="text-destructive">*</span>
              </Label>
              <Input id="dueDate" type="date" {...register('dueDate')} />
              {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Descrição <span className="text-destructive">*</span>
            </Label>
            <Input
              id="description"
              type="text"
              {...register('description')}
              placeholder="Descrição da cobrança"
              autoComplete="off"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Método de Pagamento</Label>
            <Select
              value={selectedPaymentMethod}
              onValueChange={(value) => setValue('paymentMethod', value as PaymentMethod)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um método (opcional)" />
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
              placeholder="Observações adicionais (opcional)"
              rows={3}
            />
            {errors.notes && <p className="text-sm text-destructive">{errors.notes.message}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createChargeMutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createChargeMutation.isPending}>
              {createChargeMutation.isPending ? (
                <>
                  <i className="ph ph-spinner animate-spin mr-2" />
                  Criando...
                </>
              ) : (
                <>
                  <i className="ph ph-plus-circle mr-2" />
                  Criar Cobrança
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
