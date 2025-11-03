/**
 * Users Table Configuration - Usage Example
 * 
 * Este arquivo mostra como usar a configuração da tabela de usuários
 * com o componente DataTable
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { type FC, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PageLayout } from '@/components/layout/PageLayout'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/ui/data-table'
import { usersTableConfig } from '@/config/tables/users.table.config'
import { useUsers } from '@/hooks/useUsers'
import { useUserMutations } from '@/hooks/useUserMutations'
import { useUserBulkActions } from '@/hooks/useUserBulkActions'
import { useDebounce } from '@/hooks/useDebounce'
import { useDepartments, useJobTitles } from '@/hooks/useFilters'
import type { User, UserFilters, UsersQueryParams } from '@/types/users'

export const UsersPageWithDataTable: FC = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    status: 'all',
    departmentId: '',
    jobTitleId: '',
  })

  // Debounce search
  const debouncedSearch = useDebounce(filters.search, 500)

  // Build query params
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

  // Data hooks
  const { users, totalCount, pageCount, currentPage, isLoading, isFetching } = useUsers(queryParams)
  const { resetPassword } = useUserMutations()
  const { performBulkAction } = useUserBulkActions()

  // Dynamic filter options
  const { data: departments } = useDepartments()
  const { data: jobTitles } = useJobTitles()

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, filters.status, filters.departmentId, filters.jobTitleId])

  // Handler para ações por linha
  const handleRowAction = async (actionId: string, user: User) => {
    switch (actionId) {
      case 'view':
        // Navegação é tratada automaticamente pela coluna 'link'
        break
      case 'edit':
        // Abrir modal de edição
        console.log('Edit user:', user)
        break
      case 'resetPassword':
        await resetPassword(user.id)
        break
      case 'delete':
        // Abrir modal de confirmação
        console.log('Delete user:', user)
        break
    }
  }

  // Handler para ações em lote
  const handleBulkAction = async (actionId: string, userIds: string[]) => {
    await performBulkAction({
      userIds,
      action: actionId as 'activate' | 'deactivate' | 'export',
    })
  }

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
            <Button onClick={() => console.log('Create user')}>
              <i className="ph ph-plus mr-2" />
              Novo usuário
            </Button>
          }
        />

        {/* Tabela com configuração */}
        <DataTable
          config={usersTableConfig}
          data={users}
          isLoading={isLoading}
          isFetching={isFetching}
          totalCount={totalCount}
          pageCount={pageCount}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          filters={filters as any}
          onFiltersChange={setFilters as any}
          onRowAction={handleRowAction}
          onBulkAction={handleBulkAction}
          getRowId={(row) => row.id}
          dynamicFilterOptions={dynamicFilterOptions}
        />
      </div>
    </PageLayout>
  )
}
