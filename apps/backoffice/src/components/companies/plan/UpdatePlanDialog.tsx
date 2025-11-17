import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/useToast'
import { useUpdateCompanyPlan } from '@/hooks/useCompanyMutations'
import { useCompanyBilling } from '@/hooks/useCompanies'
import { updatePlanSchema, type UpdatePlanFormData } from './schemas'
import { PlanType, type CompanyPlan } from '@/types/company'

interface UpdatePlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId: string
  currentPlan?: CompanyPlan
}

const PLAN_DEFAULTS = {
  ESSENTIAL: 14,
  PROFESSIONAL: 18,
}

export function UpdatePlanDialog({
  open,
  onOpenChange,
  companyId,
  currentPlan,
}: UpdatePlanDialogProps) {
  const { toast } = useToast()
  const updatePlanMutation = useUpdateCompanyPlan(companyId)
  const { data: billing } = useCompanyBilling(companyId)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
    setValue,
  } = useForm<UpdatePlanFormData>({
    // @ts-expect-error - Type compatibility issue between Zod and react-hook-form
    resolver: zodResolver(updatePlanSchema),
    defaultValues: {
      planType: currentPlan?.planType || PlanType.ESSENTIAL,
      pricePerUser: currentPlan?.pricePerUser || PLAN_DEFAULTS.ESSENTIAL,
      startDate: new Date().toISOString(),
    },
  })

  const planType = watch('planType')
  const pricePerUser = watch('pricePerUser')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  // Calculate new MRR based on form values
  const activeUsers = billing?.activeUsers || 0
  const currentMRR = billing?.currentMRR || 0
  const newMRR = activeUsers * (pricePerUser || 0)
  const mrrDifference = newMRR - currentMRR

  const onSubmit = async (data: UpdatePlanFormData) => {
    try {
      const result = await updatePlanMutation.mutateAsync({
        planType: data.planType,
        pricePerUser: data.pricePerUser,
        startDate: data.startDate,
      })

      if (!result.success) {
        throw new Error(result.error || 'Erro ao atualizar plano')
      }

      toast({
        title: 'Sucesso!',
        description: `Plano atualizado para ${data.planType} com sucesso!`,
        variant: 'default',
      })

      reset()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Erro ao atualizar plano',
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

  const handlePlanTypeChange = (value: string) => {
    const planType = value as PlanType
    // Update price per user to default when plan type changes
    setValue('pricePerUser', PLAN_DEFAULTS[planType])
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <i className="ph ph-swap text-blue-600" style={{ fontSize: '1.5rem' }} />
            Alterar Plano
          </DialogTitle>
          <DialogDescription>
            Atualize o plano da empresa. Esta ação será registrada na auditoria.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Plan */}
          {currentPlan && (
            <div className="rounded-lg bg-muted p-4">
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Plano Atual</span>
                <p className="text-lg font-bold">{currentPlan.planType}</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(Number(currentPlan.pricePerUser))} por usuário
                </p>
              </div>
            </div>
          )}

          {/* Plan Type Select */}
          <div className="space-y-2">
            <Label htmlFor="planType">
              Tipo de Plano <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="planType"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value)
                    handlePlanTypeChange(value)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PlanType.ESSENTIAL}>
                      Essential - {formatCurrency(PLAN_DEFAULTS.ESSENTIAL)}/usuário
                    </SelectItem>
                    <SelectItem value={PlanType.PROFESSIONAL}>
                      Professional - {formatCurrency(PLAN_DEFAULTS.PROFESSIONAL)}/usuário
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.planType && (
              <p className="text-sm text-destructive">{errors.planType.message}</p>
            )}
          </div>

          {/* Price Per User Input */}
          <div className="space-y-2">
            <Label htmlFor="pricePerUser">
              Preço por Usuário <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                R$
              </span>
              <Input
                id="pricePerUser"
                type="number"
                step="0.01"
                min="0"
                max="1000"
                {...register('pricePerUser', { valueAsNumber: true })}
                placeholder="0.00"
                className="pl-10"
              />
            </div>
            {errors.pricePerUser && (
              <p className="text-sm text-destructive">{errors.pricePerUser.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Padrão {planType}: {formatCurrency(PLAN_DEFAULTS[planType])}
            </p>
          </div>

          {/* Start Date Input */}
          <div className="space-y-2">
            <Label htmlFor="startDate">
              Data de Início <span className="text-destructive">*</span>
            </Label>
            <Input
              id="startDate"
              type="datetime-local"
              {...register('startDate')}
            />
            {errors.startDate && (
              <p className="text-sm text-destructive">{errors.startDate.message}</p>
            )}
          </div>

          {/* MRR Impact Preview */}
          {billing && (
            <div
              className={`rounded-lg border p-4 ${
                mrrDifference > 0
                  ? 'bg-green-500/10 dark:bg-green-500/20 border-green-500/50'
                  : mrrDifference < 0
                    ? 'bg-red-500/10 dark:bg-red-500/20 border-red-500/50'
                    : 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/50'
              }`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">MRR Atual</span>
                  <span className="font-bold">{formatCurrency(currentMRR)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Novo MRR</span>
                  <span className="text-xl font-bold">{formatCurrency(newMRR)}</span>
                </div>
                {mrrDifference !== 0 && (
                  <div className="flex justify-between items-center pt-2 border-t border-border/50">
                    <span className="text-sm font-medium">Impacto</span>
                    <span
                      className={`font-bold ${
                        mrrDifference > 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {mrrDifference > 0 ? '+' : ''}
                      {formatCurrency(mrrDifference)}
                    </span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Cálculo: {activeUsers} usuários × {formatCurrency(pricePerUser || 0)}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={updatePlanMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updatePlanMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updatePlanMutation.isPending ? (
                <>
                  <i className="ph ph-spinner animate-spin mr-2" />
                  Atualizando...
                </>
              ) : (
                <>
                  <i className="ph ph-swap mr-2" />
                  Atualizar Plano
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
