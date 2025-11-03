/**
 * Redeemable Coins Card Component
 * Shows coverage index and total coins in circulation
 */

import type { FC } from 'react'
import { EconomyMetricCard } from './EconomyMetricCard'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { RedeemableCoins } from '@/types/economy'

interface RedeemableCoinsCardProps {
  data: RedeemableCoins | undefined
  isLoading?: boolean
}

export const RedeemableCoinsCard: FC<RedeemableCoinsCardProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <EconomyMetricCard
        title="Moedas Resgatáveis"
        icon={<i className="ph ph-coins" />}
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
      title="Moedas Resgatáveis"
      icon={<i className="ph ph-coins" />}
      status={data.status}
      tooltipText="Percentual de cobertura do saldo em relação às moedas em circulação. Quanto maior, melhor a saúde financeira."
    >
      <div className="space-y-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                <p className="text-4xl font-bold text-primary">
                  {data.coverage_index}% 
                  <span className="text-lg"> de cobertura</span>
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">Percentual do saldo que cobre as moedas em circulação</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total em Circulação:</span>
            <span className="font-semibold">{data.total_in_circulation.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Equivalente em BRL:</span>
            <span className="font-semibold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(data.equivalent_in_brl)}
            </span>
          </div>
        </div>
      </div>
    </EconomyMetricCard>
  )
}
