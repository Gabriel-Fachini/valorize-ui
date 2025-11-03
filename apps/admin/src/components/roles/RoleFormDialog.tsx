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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { PermissionsSelector } from './PermissionsSelector'
import { useRolePermissions } from '@/hooks/useRolePermissions'
import type { RoleWithCounts, RoleFormData, PermissionCategory } from '@/types/roles'
import { roleFormSchema } from '@/types/roles'

interface RoleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: RoleWithCounts
  onSubmit: (data: RoleFormData) => Promise<void>
  isLoading?: boolean
}

export const RoleFormDialog: FC<RoleFormDialogProps> = ({
  open,
  onOpenChange,
  role,
  onSubmit,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState('basic')
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
      setActiveTab('basic')
    } else {
      // Existing role - populate form with basic info
      reset({
        name: role.name,
        description: role.description ?? '',
        permissionNames: [],
      })
      setActiveTab('basic')
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
    reset()
    setSelectedPermissions([])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {role ? 'Editar Cargo' : 'Criar Novo Cargo'}
          </DialogTitle>
          <DialogDescription>
            {role
              ? 'Atualize as informações do cargo'
              : 'Preencha os dados para criar um novo cargo'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
              <TabsTrigger value="permissions">Permissões</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Cargo *</Label>
                <input
                  id="name"
                  type="text"
                  placeholder="Ex: Gerente de RH"
                  {...register('name')}
                  disabled={isLoading}
                  className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm"
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
                  className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  rows={3}
                />
                {errors.description && (
                  <span className="text-sm text-red-600">
                    {errors.description.message}
                  </span>
                )}
              </div>
            </TabsContent>

            {/* Permissions Tab */}
            <TabsContent value="permissions" className="space-y-4">
              <div>
                <Label className="mb-2 block">Selecione as Permissões (Opcional)</Label>
                {isLoadingPermissions && role ? (
                  <div className="rounded border border-gray-200 p-4">
                    <div className="flex items-center justify-center">
                      <div className="text-sm text-gray-500">Carregando permissões...</div>
                    </div>
                  </div>
                ) : (
                  <div className="max-h-[300px] overflow-y-auto rounded border border-gray-200 p-4">
                    <PermissionsSelector
                      value={selectedPermissions}
                      onChange={setSelectedPermissions}
                      isLoading={isLoading}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
