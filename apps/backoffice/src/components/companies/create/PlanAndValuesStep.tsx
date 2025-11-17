import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PlanType } from '@/types/company'
import { CreateCompanyWizardData } from './schemas'

interface PlanAndValuesStepProps {
  form: UseFormReturn<CreateCompanyWizardData>
}

export function PlanAndValuesStep({ form }: PlanAndValuesStepProps) {
  const { register, formState: { errors }, watch, setValue } = form

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'initialValues',
  })

  const addValue = () => {
    if (fields.length < 10) {
      append({
        title: '',
        description: '',
        iconName: 'star',
        iconColor: '#3B82F6',
      })
    }
  }

  const defaultPrices = {
    [PlanType.ESSENTIAL]: 14,
    [PlanType.PROFESSIONAL]: 18,
  }

  const handlePlanChange = (planType: string) => {
    setValue('plan.planType', planType as PlanType)
    setValue('plan.pricePerUser', defaultPrices[planType as PlanType])
  }

  return (
    <div className="space-y-6">
      {/* Plan Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Plano e Precificação</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="planType">Tipo de Plano *</Label>
            <Select
              value={watch('plan.planType') || ''}
              onValueChange={handlePlanChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PlanType.ESSENTIAL}>
                  Essential (50-200 usuários)
                </SelectItem>
                <SelectItem value={PlanType.PROFESSIONAL}>
                  Professional (200-1000 usuários)
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.plan?.planType && (
              <p className="text-sm text-destructive">{errors.plan.planType.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricePerUser">Preço por Usuário (R$) *</Label>
            <Input
              id="pricePerUser"
              type="number"
              step="0.01"
              {...register('plan.pricePerUser', { valueAsNumber: true })}
              placeholder="14.00"
            />
            {errors.plan?.pricePerUser && (
              <p className="text-sm text-destructive">{errors.plan.pricePerUser.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Data de Início do Plano *</Label>
          <Input
            id="startDate"
            type="date"
            {...register('plan.startDate')}
          />
          {errors.plan?.startDate && (
            <p className="text-sm text-destructive">{errors.plan.startDate.message}</p>
          )}
        </div>
      </div>

      {/* Values Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Valores Iniciais da Empresa</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addValue}
            disabled={fields.length >= 10}
          >
            <i className="ph ph-plus mr-2" style={{ fontSize: '1rem' }} />
            Adicionar Valor
          </Button>
        </div>

        {errors.initialValues && (
          <p className="text-sm text-destructive">
            {typeof errors.initialValues === 'object' && 'message' in errors.initialValues
              ? errors.initialValues.message
              : 'Adicione entre 2 e 10 valores'}
          </p>
        )}

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium">Valor #{index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 2}
                >
                  <i className="ph ph-trash" style={{ fontSize: '1rem' }} />
                </Button>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`value-title-${index}`}>Título *</Label>
                  <Input
                    id={`value-title-${index}`}
                    {...register(`initialValues.${index}.title`)}
                    placeholder="Ex: Colaboração"
                  />
                  {errors.initialValues?.[index]?.title && (
                    <p className="text-sm text-destructive">
                      {errors.initialValues[index]?.title?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`value-iconColor-${index}`}>Cor</Label>
                  <Input
                    id={`value-iconColor-${index}`}
                    type="color"
                    {...register(`initialValues.${index}.iconColor`)}
                    className="h-10"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor={`value-description-${index}`}>Descrição</Label>
                  <Input
                    id={`value-description-${index}`}
                    {...register(`initialValues.${index}.description`)}
                    placeholder="Ex: Trabalhar em equipe"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {fields.length === 0 && (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="mb-4 text-sm text-muted-foreground">
              Nenhum valor adicionado ainda. Adicione pelo menos 2 valores.
            </p>
            <Button type="button" variant="outline" onClick={addValue}>
              <i className="ph ph-plus mr-2" style={{ fontSize: '1rem' }} />
              Adicionar Primeiro Valor
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
