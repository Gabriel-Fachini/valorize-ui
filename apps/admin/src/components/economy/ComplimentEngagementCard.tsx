/**
 * Compliment Engagement Card Component
 * Shows usage rate of compliments with Recharts bar chart
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
 * ComplimentEngagementCard - Shows weekly compliment distribution and usage
 *
 * Features:
 * - Usage rate percentage
 * - Bar chart with used vs wasted
 * - Context on coins distributed
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
        Desperdiçadas: data.wasted,
      },
    ]
  }, [data])

  if (isLoading) {
    return (
      <EconomyMetricCard
        title="Engajamento de Elogios"
        icon={<i className="ph ph-heart" />}
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
      title="Engajamento de Elogios"
      icon={<i className="ph ph-heart" />}
      status={data.status}
      tooltipText="Taxa de utilização de moedas de elogios distribuídas. Mostra o engajamento dos usuários com o sistema."
    >
      <div className="space-y-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                <p className="text-xs text-muted-foreground">Taxa de Uso</p>
                <p className="text-3xl font-bold text-primary">{data.usage_rate.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">de taxa de uso</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">Taxa de uso de moedas de elogios esta semana</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Chart */}
        <div className="h-32 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar dataKey="Usadas" fill="#10b981" />
              <Bar dataKey="Desperdiçadas" fill="#d1d5db" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="pt-2 border-t text-xs">
          <p className="text-muted-foreground">
            {data.used.toLocaleString('pt-BR')} de{' '}
            {data.distributed_this_week.toLocaleString('pt-BR')} moedas usadas
          </p>
        </div>
      </div>
    </EconomyMetricCard>
  )
}
