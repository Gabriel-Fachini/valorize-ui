import type { FC } from 'react'
import { MetricCard } from './MetricCard'
import type { DashboardMetrics } from '../../types/dashboard'

interface MetricsGridProps {
  metrics: DashboardMetrics
  isLoading?: boolean
}

export const MetricsGrid: FC<MetricsGridProps> = ({ metrics, isLoading = false }) => {
  // Phosphor icons (using web component style)
  const HeartIcon = () => (
    <i className="ph ph-heart text-2xl" />
  )

  const CoinsIcon = () => (
    <i className="ph ph-coins text-2xl" />
  )

  const UsersIcon = () => (
    <i className="ph ph-users text-2xl" />
  )

  const GiftIcon = () => (
    <i className="ph ph-gift text-2xl" />
  )

  const ChartLineIcon = () => (
    <i className="ph ph-chart-line-up text-2xl" />
  )

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <MetricCard
        title="Elogios Enviados"
        value={formatNumber(metrics.totalCompliments)}
        subtitle="Últimos 30 dias"
        icon={<HeartIcon />}
        isLoading={isLoading}
      />

      <MetricCard
        title="Moedas Movimentadas"
        value={formatNumber(metrics.coinsMovement)}
        subtitle="Últimos 30 dias"
        icon={<CoinsIcon />}
        isLoading={isLoading}
      />

      <MetricCard
        title="Usuários Ativos"
        value={formatNumber(metrics.activeUsers.count)}
        subtitle={`${metrics.activeUsers.percentage.toFixed(1)}% do total`}
        icon={<UsersIcon />}
        isLoading={isLoading}
      />

      <MetricCard
        title="Prêmios Resgatados"
        value={formatNumber(metrics.prizesRedeemed)}
        subtitle="Últimos 30 dias"
        icon={<GiftIcon />}
        isLoading={isLoading}
      />

      <MetricCard
        title="Engajamento"
        value={`${metrics.platformEngagement.toFixed(1)}%`}
        subtitle="Taxa de participação"
        icon={<ChartLineIcon />}
        isLoading={isLoading}
      />
    </div>
  )
}
