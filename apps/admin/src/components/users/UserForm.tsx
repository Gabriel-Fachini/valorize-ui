import { type FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { SimpleInput } from '@/components/ui/simple-input'
import { Label } from '@/components/ui/label'
import { userFormSchema, type UserFormData, type User } from '@/types/users'

interface UserFormProps {
  user?: User
  onSubmit: (data: UserFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export const UserForm: FC<UserFormProps> = ({ user, onSubmit, onCancel, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      departmentId: user?.department?.id || '',
      jobTitleId: user?.position?.id || '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo *</Label>
        <SimpleInput id="name" {...register('name')} aria-invalid={errors.name ? 'true' : 'false'} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <SimpleInput
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="departmentId">Departamento (opcional)</Label>
        <SimpleInput id="departmentId" {...register('departmentId')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobTitleId">Cargo (opcional)</Label>
        <SimpleInput id="jobTitleId" {...register('jobTitleId')} />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : user ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  )
}
