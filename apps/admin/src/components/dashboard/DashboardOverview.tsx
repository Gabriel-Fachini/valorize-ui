import type { FC } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { useDashboardData } from '@/hooks/useDashboard'
import { MetricsGrid } from './MetricsGrid'
import { ComplimentsChart } from './ComplimentsChart'
import { TopValuesRanking } from './TopValuesRanking'
import { AlertsSection } from './AlertsSection'
import { Filters } from './Filters'
import { useState } from 'react'
import type { DashboardFilters } from '@/types/dashboard'
import { animated } from '@react-spring/web'
import { usePageEntrance, usePageHeaderEntrance } from '@valorize/shared/hooks'

export const DashboardOverview: FC = () => {
  const [filters, setFilters] = useState<DashboardFilters>({})
  const { data, isLoading, error } = useDashboardData(filters)

  const pageAnimation = usePageEntrance()
  const headerAnimation = usePageHeaderEntrance()

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border bg-card p-8 text-center">
          <i className="ph ph-warning-circle text-4xl text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Erro ao carregar dados</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <animated.div style={pageAnimation as any} className="space-y-6">
      {/* Header */}
      <animated.div style={headerAnimation as any}>
        <PageHeader
          title="Dashboard Executivo"
          description="Visão geral das métricas dos últimos 30 dias"
          icon='ph-house'
        />
      </animated.div>

      {/* Filters */}
      <Filters filters={filters} onFiltersChange={setFilters} />

      {/* Main Metrics Cards */}
      <MetricsGrid
        metrics={data?.metrics ?? {
          totalCompliments: 0,
          coinsDistributed: 0,
          activeUsers: { count: 0, percentage: 0 },
          prizesRedeemed: 0,
          engagementRate: 0,
        }}
        isLoading={isLoading}
      />

      {/* Charts and Rankings Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Compliments Evolution Chart */}
        <ComplimentsChart
          data={data?.weeklyCompliments ?? []}
          isLoading={isLoading}
        />

        {/* Top Values Ranking */}
        <TopValuesRanking
          values={data?.topValues ?? []}
          isLoading={isLoading}
        />
      </div>

      {/* Alerts Section */}
      <AlertsSection alerts={[]} isLoading={isLoading} />
    </animated.div>
  )
}
