import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useCompanyMetrics } from '@/hooks/useCompanies'
import { MetricsOverviewCards } from './MetricsOverviewCards'
import { UsersMetricsCard } from './UsersMetricsCard'
import { ComplimentsBreakdown } from './ComplimentsBreakdown'
import { RedemptionsBreakdown } from './RedemptionsBreakdown'
import { ValuesMetricsCard } from './ValuesMetricsCard'
import { MetricsPeriodFilter } from './MetricsPeriodFilter'
import type { MetricsQueryParams } from '@/types/company'

interface MetricsTabProps {
  companyId: string
}

export function MetricsTab({ companyId }: MetricsTabProps) {
  const [filters, setFilters] = useState<MetricsQueryParams | undefined>(undefined)
  const { data: metrics, isLoading, error, refetch } = useCompanyMetrics(companyId, filters)

  const handleFilterChange = (newFilters: MetricsQueryParams | undefined) => {
    setFilters(newFilters)
  }

  const handleRefresh = () => {
    refetch()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (error || !metrics) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <i className="ph ph-chart-line text-6xl text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-bold">Erro ao carregar métricas</h2>
        <p className="mt-2 text-muted-foreground">
          Não foi possível carregar as métricas desta empresa.
        </p>
        <Button onClick={handleRefresh} className="mt-6">
          <i className="ph ph-arrows-clockwise mr-2" style={{ fontSize: '1rem' }} />
          Tentar Novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters and Refresh */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Métricas e Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Acompanhe o desempenho e engajamento da empresa
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <i className="ph ph-arrows-clockwise mr-2" style={{ fontSize: '0.875rem' }} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Period Filter */}
      <MetricsPeriodFilter onFilterChange={handleFilterChange} currentFilters={filters} />

      {/* Overview Cards */}
      <MetricsOverviewCards metrics={metrics} />

      {/* Detailed Breakdowns */}
      <div className="grid gap-6 md:grid-cols-2">
        <UsersMetricsCard users={metrics.users} />
        <ValuesMetricsCard values={metrics.values} />
      </div>

      <ComplimentsBreakdown compliments={metrics.compliments} />

      <RedemptionsBreakdown redemptions={metrics.redemptions} />
    </div>
  )
}
