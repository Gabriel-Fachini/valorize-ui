/**
 * Economy Dashboard Component
 * Main orchestrator for the economy dashboard
 */

import type { FC } from 'react'
import { animated } from '@react-spring/web'
import { usePageEntrance, usePageHeaderEntrance } from '@valorize/shared/hooks'
import { PageHeader } from '@/components/layout/PageHeader'
import { useEconomyDashboard } from '@/hooks/useEconomy'
import { WalletBalanceCard } from './WalletBalanceCard'
import { SuggestedDepositBanner } from './SuggestedDepositBanner'
import { PrizeFundCard } from './PrizeFundCard'
import { RedeemableCoinsCard } from './RedeemableCoinsCard'
import { ComplimentEngagementCard } from './ComplimentEngagementCard'
import { RedemptionRateCard } from './RedemptionRateCard'
import { DepositHistorySection } from './DepositHistorySection'
import { EconomyMetricsGuide } from './EconomyMetricsGuide'

/**
 * EconomyDashboard - Main economy dashboard page
 *
 * Features:
 * - Alertas prioritizados no topo
 * - Card destacado de saldo da carteira
 * - Sugestão de aporte inteligente
 * - Grid com 4 cards de métricas
 * - Histórico de aportes
 * - Animações de entrada suaves
 * - Loading states em todos os componentes
 */
export const EconomyDashboard: FC = () => {
  const { data, isLoading } = useEconomyDashboard()

  const pageAnimation = usePageEntrance()
  const headerAnimation = usePageHeaderEntrance()

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <animated.div style={pageAnimation as any} className="space-y-6">
      {/* Header */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <animated.div style={headerAnimation as any}>
        <PageHeader
          title="Dashboard de Economia"
          description="Visão geral da saúde financeira do sistema de moedas"
          icon='ph-currency-circle-dollar'
        />
      </animated.div>

      {/* Main Wallet Balance Card */}
      <WalletBalanceCard data={data?.wallet_balance} isLoading={isLoading} />

      {/* Suggested Deposit Banner */}
      <SuggestedDepositBanner suggestion={data?.suggested_deposit ?? null} isLoading={isLoading} />

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {/* Financial Health */}
        <PrizeFundCard data={data?.prize_fund} isLoading={isLoading} />
        <RedeemableCoinsCard data={data?.redeemable_coins} isLoading={isLoading} />
        
        {/* Engagement */}
        <ComplimentEngagementCard data={data?.compliment_engagement} isLoading={isLoading} />
        
        {/* Results */}
        <RedemptionRateCard data={data?.redemption_rate} isLoading={isLoading} />
      </div>

      {/* Deposit History */}
      <DepositHistorySection limit={10} />

      {/* Metrics Guide */}
      <EconomyMetricsGuide />
    </animated.div>
  )
}
