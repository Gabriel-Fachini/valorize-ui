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
  SendWelcomeEmailDialog,
  BulkSendWelcomeEmailsDialog,
  BulkEmailResultsDialog,
} from '@/components/users'
import { toast } from 'sonner'
import type { BulkSendWelcomeEmailsResponse } from '@/types/users'
import { useUsers } from '@/hooks/useUsers'
import { useUserMutations } from '@/hooks/useUserMutations'
import { useUserBulkActions } from '@/hooks/useUserBulkActions'
import { useDebounce } from '@/hooks/useDebounce'
import { useDepartments, useJobTitles, useJobTitlesByDepartment } from '@/hooks/useFilters'
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
  const [isSendWelcomeEmailDialogOpen, setIsSendWelcomeEmailDialogOpen] = useState(false)
  const [isBulkSendEmailsDialogOpen, setIsBulkSendEmailsDialogOpen] = useState(false)
  const [isBulkEmailResultsDialogOpen, setIsBulkEmailResultsDialogOpen] = useState(false)
  const [passwordResetLink, setPasswordResetLink] = useState<string>('')
  const [selectedUser, setSelectedUser] = useState<User | undefined>()
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [bulkEmailResults, setBulkEmailResults] = useState<BulkSendWelcomeEmailsResponse | undefined>()

  // Build query params (using debounced search)
  // Note: Sorting is now done locally in the DataTable component
  const queryParams: UsersQueryParams = {
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
    status: filters.status !== 'all' ? filters.status : undefined,
    departmentId: filters.departmentId || undefined,
    jobTitleId: filters.jobTitleId || undefined,
  }

  const { users, totalCount, pageCount, currentPage, isLoading, isFetching } = useUsers(queryParams)
  const {
    createUser,
    updateUser,
    deleteUser,
    resetPassword,
    sendWelcomeEmail,
    bulkSendWelcomeEmails,
    isCreating,
    isUpdating,
    isDeleting,
    isSendingWelcomeEmail,
    isBulkSendingWelcomeEmails,
  } = useUserMutations()
  const { performBulkAction } = useUserBulkActions()

  // Dynamic filter options
  const { data: departments } = useDepartments()
  const { data: allJobTitles } = useJobTitles()
  const { data: filteredJobTitles } = useJobTitlesByDepartment(
    filters.departmentId && filters.departmentId !== 'all' ? filters.departmentId : undefined
  )
  
  // Use filtered job titles if department is selected, otherwise use all
  const jobTitles = filters.departmentId && filters.departmentId !== 'all' 
    ? filteredJobTitles 
    : allJobTitles

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, filters.status, filters.departmentId, filters.jobTitleId])

  // Clear jobTitle filter when department changes if the selected jobTitle is not in the filtered list
  useEffect(() => {
    if (filters.departmentId && filters.jobTitleId && filteredJobTitles) {
      const isJobTitleAvailable = filteredJobTitles.some(jt => jt.id === filters.jobTitleId)
      if (!isJobTitleAvailable) {
        setFilters(prev => ({ ...prev, jobTitleId: '' }))
      }
    }
  }, [filters.departmentId, filters.jobTitleId, filteredJobTitles])

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

  const handleSendWelcomeEmailClick = useCallback((user: User) => {
    setSelectedUser(user)
    setIsSendWelcomeEmailDialogOpen(true)
  }, [])

  const handleSendWelcomeEmail = useCallback(async () => {
    if (!selectedUser) return
    try {
      const response = await sendWelcomeEmail({
        userId: selectedUser.id,
        requestedBy: 'admin', // TODO: Replace with actual current user ID from auth context
      })
      toast.success(response.message || 'Email de boas-vindas enviado com sucesso!', {
        description: `Email enviado para ${selectedUser.name}`,
      })
      setSelectedUser(undefined)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao enviar email'
      toast.error('Falha ao enviar email', {
        description: message,
      })
      throw error // Re-throw to keep dialog open on error
    }
  }, [selectedUser, sendWelcomeEmail])

  const handleBulkAction = async (actionId: string, userIds: string[]) => {
    if (actionId === 'sendWelcomeEmails') {
      setSelectedUserIds(userIds)
      setIsBulkSendEmailsDialogOpen(true)
    } else {
      await performBulkAction({ userIds, action: actionId as 'activate' | 'deactivate' | 'export' })
    }
  }

  const handleBulkSendWelcomeEmails = useCallback(async () => {
    try {
      const response = await bulkSendWelcomeEmails({
        userIds: selectedUserIds,
        requestedBy: 'admin', // TODO: Replace with actual current user ID from auth context
      })

      setBulkEmailResults(response)
      setIsBulkSendEmailsDialogOpen(false)
      setIsBulkEmailResultsDialogOpen(true)

      // Show summary toast
      const { summary } = response
      if (summary.failed === 0) {
        toast.success('Todos os emails foram enviados!', {
          description: `${summary.sent} email${summary.sent !== 1 ? 's' : ''} enviado${summary.sent !== 1 ? 's' : ''} com sucesso`,
        })
      } else {
        toast.warning('Envio parcialmente concluído', {
          description: `${summary.sent} enviados, ${summary.failed} falharam`,
        })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao enviar emails'
      toast.error('Falha no envio em lote', {
        description: message,
      })
      throw error // Re-throw to keep dialog open on error
    }
  }, [selectedUserIds, bulkSendWelcomeEmails])

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
        case 'sendWelcomeEmail':
          handleSendWelcomeEmailClick(user)
          break
        case 'resetPassword':
          await handleResetPassword(user)
          break
        case 'delete':
          handleDeleteClick(user)
          break
      }
    },
    [handleEdit, handleSendWelcomeEmailClick, handleResetPassword, handleDeleteClick],
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
          sortState={{ columnId: 'name', order: 'asc' }}
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
        <SendWelcomeEmailDialog
          open={isSendWelcomeEmailDialogOpen}
          onOpenChange={setIsSendWelcomeEmailDialogOpen}
          user={selectedUser}
          onConfirm={handleSendWelcomeEmail}
          isSending={isSendingWelcomeEmail}
        />
        <BulkSendWelcomeEmailsDialog
          open={isBulkSendEmailsDialogOpen}
          onOpenChange={setIsBulkSendEmailsDialogOpen}
          users={users.filter((u) => selectedUserIds.includes(u.id))}
          onConfirm={handleBulkSendWelcomeEmails}
          isSending={isBulkSendingWelcomeEmails}
        />
        <BulkEmailResultsDialog
          open={isBulkEmailResultsDialogOpen}
          onOpenChange={setIsBulkEmailResultsDialogOpen}
          results={bulkEmailResults}
        />
      </div>
    </PageLayout>
  )
}
