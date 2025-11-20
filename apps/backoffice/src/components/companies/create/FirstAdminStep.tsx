import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CreateCompanyWizardData } from './schemas'

interface FirstAdminStepProps {
  form: UseFormReturn<CreateCompanyWizardData>
}

export function FirstAdminStep({ form }: FirstAdminStepProps) {
  const { register, formState: { errors }, watch } = form
  const domain = watch('domain')

  return (
    <div className="space-y-4">
      <Alert>
        <i className="ph ph-info" style={{ fontSize: '1rem' }} />
        <AlertDescription>
          O primeiro administrador terá acesso total ao sistema e poderá gerenciar usuários, configurações e valores da empresa.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="firstAdmin.name">Nome do Administrador *</Label>
        <Input
          id="firstAdmin.name"
          {...register('firstAdmin.name')}
          placeholder="Ex: João Silva"
        />
        {errors.firstAdmin?.name && (
          <p className="text-sm text-destructive">{errors.firstAdmin.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="firstAdmin.email">Email do Administrador *</Label>
        <Input
          id="firstAdmin.email"
          type="email"
          {...register('firstAdmin.email')}
          placeholder={domain ? `admin@${domain}` : 'admin@empresa.com.br'}
        />
        {errors.firstAdmin?.email && (
          <p className="text-sm text-destructive">{errors.firstAdmin.email.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          O email deve pertencer ao domínio da empresa: <strong>@{domain || 'empresa.com.br'}</strong>
        </p>
      </div>

      <Alert>
        <AlertDescription className="text-xs">
          <strong>Importante:</strong> Após a criação, um link de configuração de senha será gerado. Você deve enviá-lo ao administrador para que ele configure sua senha e acesse o sistema.
        </AlertDescription>
      </Alert>
    </div>
  )
}
