import type { FC } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { NetworkVisualization } from '@/components/compliments/network'

/**
 * Compliments Analytics Page
 *
 * Página de analytics dedicada aos elogios da plataforma
 * @deprecated Use ComplimentsDashboardPage instead (with tabs for Dashboard and Network)
 */
export const ComplimentsAnalyticsPage: FC = () => {
  return (
    <PageLayout maxWidth="7xl">
      <NetworkVisualization />
    </PageLayout>
  )
}
