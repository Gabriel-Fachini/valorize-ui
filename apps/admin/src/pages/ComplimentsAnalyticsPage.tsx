import type { FC } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import NetworkVisualization from '@/components/network/NetworkVisualization'

/**
 * Compliments Analytics Page
 *
 * Página de analytics dedicada aos elogios da plataforma
 */
export const ComplimentsAnalyticsPage: FC = () => {
  return (
    <PageLayout maxWidth="full">
      <NetworkVisualization />
    </PageLayout>
  )
}
