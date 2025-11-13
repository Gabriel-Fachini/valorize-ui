/**
 * Redemptions Dashboard Page
 * Dashboard page for managing redemptions, vouchers, and prizes metrics
 */

import { type FC } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { PageHeader } from '@/components/layout/PageHeader'
import { useRedemptionMetrics } from '@/hooks/useRedemptionMetrics'
import { RedemptionMetricsGrid } from '@/components/redemptions/metrics/RedemptionMetricsGrid'
import { RedemptionStatusChart } from '@/components/redemptions/metrics/RedemptionStatusChart'
import { RedemptionTypeBreakdown } from '@/components/redemptions/metrics/RedemptionTypeBreakdown'
import { TopRedeemedPrizes } from '@/components/redemptions/metrics/TopRedeemedPrizes'
import { FinancialSummary } from '@/components/redemptions/metrics/FinancialSummary'

export const RedemptionsDashboardPage: FC = () => {
  const { metrics, isLoading: metricsLoading } = useRedemptionMetrics()

  return (
    <PageLayout maxWidth="7xl">
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          icon="ph-chart-bar"
          title="Dashboard"
          description="Visualize métricas e insights sobre prêmios, vouchers e resgates"
        />

        {/* Metrics Grid */}
        <RedemptionMetricsGrid
          metrics={metrics}
          isLoading={metricsLoading}
        />

        {/* Charts and Breakdown Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RedemptionStatusChart
            statusBreakdown={metrics?.statusBreakdown}
            isLoading={metricsLoading}
          />
          <RedemptionTypeBreakdown
            typeBreakdown={metrics?.typeBreakdown}
            isLoading={metricsLoading}
          />
        </div>

        {/* Bottom Row: Top Prizes and Financial Summary */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TopRedeemedPrizes
            topPrizes={metrics?.topPrizes}
            isLoading={metricsLoading}
          />
          <FinancialSummary
            financialImpact={metrics?.financialImpact}
            totalRedemptions={metrics?.volume.totalRedemptions}
            isLoading={metricsLoading}
          />
        </div>
      </div>
    </PageLayout>
  )
}
