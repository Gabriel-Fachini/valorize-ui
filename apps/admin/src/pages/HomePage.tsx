import type { FC } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { DashboardOverview } from '@/components/dashboard/DashboardOverview'

/**
 * Home Page - Dashboard Executivo
 *
 * Página inicial do admin exibindo métricas e insights importantes
 * para RH e gestores tomarem decisões baseadas em dados.
 */
export const HomePage: FC = () => {
  return (
    <PageLayout maxWidth="full">
      <DashboardOverview />
    </PageLayout>
  )
}
