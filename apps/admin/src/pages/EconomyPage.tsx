/**
 * Economy Page
 * Page wrapper for economy dashboard
 */

import type { FC } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { EconomyDashboard } from '@/components/economy'

/**
 * EconomyPage - Economy dashboard page wrapper
 *
 * Wraps EconomyDashboard component with PageLayout for consistent styling
 */
export const EconomyPage: FC = () => {
  return (
    <PageLayout maxWidth="full">
      <EconomyDashboard />
    </PageLayout>
  )
}
