import { type FC, useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { PageLayout } from '@/components/layout/PageLayout'
import {
  UsersTable,
  UserFormDialog,
  UserDeleteDialog,
  UserImportCSVDialog,
} from '@/components/users'
import { useUsers } from '@/hooks/useUsers'
import { useUserMutations } from '@/hooks/useUserMutations'
import { useUserBulkActions } from '@/hooks/useUserBulkActions'
import { useDebounce } from '@/hooks/useDebounce'
import type { User, UserFormData, UserFilters, UsersQueryParams } from '@/types/users'

export const UsersPage: FC = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    status: 'all',
    departmentId: '',
    jobTitleId: '',
  })

  // Debounce search to prevent excessive API calls
  const debouncedSearch = useDebounce(filters.search, 500)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | undefined>()

  // Build query params (using debounced search)
  const queryParams: UsersQueryParams = {
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
    status: filters.status !== 'all' ? filters.status : undefined,
    departmentId: filters.departmentId || undefined,
    jobTitleId: filters.jobTitleId || undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  }

  const { users, totalCount, pageCount, currentPage, isLoading, isFetching } = useUsers(queryParams)
  const { createUser, updateUser, deleteUser, isCreating, isUpdating, isDeleting } =
    useUserMutations()
  const { performBulkAction } = useUserBulkActions()

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, filters.status, filters.departmentId, filters.jobTitleId])

  const handleCreate = async (data: UserFormData) => {
    await createUser(data)
  }

  const handleEdit = useCallback((user: User) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }, [])

  const handleUpdate = async (data: UserFormData) => {
    if (!selectedUser) return
    await updateUser({ userId: selectedUser.id, data })
    setSelectedUser(undefined)
  }

  const handleDeleteClick = useCallback((user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }, [])

  const handleDelete = async () => {
    if (!selectedUser) return
    await deleteUser(selectedUser.id)
    setSelectedUser(undefined)
  }

  const handleBulkAction = async (userIds: string[], action: string) => {
    await performBulkAction({ userIds, action: action as any })
  }

  return (
    <PageLayout maxWidth="7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <i className="ph ph-users text-primary" />
              Gerenciamento de Usuários
            </h1>
            <p className="text-muted-foreground">
              Visualize e gerencie todos os usuários da plataforma
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <i className="ph ph-plus mr-2" />
            Novo usuário
          </Button>
        </div>

        {/* Table */}
        <UsersTable
          users={users}
          isLoading={isLoading}
          isFetching={isFetching}
          totalCount={totalCount}
          pageCount={pageCount}
          currentPage={currentPage}
          filters={filters}
          onFiltersChange={setFilters}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          pageSize={pageSize}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onBulkAction={handleBulkAction}
          onImportCSV={() => setIsImportDialogOpen(true)}
        />

        {/* Dialogs */}
        <UserFormDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreate}
          isSubmitting={isCreating}
        />
        <UserFormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          user={selectedUser}
          onSubmit={handleUpdate}
          isSubmitting={isUpdating}
        />
        <UserDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          user={selectedUser}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
        <UserImportCSVDialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen} />
      </div>
    </PageLayout>
  )
}
