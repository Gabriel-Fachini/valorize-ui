import { type FC, useState, useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import {
  RolesTable,
  RoleTableToolbar,
  RoleFormDialog,
  RoleDeleteDialog,
} from '@/components/roles'
import { useRoles } from '@/hooks/useRoles'
import { useRoleMutations } from '@/hooks/useRoleMutations'
import { useUserPermissions } from '@/hooks/useUserPermissions'
import { useDebounce } from '@/hooks/useDebounce'
import { hasPermission } from '@/lib/permissions'
import type { RoleWithCounts, RolesFilters, RolesQueryParams } from '@/types/roles'

export const RolesPage: FC = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [filters, setFilters] = useState<RolesFilters>({
    search: '',
  })

  // Get user permissions
  const { permissions } = useUserPermissions()
  const canCreateRole = hasPermission(permissions || [], 'ROLES_CREATE')

  // Debounce search
  const debouncedSearch = useDebounce(filters.search, 500)

  // Build query params
  const queryParams: RolesQueryParams = {
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  }

  const { roles, totalCount, pageCount, currentPage, isLoading, isFetching } = useRoles(queryParams)
  const { createRole, updateRole, deleteRole, isCreating, isUpdating, isDeleting } =
    useRoleMutations()

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<RoleWithCounts | undefined>()

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, filters.sortBy, filters.sortOrder])

  const handleCreateRole = async (data: { name: string; description?: string }) => {
    await createRole(data)
    setIsCreateDialogOpen(false)
  }

  const handleEditRole = useCallback((role: RoleWithCounts) => {
    setSelectedRole(role)
    setIsEditDialogOpen(true)
  }, [])

  const handleUpdateRole = async (data: { name: string; description?: string }) => {
    if (!selectedRole) return
    await updateRole(selectedRole.id, data)
    setSelectedRole(undefined)
    setIsEditDialogOpen(false)
  }

  const handleDeleteClick = useCallback((role: RoleWithCounts) => {
    setSelectedRole(role)
    setIsDeleteDialogOpen(true)
  }, [])

  const handleDeleteRole = async () => {
    if (!selectedRole) return
    await deleteRole(selectedRole.id)
    setSelectedRole(undefined)
    setIsDeleteDialogOpen(false)
  }

  const handleViewDetails = useCallback((role: RoleWithCounts) => {
    navigate({ to: '/roles/$roleId', params: { roleId: role.id } })
  }, [navigate])

  return (
    <PageLayout maxWidth="7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Gerenciamento de Roles
            </h1>
            <p className="text-gray-600">
              Crie e gerencie roles e atribua permissões aos usuários
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <RoleTableToolbar
          filters={filters}
          onFiltersChange={setFilters}
          onCreateRole={() => {
            setSelectedRole(undefined)
            setIsCreateDialogOpen(true)
          }}
          isLoading={isLoading}
          canCreateRole={canCreateRole}
        />

        {/* Table */}
        <RolesTable
          roles={roles}
          isLoading={isLoading}
          isFetching={isFetching}
          totalCount={totalCount}
          pageCount={pageCount}
          currentPage={currentPage}
          filters={filters}
          onFiltersChange={setFilters}
          onPageChange={setPage}
          pageSize={pageSize}
          onEdit={handleEditRole}
          onDelete={handleDeleteClick}
          onViewDetails={handleViewDetails}
          userPermissions={permissions}
        />

        {/* Dialogs */}
        <RoleFormDialog
          open={isCreateDialogOpen || isEditDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateDialogOpen(false)
              setIsEditDialogOpen(false)
              setSelectedRole(undefined)
            }
          }}
          role={selectedRole}
          onSubmit={selectedRole ? handleUpdateRole : handleCreateRole}
          isLoading={isCreating || isUpdating}
        />

        <RoleDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          role={selectedRole}
          onConfirm={handleDeleteRole}
          isLoading={isDeleting}
        />
      </div>
    </PageLayout>
  )
}
