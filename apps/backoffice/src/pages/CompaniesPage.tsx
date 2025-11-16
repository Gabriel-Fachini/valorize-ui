import { useState } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/Skeleton'
import { CompanyFilters } from '@/components/companies/CompanyFilters'
import { CompanyStatusBadge } from '@/components/companies/CompanyStatusBadge'
import { CompanyPlanBadge } from '@/components/companies/CompanyPlanBadge'
import { StatCard } from '@/components/companies/StatCard'
import { CreateCompanyDialog } from '@/components/companies/create/CreateCompanyDialog'
import { useCompanies } from '@/hooks/useCompanies'
import type { CompanyFilters as FiltersType, PaginationParams, SortingParams } from '@/types/company'

export function CompaniesPage() {
  const [filters, setFilters] = useState<FiltersType>({})
  const [pagination, setPagination] = useState<PaginationParams>({ page: 1, limit: 20 })
  const [sorting, setSorting] = useState<SortingParams>({ sortBy: 'updatedAt', sortOrder: 'desc' })
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const { data, isLoading, error } = useCompanies(filters, pagination, sorting)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date))
  }

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage })
  }

  const handleSort = (column: SortingParams['sortBy']) => {
    setSorting((prev) => ({
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }))
  }

  return (
    <PageLayout
      title="Clientes"
      subtitle="Gerencie todas as empresas cadastradas na plataforma"
      action={
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <i className="ph ph-plus mr-2" style={{ fontSize: '1rem' }} />
          Novo Cliente
        </Button>
      }
    >
      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total MRR"
          value={formatCurrency(data?.aggregations?.totalMRR || 0)}
          description="Receita recorrente mensal"
          icon={<i className="ph ph-currency-circle-dollar" style={{ fontSize: '1rem' }} />}
          isLoading={isLoading}
        />
        <StatCard
          title="Empresas Ativas"
          value={data?.aggregations?.activeCompanies || 0}
          description="Clientes com acesso liberado"
          icon={<i className="ph ph-buildings" style={{ fontSize: '1rem' }} />}
          isLoading={isLoading}
        />
        <StatCard
          title="Empresas Inativas"
          value={data?.aggregations?.inactiveCompanies || 0}
          description="Clientes desativados"
          icon={<i className="ph ph-buildings" style={{ fontSize: '1rem' }} />}
          isLoading={isLoading}
        />
        <StatCard
          title="Total de Empresas"
          value={data?.pagination?.total || 0}
          description="Total de clientes cadastrados"
          icon={<i className="ph ph-chart-line" style={{ fontSize: '1rem' }} />}
          isLoading={isLoading}
        />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <CompanyFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      {/* Table */}
      <Card>
        {isLoading ? (
          <div className="p-6">
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="p-6">
            <EmptyState
              title="Erro ao carregar empresas"
              description="Ocorreu um erro ao buscar a lista de empresas. Tente novamente."
              action={
                <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
              }
            />
          </div>
        ) : !data?.data || data.data.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<i className="ph ph-buildings text-muted-foreground" style={{ fontSize: '5rem' }} />}
              title="Nenhuma empresa encontrada"
              description={
                filters.search || filters.status || filters.planType
                  ? 'Nenhuma empresa corresponde aos filtros selecionados.'
                  : 'Comece cadastrando sua primeira empresa.'
              }
              action={
                !filters.search && !filters.status && !filters.planType ? (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <i className="ph ph-plus mr-2" style={{ fontSize: '1rem' }} />
                    Cadastrar Empresa
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setFilters({})}>
                    Limpar Filtros
                  </Button>
                )
              }
            />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('name')}
                  >
                    Nome {sorting.sortBy === 'name' && (sorting.sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Domínio</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead className="text-right">Usuários</TableHead>
                  <TableHead
                    className="cursor-pointer text-right hover:text-foreground"
                    onClick={() => handleSort('mrr')}
                  >
                    MRR {sorting.sortBy === 'mrr' && (sorting.sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('createdAt')}
                  >
                    Criado em{' '}
                    {sorting.sortBy === 'createdAt' && (sorting.sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      {company.logoUrl ? (
                        <img
                          src={company.logoUrl}
                          alt={company.name}
                          className="h-8 w-8 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                          <i className="ph ph-buildings text-muted-foreground" style={{ fontSize: '1rem' }} />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell className="text-muted-foreground">{company.domain}</TableCell>
                    <TableCell>
                      <CompanyPlanBadge planType={company.planType} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col text-sm">
                        <span className="font-medium">{company.activeUsers}</span>
                        <span className="text-xs text-muted-foreground">
                          de {company.totalUsers}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(company.currentMRR)}
                    </TableCell>
                    <TableCell>
                      <CompanyStatusBadge status={company.isActive} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(company.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Navigate to company details
                          window.location.href = `/clients/${company.id}`
                        }}
                      >
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {data.pagination && data.pagination.totalPages > 1 && (
              <div className="border-t p-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(pagination.page - 1)}
                        className={
                          pagination.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>

                    {[...Array(data.pagination.totalPages)].map((_, i) => {
                      const page = i + 1
                      const isCurrentPage = page === pagination.page

                      // Show only a few pages around current page
                      if (
                        page === 1 ||
                        page === data.pagination.totalPages ||
                        (page >= pagination.page - 1 && page <= pagination.page + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={isCurrentPage}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      }

                      // Show ellipsis
                      if (page === pagination.page - 2 || page === pagination.page + 2) {
                        return <PaginationItem key={page}>...</PaginationItem>
                      }

                      return null
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(pagination.page + 1)}
                        className={
                          pagination.page === data.pagination.totalPages
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                <div className="mt-2 text-center text-sm text-muted-foreground">
                  Mostrando {(pagination.page - 1) * pagination.limit + 1} a{' '}
                  {Math.min(pagination.page * pagination.limit, data.pagination.total)} de{' '}
                  {data.pagination.total} empresas
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Create Company Dialog */}
      <CreateCompanyDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </PageLayout>
  )
}
