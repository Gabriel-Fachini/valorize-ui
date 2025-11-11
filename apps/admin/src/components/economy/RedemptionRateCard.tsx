/**
 * Redemption Rate Card Component
 * Shows monthly redemption percentage with business context
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
 * RedemptionRateCard - Displays monthly coin redemption rate with cost context
 *
 * Features:
 * - Redemption percentage as main metric
 * - Coins redeemed vs received (with BRL equivalent)
 * - Status based on healthy range (25-40%)
 * - Business impact explanation
 */
export const RedemptionRateCard: FC<RedemptionRateCardProps> = ({ data, isLoading = false }) => {
  const formatCurrency = (coins: number) => {
    const brl = coins * 0.06 // R$ 0.06 per coin
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(brl)
  }

  const getRedemptionStatusColor = () => {
    const rate = data?.redemption_percentage ?? 0
    if (rate >= 25 && rate <= 40) return 'text-emerald-600 dark:text-emerald-400'
    if (rate < 15 || rate > 60) return 'text-red-600 dark:text-red-400'
    return 'text-yellow-600 dark:text-yellow-400'
  }

  if (isLoading) {
    return (
      <EconomyMetricCard
        title="Conversão em Recompensas"
        icon={<i className="ph ph-chart-bar" />}
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
        title="Conversão em Recompensas"
        icon={<i className="ph ph-gift" />}
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

  const tooltipExpanded = `🎯 O que mede:
Quando um colaborador é elogiado, ele recebe moedas de RESGATE (diferentes das moedas de elogios).
Esta métrica mostra quantas dessas moedas foram trocadas por prêmios.

📊 Interpretação:
• ✅ 25-40%: Saudável - conversão balanceada
• ⚠️ < 15%: Acúmulo excessivo - revisar catálogo de prêmios
• ⚠️ > 60%: Muito alta - verificar possível anomalia ou promoção ativa

💰 Impacto Financeiro:
Taxa alta = Mais resgates = Maior custo operacional
Taxa baixa = Moedas acumuladas = Potencial passivo futuro

💡 Ação Recomendada:
Se < 15%: Avaliar atratividade do catálogo ou comunicar melhor benefícios
Se > 60%: Verificar se há promoções ativas ou comportamento atípico`

  return (
    <EconomyMetricCard
      title="Conversão em Recompensas"
      icon={<i className="ph ph-gift" />}
      status={data.status}
      tooltipText="Percentual de moedas de resgate recebidas pelos colaboradores que foram convertidas em prêmios neste mês."
      tooltipExpandedText={tooltipExpanded}
      metaText="Faixa: 25-40%"
    >
      <div className="space-y-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div role="region" aria-label="Taxa de conversão mensal em porcentagem">
                <p className="text-xs text-muted-foreground">Taxa de Conversão Mensal</p>
                <p className={`text-3xl font-bold ${getRedemptionStatusColor()}`} aria-live="polite">{data.redemption_percentage.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">de conversão</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-base">Percentual de moedas convertidas em prêmios este mês</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="pt-2 border-t space-y-3" role="region" aria-label="Resumo mensal de conversão">
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Resumo do Mês</p>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2">
                      <i className="ph ph-diamond text-emerald-600 dark:text-emerald-400" />
                      Moedas Resgatadas
                    </span>
                    <div className="text-right">
                      <span className="font-semibold">{data.coins_redeemed_this_month.toLocaleString('pt-BR')}</span>
                      <span className="text-xs text-emerald-600 ml-1">
                        ({formatCurrency(data.coins_redeemed_this_month)})
                      </span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-base">
                    Moedas já convertidas em vouchers ou produtos neste mês.
                    Cada moeda equivale a R$ 0,06 de custo operacional.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-between items-center text-sm mt-1.5">
                    <span className="flex items-center gap-2">
                      <i className="ph ph-gift text-blue-600 dark:text-blue-400" />
                      Moedas Recebidas
                    </span>
                    <div className="text-right">
                      <span className="font-semibold">{data.coins_issued_this_month.toLocaleString('pt-BR')}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({formatCurrency(data.coins_issued_this_month)})
                      </span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-base">
                    Moedas de resgate distribuídas aos colaboradores através dos elogios recebidos.
                    Elas não expiram (válidas por 18 meses) e convertem em prêmios reais.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </EconomyMetricCard>
  )
}
