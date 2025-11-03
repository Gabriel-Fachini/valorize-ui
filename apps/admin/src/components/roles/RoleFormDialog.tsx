import { type FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { PermissionsSelector } from './PermissionsSelector'
import { useRolePermissions } from '@/hooks/useRolePermissions'
import { toast } from '@/lib/toast'
import type { RoleWithCounts, RoleFormData, PermissionCategory } from '@/types/roles'
import { roleFormSchema } from '@/types/roles'

interface RoleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: RoleWithCounts
  onSubmit: (data: RoleFormData) => Promise<void>
  isLoading?: boolean
}

type FormStep = 'info' | 'permissions'

export const RoleFormDialog: FC<RoleFormDialogProps> = ({
  open,
  onOpenChange,
  role,
  onSubmit,
  isLoading = false,
}) => {
  const [currentStep, setCurrentStep] = useState<FormStep>('info')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const { permissions: currentPermissions, isLoading: isLoadingPermissions } = useRolePermissions(
    role?.id || ''
  )
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: '',
      description: '',
      permissionNames: [],
    },
  })

  // Reset form when dialog opens/closes or role changes
  useEffect(() => {
    if (!open) {
      return
    }

    if (!role) {
      // New role - reset form with empty values
      reset({
        name: '',
        description: '',
        permissionNames: [],
      })
      setSelectedPermissions([])
      setCurrentStep('info')
    } else {
      // Existing role - populate form with basic info
      reset({
        name: role.name,
        description: role.description ?? '',
        permissionNames: [],
      })
      setCurrentStep('info')
    }
  }, [open, role, reset])

  // Update form with permissions when they load (only for existing roles)
  useEffect(() => {
    if (!open || !role || !Array.isArray(currentPermissions)) {
      return
    }

    const permissionNames = currentPermissions
      .flatMap((category: PermissionCategory) => category.permissions?.map((p) => p.name) ?? [])
      .filter((name: string | undefined): name is string => !!name)

    setSelectedPermissions(permissionNames)
  }, [open, role, currentPermissions])

  const handleFormSubmit = async (data: { name: string; description?: string; permissionNames?: string[] }) => {
    const formData: RoleFormData = {
      name: data.name,
      description: data.description || undefined,
      permissionNames: selectedPermissions.length > 0 ? selectedPermissions : undefined,
    }
    await onSubmit(formData)
    
    // Show success toast
    const isNewRole = !role
    if (isNewRole) {
      toast.success(`Cargo "${data.name}" criado com sucesso!`)
    } else {
      toast.success(`Cargo "${data.name}" atualizado com sucesso!`)
    }
    
    reset()
    setSelectedPermissions([])
    onOpenChange(false)
  }

  const handleNextStep = async () => {
    // Validate the current form before moving to next step
    await handleSubmit(async () => {
      setCurrentStep('permissions')
    }, async () => {
      // On error, don't advance
    })()
  }

  const handlePreviousStep = () => {
    setCurrentStep('info')
  }

  const isEditingExistingRole = !!role

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {role ? 'Editar Cargo' : 'Criar Novo Cargo'}
          </DialogTitle>
          <DialogDescription>
            {isEditingExistingRole
              ? 'Atualize as informações do cargo'
              : currentStep === 'info'
                ? 'Etapa 1 de 2: Informações básicas'
                : 'Etapa 2 de 2: Escolha as permissões'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 'info' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Cargo *</Label>
                <input
                  id="name"
                  type="text"
                  placeholder="Ex: Gerente de RH"
                  {...register('name')}
                  disabled={isLoading}
                  className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {errors.name && (
                  <span className="text-sm text-red-600">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <textarea
                  id="description"
                  placeholder="Descrição opcional do cargo"
                  {...register('description')}
                  disabled={isLoading}
                  className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  rows={4}
                />
                {errors.description && (
                  <span className="text-sm text-red-600">
                    {errors.description.message}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Permissions */}
          {currentStep === 'permissions' && (
            <div className="space-y-4">
              <div>
                <Label className="mb-3 block font-semibold">Selecione as Permissões</Label>
                {isLoadingPermissions && role ? (
                  <div className="rounded border border-gray-200 p-4">
                    <div className="flex items-center justify-center">
                      <div className="text-sm text-gray-500">Carregando permissões...</div>
                    </div>
                  </div>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto rounded border border-gray-200 p-4">
                    <PermissionsSelector
                      value={selectedPermissions}
                      onChange={setSelectedPermissions}
                      isLoading={isLoading}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-between gap-2 sm:justify-between">
            {currentStep === 'permissions' && !isEditingExistingRole ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={isLoading}
                >
                  Voltar
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Salvando...' : 'Criar Cargo'}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isLoading}
                >
                  {isEditingExistingRole ? (
                    isLoading ? (
                      'Salvando...'
                    ) : (
                      'Salvar'
                    )
                  ) : (
                    'Próxima Etapa'
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
