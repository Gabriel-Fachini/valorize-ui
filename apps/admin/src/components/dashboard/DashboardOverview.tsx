import type { FC } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useDashboardData } from '@/hooks/useDashboard'
import { MetricsGrid } from './MetricsGrid'
import { ComplimentsChart } from './ComplimentsChart'
import { TopValuesRanking } from './TopValuesRanking'
import { AlertsSection } from './AlertsSection'

export const DashboardOverview: FC = () => {
  const { data, isLoading, error } = useDashboardData()

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-8 text-center">
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Executivo</h1>
          <p className="text-muted-foreground">
            Visão geral das métricas dos últimos 30 dias
          </p>
        </div>
        <ThemeToggle />
      </div>

      {/* Main Metrics Cards */}
      <MetricsGrid
        metrics={data?.metrics ?? {
          totalCompliments: 0,
          coinsMovement: 0,
          activeUsers: { count: 0, percentage: 0 },
          prizesRedeemed: 0,
          platformEngagement: 0,
        }}
        isLoading={isLoading}
      />

      {/* Charts and Rankings Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Compliments Evolution Chart */}
        <ComplimentsChart
          data={data?.complimentsByWeek ?? []}
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
    </div>
  )
}
