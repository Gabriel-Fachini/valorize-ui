/**
 * Prize Fund Card Component
 * Shows remaining runway in days and average monthly consumption
 */

import type { FC } from 'react'
import { EconomyMetricCard } from './EconomyMetricCard'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { PrizeFund } from '@/types/economy'

interface PrizeFundCardProps {
  data: PrizeFund | undefined
  isLoading?: boolean
}

/**
 * PrizeFundCard - Displays prize fund health with runway projection
 *
 * Features:
 * - Runway in days (main metric)
 * - Monthly consumption context
 * - Status badge with semantic colors
 */
export const PrizeFundCard: FC<PrizeFundCardProps> = ({ data, isLoading = false }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  if (isLoading) {
    return (
      <EconomyMetricCard
        title="Fundo de Prêmios"
        icon={<i className="ph ph-gift" />}
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
      title="Fundo de Prêmios"
      icon={<i className="ph ph-gift" />}
      status={data.status}
      tooltipText="Estimativa de dias até o fundo de prêmios se esgotar, baseado no consumo atual."
    >
      <div className="space-y-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                <p className="text-xs text-muted-foreground">Dias de Cobertura</p>
                <p className="text-3xl font-bold text-primary">{data.runway_days}</p>
                <p className="text-xs text-muted-foreground">dias restantes</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">Estimativa de dias até o fundo de prêmios se esgotar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">Consumo Médio</p>
          <p className="font-semibold">{formatCurrency(data.current_balance / 30)} / dia</p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatCurrency(data.avg_monthly_consumption)} / mês
          </p>
        </div>
      </div>
    </EconomyMetricCard>
  )
}
