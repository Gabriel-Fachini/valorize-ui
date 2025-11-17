import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreateCompanyWizardData } from './schemas'

interface BasicInfoStepProps {
  form: UseFormReturn<CreateCompanyWizardData>
}

export function BasicInfoStep({ form }: BasicInfoStepProps) {
  const { register, formState: { errors } } = form

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Empresa *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Ex: Acme Corporation"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="domain">Domínio *</Label>
        <Input
          id="domain"
          {...register('domain')}
          placeholder="Ex: acme.com.br"
        />
        {errors.domain && (
          <p className="text-sm text-destructive">{errors.domain.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Domínio principal usado para login dos usuários
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="billingEmail">Email de Cobrança (opcional)</Label>
        <Input
          id="billingEmail"
          type="email"
          {...register('billingEmail')}
          placeholder="financeiro@empresa.com.br"
        />
        {errors.billingEmail && (
          <p className="text-sm text-destructive">{errors.billingEmail.message}</p>
        )}
      </div>
    </div>
  )
}
