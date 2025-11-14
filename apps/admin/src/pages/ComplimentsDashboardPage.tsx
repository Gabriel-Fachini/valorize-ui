/**
 * Compliments Dashboard Page
 * Main analytics dashboard for compliments metrics
 */

import { type FC, useState } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { PageHeader } from '@/components/layout/PageHeader'
import { useComplimentsDashboard } from '@/hooks/useComplimentsDashboard'
import type { ComplimentsDashboardFilters } from '@/types/compliments'
import {
  ComplimentsOverviewCards,
  ValuesDistributionChart,
  TopUsersSection,
  DepartmentAnalyticsChart,
  TemporalPatternsCharts,
  RecentActivityFeed,
  InsightsPanel,
} from '@/components/compliments/metrics'
import { ComplimentsFilters } from '@/components/compliments/ComplimentsFilters'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export const ComplimentsDashboardPage: FC = () => {
  const [filters, setFilters] = useState<ComplimentsDashboardFilters>({})

  // Fetch dashboard data
  const {
    overview,
    valuesDistribution,
    topUsers,
    departmentAnalytics,
    temporalPatterns,
    recentActivity,
    insights,
    isLoading,
  } = useComplimentsDashboard(filters)

  return (
    <PageLayout maxWidth='full'>
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Elogios</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title="Dashboard de Elogios"
        description="Análise completa de reconhecimentos e métricas de engajamento"
        icon="ph-chart-bar"
      />

      <div className="space-y-6">
        {/* Filters Section */}
        <ComplimentsFilters filters={filters} onFiltersChange={setFilters} />

        {/* Dashboard Content */}
        <div className="space-y-6">
          {/* Overview Cards */}
          <ComplimentsOverviewCards data={overview} isLoading={isLoading} />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Values Distribution */}
            <ValuesDistributionChart data={valuesDistribution} isLoading={isLoading} />

            {/* Top Users */}
            <TopUsersSection data={topUsers} isLoading={isLoading} />
          </div>

          {/* Department Analytics & Temporal Patterns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DepartmentAnalyticsChart data={departmentAnalytics} isLoading={isLoading} />
            <TemporalPatternsCharts data={temporalPatterns} isLoading={isLoading} />
          </div>

          {/* Recent Activity & Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivityFeed data={recentActivity} isLoading={isLoading} />
            <InsightsPanel data={insights} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
