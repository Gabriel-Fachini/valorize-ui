import { type FC, useState, useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { PageLayout } from '@/components/layout/PageLayout'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/ui/data-table'
import { rolesTableConfig } from '@/config/tables/roles.table.config'
import { RoleFormDialog, RoleDeleteDialog } from '@/components/roles'
import { useRoles } from '@/hooks/useRoles'
import { useRoleMutations } from '@/hooks/useRoleMutations'
import { useDebounce } from '@/hooks/useDebounce'
import type { RoleWithCounts, RolesFilters, RolesQueryParams } from '@/types/roles'

export const RolesPage: FC = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [filters, setFilters] = useState<RolesFilters>({
    search: '',
  })

  // Debounce search
  const debouncedSearch = useDebounce(filters.search, 500)

  // Build query params
  const queryParams: RolesQueryParams = {
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
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
  }, [debouncedSearch])

  const handleCreateRole = async (data: { name: string; description?: string }) => {
    await createRole(data)
    setIsCreateDialogOpen(false)
  }

  const handleRowAction = useCallback(
    (actionId: string, row: RoleWithCounts) => {
      if (actionId === 'view') {
        navigate({ to: '/roles/$roleId', params: { roleId: row.id } })
      } else if (actionId === 'edit') {
        // Navigate to details page instead of opening edit modal
        navigate({ to: '/roles/$roleId', params: { roleId: row.id } })
      } else if (actionId === 'delete') {
        setSelectedRole(row)
        setIsDeleteDialogOpen(true)
      }
    },
    [navigate]
  )

  const handleBulkAction = useCallback(
    async (actionId: string, roleIds: string[]) => {
      if (actionId === 'export') {
        // Get full role data for export
        const selectedRoles = roles.filter((role) => roleIds.includes(role.id))
        const csvContent = [
          ['Nome', 'Descrição', 'Usuários', 'Permissões', 'Criado em'].join(','),
          ...selectedRoles.map((role) =>
            [
              role.name,
              role.description || '',
              role.usersCount,
              role.permissionsCount,
              new Date(role.createdAt).toLocaleDateString('pt-BR'),
            ].join(',')
          ),
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `roles-${Date.now()}.csv`)
        link.click()
        URL.revokeObjectURL(url)
      } else if (actionId === 'delete') {
        if (roleIds.length > 0) {
          const roleToDelete = roles.find((role) => role.id === roleIds[0])
          if (roleToDelete) {
            setSelectedRole(roleToDelete)
            setIsDeleteDialogOpen(true)
          }
        }
      }
    },
    [roles]
  )

  const handleUpdateRole = async (data: { name: string; description?: string }) => {
    if (!selectedRole) return
    await updateRole(selectedRole.id, data)
    setSelectedRole(undefined)
    setIsEditDialogOpen(false)
  }

  const handleDeleteRole = async () => {
    if (!selectedRole) return
    await deleteRole(selectedRole.id)
    setSelectedRole(undefined)
    setIsDeleteDialogOpen(false)
  }

  return (
    <PageLayout maxWidth="7xl">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Gerenciamento de Cargos"
          description="Crie e gerencie cargos e permissões aos usuários"
          icon="ph-lock"
          right={
            <Button
              onClick={() => {
                setSelectedRole(undefined)
                setIsCreateDialogOpen(true)
              }}
            >
              <i className="ph ph-plus mr-2" />
              Novo Cargo
            </Button>
          }
        />

        {/* Table */}
        <DataTable
          config={rolesTableConfig}
          data={roles}
          totalCount={totalCount}
          pageCount={pageCount}
          currentPage={currentPage}
          pageSize={pageSize}
          isLoading={isLoading}
          isFetching={isFetching}
          filters={filters as unknown as Record<string, unknown>}
          onFiltersChange={(newFilters) => setFilters(newFilters as unknown as RolesFilters)}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onRowAction={handleRowAction}
          onBulkAction={handleBulkAction}
          getRowId={(role) => role.id}
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
