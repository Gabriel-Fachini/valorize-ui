import { type FC, useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { PageLayout } from '@/components/layout/PageLayout'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/ui/data-table'
import { usersTableConfig } from '@/config/tables/users.table.config'
import {
  UserFormDialog,
  UserDeleteDialog,
  UserImportCSVDialog,
  PasswordResetConfirmModal,
  PasswordResetModal,
} from '@/components/users'
import { useUsers } from '@/hooks/useUsers'
import { useUserMutations } from '@/hooks/useUserMutations'
import { useUserBulkActions } from '@/hooks/useUserBulkActions'
import { useDebounce } from '@/hooks/useDebounce'
import { useDepartments, useJobTitles } from '@/hooks/useFilters'
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
  const [isPasswordResetConfirmOpen, setIsPasswordResetConfirmOpen] = useState(false)
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false)
  const [passwordResetLink, setPasswordResetLink] = useState<string>('')
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
  const { createUser, updateUser, deleteUser, resetPassword, isCreating, isUpdating, isDeleting } =
    useUserMutations()
  const { performBulkAction } = useUserBulkActions()

  // Dynamic filter options
  const { data: departments } = useDepartments()
  const { data: jobTitles } = useJobTitles()

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

  const handleResetPassword = useCallback(async (user: User) => {
    setSelectedUser(user)
    setIsPasswordResetConfirmOpen(true)
  }, [])

  const handleConfirmResetPassword = useCallback(async () => {
    if (!selectedUser) return
    try {
      console.log(`Resetting password for user: ${selectedUser.id}`)
      const response = await resetPassword(selectedUser.id)
      console.log('Password reset response:', response)
      setPasswordResetLink(response.ticketUrl)
      setIsPasswordResetConfirmOpen(false)
      setIsPasswordResetModalOpen(true)
    } catch (error) {
      console.error('Erro ao gerar link de reset de senha:', error)
      setIsPasswordResetConfirmOpen(false)
      alert(`Erro ao gerar link de reset: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }, [selectedUser, resetPassword])

  const handleBulkAction = async (actionId: string, userIds: string[]) => {
    await performBulkAction({ userIds, action: actionId as 'activate' | 'deactivate' | 'export' })
  }

  // Handler para ações por linha
  const handleRowAction = useCallback(
    async (actionId: string, user: User) => {
      switch (actionId) {
        case 'view':
          // Navegação é tratada automaticamente pela coluna 'link'
          break
        case 'edit':
          handleEdit(user)
          break
        case 'resetPassword':
          await handleResetPassword(user)
          break
        case 'delete':
          handleDeleteClick(user)
          break
      }
    },
    [handleEdit, handleResetPassword, handleDeleteClick],
  )

  // Preparar options dinâmicos para filtros
  const dynamicFilterOptions = {
    departmentId: [
      { value: 'all', label: 'Todos departamentos' },
      ...(departments?.map((dept) => ({
        value: dept.id,
        label: dept.name,
      })) || []),
    ],
    jobTitleId: [
      { value: 'all', label: 'Todos os cargos' },
      ...(jobTitles?.map((job) => ({
        value: job.id,
        label: job.name,
      })) || []),
    ],
  }

  return (
    <PageLayout maxWidth="7xl">
      <div className="space-y-6">
        {/* Header com ícone */}
        <PageHeader
          title="Gerenciamento de Usuários"
          description="Visualize e gerencie todos os usuários da plataforma"
          icon="ph-users"
          right={
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <i className="ph ph-plus mr-2" />
              Novo usuário
            </Button>
          }
        />

        {/* Tabela com DataTable e configuração */}
        <DataTable
          config={{
            ...usersTableConfig,
            actions: {
              ...usersTableConfig.actions,
              toolbar: (
                <Button onClick={() => setIsImportDialogOpen(true)}>
                  <i className="ph ph-upload-simple mr-2" />
                  Importar CSV
                </Button>
              ),
            },
          }}
          data={users}
          isLoading={isLoading}
          isFetching={isFetching}
          totalCount={totalCount}
          pageCount={pageCount}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          filters={filters}
          onFiltersChange={(newFilters) => setFilters(newFilters as UserFilters)}
          onRowAction={handleRowAction}
          onBulkAction={handleBulkAction}
          getRowId={(row) => row.id}
          dynamicFilterOptions={dynamicFilterOptions}
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
        <PasswordResetConfirmModal
          open={isPasswordResetConfirmOpen}
          onOpenChange={setIsPasswordResetConfirmOpen}
          user={selectedUser}
          onConfirm={handleConfirmResetPassword}
          isLoading={false}
        />
        <PasswordResetModal
          open={isPasswordResetModalOpen}
          onOpenChange={setIsPasswordResetModalOpen}
          ticketUrl={passwordResetLink}
          expiresIn="24 horas"
        />
      </div>
    </PageLayout>
  )
}
