import { type FC, useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import {
  RoleDetailCard,
  PermissionsDisplay,
  RoleFormDialog,
  RoleDeleteDialog,
  RoleUsersSection,
} from '@/components/roles'
import { Button } from '@/components/ui/button'
import { useRoleDetail } from '@/hooks/useRoleDetail'
import { useRoleMutations } from '@/hooks/useRoleMutations'
import { useRolePermissions } from '@/hooks/useRolePermissions'
import userRolesService from '@/services/userRoles'
import { toast } from '@/lib/toast'
import type { RoleWithCounts } from '@/types/roles'

export const RoleDetailPage: FC = () => {
  const navigate = useNavigate()
  const params = useParams({ strict: false })
  const queryClient = useQueryClient()
  const roleId = String(params?.roleId || '')

  const { role, isLoading: isLoadingRole } = useRoleDetail(roleId)
  const { permissions: rolePermissions, isLoading: isLoadingRolePermissions } = useRolePermissions(roleId)
  const { updateRole, deleteRole, isUpdating, isDeleting } = useRoleMutations()

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  // Editing mode state
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [editedDescription, setEditedDescription] = useState('')

  // Mutation for removing user from role
  const removeUserMutation = useMutation({
    mutationFn: (userId: string) => userRolesService.removeRoleFromUser(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles', roleId] })
      toast.success('Usuário removido do cargo com sucesso')
    },
    onError: () => {
      toast.error('Erro ao remover usuário do cargo')
    },
  })

  const handleRemoveUser = async (userId: string) => {
    removeUserMutation.mutate(userId)
  }
  
  // Initialize editing values when role is loaded
  useEffect(() => {
    if (role && !isEditing) {
      setEditedName(role.name)
      setEditedDescription(role.description || '')
    }
  }, [role, isEditing])
  
  const handleToggleEdit = () => {
    if (isEditing) {
      // Cancel editing - reset values
      setEditedName(role?.name || '')
      setEditedDescription(role?.description || '')
    }
    setIsEditing(!isEditing)
  }
  
  const handleSaveEdit = async () => {
    if (!role) return
    
    try {
      await updateRole(roleId, {
        name: editedName,
        description: editedDescription || undefined,
      })
      setIsEditing(false)
    } catch {
      // Error is handled in the mutation hook
    }
  }

  if (isLoadingRole) {
    return (
      <PageLayout maxWidth="5xl">
        <div className="space-y-6">
          <div className="h-12 animate-pulse rounded bg-gray-200" />
          <div className="h-64 animate-pulse rounded bg-gray-200" />
        </div>
      </PageLayout>
    )
  }

  if (!role) {
    return (
      <PageLayout maxWidth="5xl">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <p className="text-red-700">Cargo não encontrado</p>
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/roles' })}
            className="mt-4"
          >
            Voltar para Cargos
          </Button>
        </div>
      </PageLayout>
    )
  }

  const handleUpdateRole = async (data: { name: string; description?: string }) => {
    await updateRole(roleId, data)
    setIsEditDialogOpen(false)
  }

  const handleDeleteRole = async () => {
    await deleteRole(roleId)
    navigate({ to: '/roles' })
  }

  const roleWithCounts: RoleWithCounts = {
    id: role.id,
    name: role.name,
    description: role.description,
    companyId: role.companyId,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
    usersCount: role.usersCount,
    permissionsCount: role.permissionsCount,
  }

  return (
    <PageLayout maxWidth="5xl">
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/roles' })}
            className="gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <i className="ph ph-arrow-left" />
            Voltar
          </Button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {role.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie as informações e permissões deste cargo
            </p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleToggleEdit}
                  disabled={isUpdating}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={isUpdating || !editedName.trim()}
                >
                  {isUpdating ? (
                    <>
                      <i className="ph ph-circle-notch animate-spin mr-2" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <i className="ph ph-check mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleToggleEdit}
                >
                  <i className="ph ph-pencil mr-2" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={isDeleting}
                >
                  Deletar
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Role Detail Card */}
        <RoleDetailCard
          role={role}
          isEditing={isEditing}
          editedName={editedName}
          editedDescription={editedDescription}
          onNameChange={setEditedName}
          onDescriptionChange={setEditedDescription}
        />

        {/* Permissions Display */}
        <PermissionsDisplay
          roleId={roleId}
          currentPermissions={
            Array.isArray(rolePermissions)
              ? rolePermissions
                  .flatMap((category) => category.permissions?.map((p) => p.name) ?? [])
                  .filter((name: string | undefined): name is string => !!name)
              : []
          }
          categories={Array.isArray(rolePermissions) ? rolePermissions : undefined}
          isLoading={isLoadingRolePermissions}
          editable={true}
        />

        {/* Users Section */}
        <RoleUsersSection
          users={role.users || []}
          isLoading={false}
          onRemoveUser={handleRemoveUser}
          onAddUser={async (userId) => {
            await userRolesService.assignRoleToUser(userId, roleId)
            queryClient.invalidateQueries({ queryKey: ['role', roleId] })
            toast.success('Usuário adicionado ao cargo com sucesso')
          }}
          isRemoving={removeUserMutation.isPending}
        />

        {/* Dialogs */}
        <RoleFormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          role={roleWithCounts}
          onSubmit={handleUpdateRole}
          isLoading={isUpdating}
        />

        <RoleDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          role={roleWithCounts}
          onConfirm={handleDeleteRole}
          isLoading={isDeleting}
        />
      </div>
    </PageLayout>
  )
}
