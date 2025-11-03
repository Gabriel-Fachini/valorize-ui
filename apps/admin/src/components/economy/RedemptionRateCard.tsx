/**
 * Redemption Rate Card Component
 * Shows monthly redemption percentage
 */

import type { FC } from 'react'
import { EconomyMetricCard } from './EconomyMetricCard'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { RedemptionRate } from '@/types/economy'

interface RedemptionRateCardProps {
  data: RedemptionRate | undefined
  isLoading?: boolean
}

/**
 * RedemptionRateCard - Displays monthly coin redemption rate
 *
 * Features:
 * - Redemption percentage as main metric
 * - Coins redeemed vs issued
 * - Status based on redemption rate
 */
export const RedemptionRateCard: FC<RedemptionRateCardProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <EconomyMetricCard
        title="Taxa de Resgate"
        icon={<i className="ph ph-chart-bar" />}
        status="healthy"
        isLoading
      >
        <div />
      </EconomyMetricCard>
    )
  }

  if (!data) {
    return null
  }

  return (
    <EconomyMetricCard
      title="Taxa de Resgate"
      icon={<i className="ph ph-chart-bar" />}
      status={data.status}
      tooltipText="Percentual de moedas emitidas que foram resgatadas neste mês. Indica o grau de conversão do programa."
    >
      <div className="space-y-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                <p className="text-xs text-muted-foreground">Taxa de Resgate Mensal</p>
                <p className="text-3xl font-bold text-primary">{data.redemption_percentage.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">de moedas resgatadas</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">Percentual de moedas emitidas que foram resgatadas este mês</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">Resumo do Mês</p>
          <div className="flex items-center justify-between text-sm font-semibold mt-2">
            <span>{data.coins_redeemed_this_month.toLocaleString('pt-BR')} resgatadas</span>
            <span className="text-muted-foreground">de</span>
            <span>{data.coins_issued_this_month.toLocaleString('pt-BR')} emitidas</span>
          </div>
        </div>
      </div>
    </EconomyMetricCard>
  )
}
