import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { StatCard } from '@/components/companies/StatCard'
import { useCompanies } from '@/hooks/useCompanies'
import { companiesTableConfig } from '@/config/tables'
import type { CompanyListItem, CompanyStatus, PlanType } from '@/types/company'

interface CompanyFiltersState extends Record<string, unknown> {
  search: string
  status: string
  planType: string
}

export function CompaniesPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [filters, setFilters] = useState<CompanyFiltersState>({
    search: '',
    status: 'all',
    planType: 'all',
  })

  // Prepare query params
  const queryFilters = {
    search: filters.search || undefined,
    status: filters.status !== 'all' ? (filters.status as CompanyStatus) : undefined,
    planType: filters.planType !== 'all' ? (filters.planType as PlanType) : undefined,
  }

  const { data, isLoading, isFetching } = useCompanies(
    queryFilters,
    { page, limit: pageSize },
    { sortBy: 'updatedAt', sortOrder: 'desc' }
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const handleRowAction = (actionId: string, company: CompanyListItem) => {
    switch (actionId) {
      case 'view':
        navigate({ to: `/clients/${company.id}` })
        break
      case 'edit':
        // TODO: Implement edit modal or page
        console.log('Edit company:', company.id)
        break
      case 'toggle-status':
        // TODO: Implement status toggle
        console.log('Toggle status for company:', company.id)
        break
    }
  }

  return (
    <PageLayout
      title="Clientes"
      subtitle="Gerencie todas as empresas cadastradas na plataforma"
      action={
        <Button onClick={() => navigate({ to: '/clients/new' })}>
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

      {/* Table with DataTable */}
      <DataTable<CompanyListItem>
        config={companiesTableConfig}
        data={data?.data || []}
        isLoading={isLoading && !data}
        isFetching={isFetching}
        totalCount={data?.pagination?.total || 0}
        pageCount={data?.pagination?.totalPages || 1}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        sortState={{ columnId: 'name', order: 'asc' }}
        filters={filters}
        onFiltersChange={(newFilters) => {
          setFilters(newFilters as CompanyFiltersState)
          setPage(1) // Reset to first page when filters change
        }}
        onRowAction={handleRowAction}
        getRowId={(row) => row.id}
      />
    </PageLayout>
  )
}
