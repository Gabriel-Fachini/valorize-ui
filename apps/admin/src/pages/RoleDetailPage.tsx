import { type FC, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import {
  RoleDetailCard,
  PermissionsManager,
  RoleFormDialog,
  RoleDeleteDialog,
  RoleUsersSection,
} from '@/components/roles'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useRoleDetail } from '@/hooks/useRoleDetail'
import { useRoleMutations } from '@/hooks/useRoleMutations'
import { useRolePermissions } from '@/hooks/useRolePermissions'
import { useRoleUsers } from '@/hooks/useRoleUsers'
import { useUserPermissions } from '@/hooks/useUserPermissions'
import { hasPermission } from '@/lib/permissions'
import type { RoleWithCounts } from '@/types/roles'

export const RoleDetailPage: FC = () => {
  const navigate = useNavigate()
  const params = useParams({ strict: false })
  const roleId = (params as { roleId: string }).roleId

  const { role, isLoading: isLoadingRole } = useRoleDetail(roleId)
  const { isSettingPermissions, setPermissions } = useRolePermissions(roleId)
  const { updateRole, deleteRole, isUpdating, isDeleting } = useRoleMutations()
  const { users: roleUsers, isLoading: isLoadingUsers, isRemoving, removeUser } = useRoleUsers(roleId)
  const { permissions: userPermissions } = useUserPermissions()

  const canEditRole = hasPermission(userPermissions || [], 'ROLES_UPDATE')
  const canDeleteRole = hasPermission(userPermissions || [], 'ROLES_DELETE')
  const canManagePermissions = hasPermission(userPermissions || [], 'ROLES_MANAGE_PERMISSIONS')

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleRemoveUser = async (userId: string) => {
    removeUser(userId)
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
          <p className="text-red-700">Role não encontrado</p>
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/roles' })}
            className="mt-4"
          >
            Voltar para Roles
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {role.name}
            </h1>
            <p className="text-gray-600">
              Gerencie as informações e permissões deste role
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(true)}
              disabled={isUpdating || !canEditRole}
              title={!canEditRole ? 'Você não tem permissão para editar roles' : undefined}
            >
              Editar
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={isDeleting || !canDeleteRole || Boolean(role?.usersCount && role.usersCount > 0)}
                  >
                    Deletar
                  </Button>
                </TooltipTrigger>
                {role?.usersCount && role.usersCount > 0 && (
                  <TooltipContent side="bottom">
                    <div className="space-y-2">
                      <p>Este role possui {role.usersCount} usuário{role.usersCount !== 1 ? 's' : ''}</p>
                      <p>Remova todos os usuários antes de deletar</p>
                    </div>
                  </TooltipContent>
                )}
                {!canDeleteRole && (
                  <TooltipContent side="bottom">
                    <p>Você não tem permissão para deletar roles</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/roles' })}
            >
              Voltar
            </Button>
          </div>
        </div>

        {/* Role Detail Card */}
        <RoleDetailCard role={role} />

        {/* Permissions Manager */}
        <PermissionsManager
          currentPermissions={role.permissions || []}
          onSave={async (perms) => {
            await setPermissions(perms)
          }}
          isLoading={isSettingPermissions}
          disabled={!canManagePermissions}
        />

        {/* Users Section */}
        <RoleUsersSection
          users={roleUsers}
          isLoading={isLoadingUsers}
          onRemoveUser={handleRemoveUser}
          isRemoving={isRemoving}
          disabled={!hasPermission(userPermissions || [], 'USERS_MANAGE_ROLES')}
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
