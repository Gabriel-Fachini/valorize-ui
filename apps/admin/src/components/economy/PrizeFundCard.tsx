/**
 * Prize Fund Card Component
 * Shows remaining runway in days with clear context and interpretation
 */

import type { FC } from 'react'
import { EconomyMetricCard } from './EconomyMetricCard'
import { Progress } from '@/components/ui/progress'
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
 * - Current balance context
 * - Monthly consumption breakdown
 * - Visual progress indicator
 * - Status badge with semantic colors
 * - Comprehensive tooltips with interpretation guide
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
        title="Tempo de Cobertura"
        icon={<i className="ph ph-clock" />}
        status="healthy"
        isLoading
      >
        <div />
      </EconomyMetricCard>
    )
  }

  if (!data) {
    return (
      <EconomyMetricCard
        title="Tempo de Cobertura"
        icon={<i className="ph ph-clock" />}
        status="healthy"
      >
        <div className="py-8 text-center">
          <i className="ph ph-chart-line-up text-3xl text-muted-foreground mb-2 block" />
          <p className="text-sm text-muted-foreground">
            Não há dados suficientes para exibir esta métrica.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Aguarde até que haja atividade suficiente no sistema.
          </p>
        </div>
      </EconomyMetricCard>
    )
  }

  // Calculate progress percentage for visual indicator
  const getProgressPercentage = (days: number) => {
    if (days >= 60) return 100
    if (days >= 45) return 75
    if (days >= 30) return 50
    if (days >= 15) return 25
    return 10
  }

  const progressPercentage = getProgressPercentage(data.runway_days)

  const tooltipExpanded = `📊 Interpretação:
• 🟢 > 45 dias: Saudável - não requer ação imediata
• 🟡 15-45 dias: Atenção - considerar novo aporte
• 🔴 < 15 dias: Crítico - carregar saldo urgentemente

💡 Como é calculado:
(Saldo Atual ÷ Consumo Médio Diário) = Dias restantes

Baseado no consumo dos últimos 30 dias.`

  return (
    <EconomyMetricCard
      title="Tempo de Cobertura"
      icon={<i className="ph ph-clock" />}
      status={data.status}
      tooltipText="Previsão de dias até o saldo se esgotar, baseado no consumo médio dos últimos 30 dias."
      tooltipExpandedText={tooltipExpanded}
      metaText="Meta: > 45 dias"
    >
      <div className="space-y-4">
        {/* Main Metric with Tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div role="region" aria-label="Tempo de cobertura em dias">
                <p className="text-xs text-muted-foreground">Tempo de Cobertura Restante</p>
                <p className="text-3xl font-bold text-primary" aria-live="polite">{data.runway_days}</p>
                <p className="text-xs text-muted-foreground">dias restantes</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">Estimativa de dias até o fundo de prêmios se esgotar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Visual Progress Indicator */}
        <div className="space-y-1" role="region" aria-label="Indicador visual de cobertura">
          <Progress value={progressPercentage} className="h-1.5" aria-valuenow={progressPercentage} aria-valuemin={0} aria-valuemax={100} />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>0d</span>
            <span>15d</span>
            <span>45d</span>
            <span>60d+</span>
          </div>
        </div>

        {/* Current Balance */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div role="region" aria-label="Saldo atual da carteira">
                <p className="text-xs text-muted-foreground">Saldo Atual</p>
                <p className="text-lg font-semibold" aria-live="polite">{formatCurrency(data.current_balance)}</p>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">
                Saldo disponível na carteira de prêmios para resgates.
                Este valor é deduzido quando colaboradores resgatam vouchers ou produtos.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Consumption Estimate */}
        <div role="region" aria-label="Estimativa de consumo">
          <p className="text-xs text-muted-foreground">Estimativa de Consumo</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="font-semibold">{formatCurrency(data.current_balance / (data.runway_days || 1))}</p>
            <span className="text-xs text-muted-foreground">/ dia</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatCurrency(data.avg_monthly_consumption)} / mês
          </p>
        </div>
      </div>
    </EconomyMetricCard>
  )
}
