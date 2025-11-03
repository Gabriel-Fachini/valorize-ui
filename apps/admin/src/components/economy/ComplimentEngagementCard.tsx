/**
 * Compliment Engagement Card Component
 * Shows usage rate of weekly compliment coins with clear context
 */

import type { FC } from 'react'
import { useMemo } from 'react'
import { EconomyMetricCard } from './EconomyMetricCard'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'
import type { ComplimentEngagement } from '@/types/economy'

interface ComplimentEngagementCardProps {
  data: ComplimentEngagement | undefined
  isLoading?: boolean
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    name: string
  }>
}

const CustomTooltip: FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-lg">
        {payload.map((item, index) => (
          <p key={index} className="text-xs font-medium">
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

/**
 * ComplimentEngagementCard - Shows weekly compliment coin usage
 *
 * Features:
 * - Usage rate percentage (target: > 70%)
 * - Bar chart with used vs unused coins
 * - Context on weekly coin distribution (100/user)
 * - Comprehensive tooltip explaining non-redeemable nature
 */
export const ComplimentEngagementCard: FC<ComplimentEngagementCardProps> = ({
  data,
  isLoading = false,
}) => {
  const chartData = useMemo(() => {
    if (!data) return []
    return [
      {
        name: 'Uso',
        Usadas: data.used,
        'Não usadas': data.wasted,
      },
    ]
  }, [data])

  if (isLoading) {
    return (
      <EconomyMetricCard
        title="Uso de Moedas de Elogios"
        icon={<i className="ph ph-heart" />}
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
        title="Uso de Moedas de Elogios"
        icon={<i className="ph ph-heart" />}
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

  const getUsageStatusColor = () => {
    const rate = data.usage_rate
    if (rate >= 70) return 'text-emerald-600 dark:text-emerald-400'
    if (rate >= 50) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const tooltipExpanded = `🎯 O que mede:
Cada colaborador recebe 100 moedas semanais para enviar elogios. 
Esta métrica mostra quantas dessas moedas foram de fato utilizadas.

📊 Interpretação:
• 🟢 > 70%: Ótimo - equipe engajada com reconhecimento
• 🟡 50-70%: Moderado - considerar campanhas de incentivo
• 🔴 < 50%: Baixo - possível desengajamento cultural

💡 Importante:
Moedas de elogios NÃO geram custo (não convertem em dinheiro).
Elas expiram toda semana e são renovadas automaticamente.`

  return (
    <EconomyMetricCard
      title="Uso de Moedas de Elogios"
      icon={<i className="ph ph-heart" />}
      status={data.status}
      tooltipText="Percentual de moedas de elogios (100/semana por usuário) que foram utilizadas para enviar reconhecimentos."
      tooltipExpandedText={tooltipExpanded}
      metaText="Meta: > 70%"
    >
      <div className="space-y-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div role="region" aria-label="Taxa de utilização semanal de moedas de elogios">
                <p className="text-xs text-muted-foreground">Taxa de Utilização Semanal</p>
                <p className={`text-3xl font-bold ${getUsageStatusColor()}`} aria-live="polite">{data.usage_rate.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">de uso</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-base">Taxa de uso de moedas de elogios esta semana</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Chart */}
        <div className="h-32 w-full pt-2" role="img" aria-label="Gráfico de moedas usadas vs não usadas">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <RechartsTooltip 
                content={<CustomTooltip />}
                contentStyle={{ backgroundColor: 'transparent', border: 'none', outline: 'none' }}
                wrapperStyle={{ outline: 'none' }}
              />
              <Bar dataKey="Usadas" fill="#10b981" />
              <Bar dataKey="Não usadas" fill="#d1d5db" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="pt-2 border-t text-xs" role="region" aria-label="Breakdown de moedas usadas e não usadas">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Usadas:</span>
                  <span className="font-semibold text-emerald-600">{data.used.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-muted-foreground">Não usadas:</span>
                  <span className="font-semibold text-muted-foreground">{data.wasted.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-base">
                Moedas não usadas expiram no final da semana.
                Usuários recebem 100 novas moedas toda segunda-feira.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </EconomyMetricCard>
  )
}
