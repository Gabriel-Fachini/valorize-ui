import { type FC } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { SimpleInput } from '@/components/ui/simple-input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { userFormSchema, type UserFormData, type User } from '@/types/users'
import { useDepartments, useJobTitles } from '@/hooks/useFilters'

interface UserFormProps {
  user?: User
  onSubmit: (data: UserFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export const UserForm: FC<UserFormProps> = ({ user, onSubmit, onCancel, isSubmitting }) => {
  const { data: departments, isLoading: isLoadingDepartments } = useDepartments()
  const { data: jobTitles, isLoading: isLoadingJobTitles } = useJobTitles()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      departmentId: user?.department?.id || '',
      jobTitleId: user?.position?.id || '',
      isActive: user?.isActive ?? true,
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
        <Controller
          name="departmentId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || 'none'}
              onValueChange={(value) => field.onChange(value === 'none' ? '' : value)}
              disabled={isLoadingDepartments}
            >
              <SelectTrigger>
                <i className="ph ph-buildings mr-2 h-4 w-4" />
                <SelectValue placeholder="Selecione um departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum departamento</SelectItem>
                {departments?.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobTitleId">Cargo (opcional)</Label>
        <Controller
          name="jobTitleId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || 'none'}
              onValueChange={(value) => field.onChange(value === 'none' ? '' : value)}
              disabled={isLoadingJobTitles}
            >
              <SelectTrigger>
                <i className="ph ph-briefcase mr-2 h-4 w-4" />
                <SelectValue placeholder="Selecione um cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum cargo</SelectItem>
                {jobTitles?.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {user && (
        <div className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="isActive" className="text-base">
                Status do usuário
              </Label>
              <p className="text-sm text-muted-foreground">
                {user ? 'Ativar ou desativar o acesso do usuário ao sistema' : 'Novo usuário será criado como ativo'}
              </p>
            </div>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  id="isActive"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      )}

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
