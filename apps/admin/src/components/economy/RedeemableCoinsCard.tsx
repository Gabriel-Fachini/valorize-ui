/**
 * Redeemable Coins Card Component
 * Shows coverage index with comprehensive business context
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

/**
 * RedeemableCoinsCard - Displays coverage index and coin circulation
 *
 * Features:
 * - Coverage index as main metric
 * - Total coins in circulation
 * - BRL equivalent with context
 * - Comprehensive interpretation guide
 */
export const RedeemableCoinsCard: FC<RedeemableCoinsCardProps> = ({ data, isLoading = false }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  if (isLoading) {
    return (
      <EconomyMetricCard
        title="Índice de Cobertura"
        icon={<i className="ph ph-shield-check" />}
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
        title="Índice de Cobertura"
        icon={<i className="ph ph-shield-check" />}
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

  const tooltipExpanded = `📊 Relação entre saldo disponível e moedas em circulação

🎯 O que mede:
Se todos os colaboradores resgatassem suas moedas hoje, 
quanto % do valor seria coberto pelo saldo atual?

📈 Interpretação:
• 🔵 > 200%: Sobra excessiva - avaliar reduzir aportes
• 🟢 120-200%: Saudável - cobertura ideal
• 🟡 80-120%: Atenção - monitorar saldo
• 🔴 < 80%: Crítico - risco de não conseguir honrar resgates

💡 Exemplo:
100% de cobertura = Você tem exatamente o valor necessário para cobrir todas as moedas ativas.
150% = Você tem 50% a mais de segurança.`

  return (
    <EconomyMetricCard
      title="Índice de Cobertura"
      icon={<i className="ph ph-shield-check" />}
      status={data.status}
      tooltipText="Relação entre saldo disponível e moedas em circulação. Quanto maior, melhor a saúde financeira."
      tooltipExpandedText={tooltipExpanded}
      metaText="Ideal: 120-150%"
    >
            <div className="space-y-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div role="region" aria-label="Índice de cobertura em porcentagem">
                <p className="text-xs text-muted-foreground">Índice de Cobertura</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-bold text-primary" aria-live="polite">{data.coverage_index}%</p>
                </div>
                <p className="text-xs text-muted-foreground">de cobertura</p>
              </div>
            </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-base">Percentual do saldo que cobre as moedas em circulação</p>
              </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="space-y-2.5 border-t border-border pt-3" role="region" aria-label="Detalhes de moedas em circulação">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total em Circulação:</span>
                  <span className="font-semibold">{data.total_in_circulation.toLocaleString('pt-BR')}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-base">
                  Soma de todas as moedas de resgate acumuladas pelos colaboradores.
                  Representa o passivo máximo (se todos resgatassem tudo hoje).
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Equivalente em BRL:</span>
                  <span className="font-semibold text-emerald-600">
                    {formatCurrency(data.equivalent_in_brl)}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-base">
                  Valor em reais que seria necessário para cobrir todas as moedas em circulação.
                  Cálculo: Total de moedas × R$ 0,06 (índice de conversão fixo)
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </EconomyMetricCard>
  )
}
