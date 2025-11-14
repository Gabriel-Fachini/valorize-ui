/**
 * Values Distribution Chart
 * Displays distribution of compliments by company values
 */

import type { FC } from 'react'
import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { animated, useSpring } from '@react-spring/web'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { ValueDistributionItem } from '@/types/compliments'

interface ValuesDistributionChartProps {
  data?: ValueDistributionItem[]
  isLoading?: boolean
}

/**
 * Get computed CSS color values for chart
 */
const getChartColors = () => {
  if (typeof window === 'undefined') {
    return {
      primary: '#00d959',
      background: '#ffffff',
      border: '#e5e5e5',
      mutedForeground: '#737373',
    }
  }

  const root = document.documentElement
  const styles = getComputedStyle(root)

  return {
    primary: styles.getPropertyValue('--color-primary-500') || '#00d959',
    background:
      styles.getPropertyValue('--color-background') ||
      (root.classList.contains('dark') ? '#171717' : '#ffffff'),
    border:
      styles.getPropertyValue('--color-border') ||
      (root.classList.contains('dark') ? '#404040' : '#e5e5e5'),
    mutedForeground:
      styles.getPropertyValue('--color-muted-foreground') ||
      (root.classList.contains('dark') ? '#a3a3a3' : '#737373'),
  }
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: {
      valueName: string
      count: number
      percentage: number
      totalCoins: number
    }
  }>
}

const CustomTooltip: FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <p className="text-sm font-semibold mb-1">{data.valueName}</p>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{data.count ?? 0}</span> elogios
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {typeof data.percentage === 'number' ? data.percentage.toFixed(1) : '0'}%
            </span>{' '}
            do total
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-primary">
              {(data.totalCoins ?? 0).toLocaleString('pt-BR')}
            </span>{' '}
            moedas
          </p>
        </div>
      </div>
    )
  }
  return null
}

export const ValuesDistributionChart: FC<ValuesDistributionChartProps> = ({
  data,
  isLoading = false,
}) => {
  const colors = useMemo(() => getChartColors(), [])

  const chartAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 200,
  })

  if (isLoading) {
    return (
      <animated.div
        style={chartAnimation as any}
        className="rounded-3xl border bg-card p-6 shadow-sm"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-5 w-48 bg-muted animate-pulse rounded" />
            <div className="h-3.5 w-36 bg-muted/60 animate-pulse rounded" />
          </div>

          <div className="relative h-[350px] bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around gap-2 px-8 pb-8">
              {[50, 75, 60, 85, 70].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-muted/50 animate-pulse rounded-t"
                  style={{
                    height: `${height}%`,
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </animated.div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <animated.div
        style={chartAnimation as any}
        className="rounded-3xl border bg-card p-6 shadow-sm"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Distribuição por Valores</h3>
          <p className="text-sm text-muted-foreground">Valores da empresa mais reconhecidos</p>
        </div>
        <div className="flex items-center justify-center h-[350px] text-muted-foreground">
          <p>Nenhum dado disponível</p>
        </div>
      </animated.div>
    )
  }

  // Sort by count descending
  const sortedData = [...data].sort((a, b) => b.count - a.count)

  // Generate colors for each bar
  const barColors = [
    '#00d959', // primary
    '#3b82f6', // blue
    '#a855f7', // purple
    '#f59e0b', // amber
    '#ef4444', // red
    '#10b981', // emerald
    '#8b5cf6', // violet
    '#ec4899', // pink
  ]

  return (
    <animated.div
      style={chartAnimation as any}
      className="rounded-3xl border bg-card p-6 shadow-sm"
    >
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Distribuição por Valores</h3>
              <TooltipProvider>
                <UITooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center hover:text-foreground transition-colors"
                    >
                      <i className="ph ph-info text-xl text-muted-foreground/70 hover:text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" side="right" align="start">
                    <p className="text-sm">
                      Distribuição dos elogios por valores da empresa. Mostra quais valores estão
                      sendo mais reconhecidos pelos colaboradores.
                    </p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
            <p className="text-sm text-muted-foreground">Valores da empresa mais reconhecidos</p>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} opacity={0.5} />
          <XAxis
            type="number"
            tick={{ fill: colors.mutedForeground, fontSize: 12 }}
            stroke={colors.border}
          />
          <YAxis
            type="category"
            dataKey="valueName"
            tick={{ fill: colors.mutedForeground, fontSize: 12 }}
            stroke={colors.border}
            width={120}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[0, 8, 8, 0]}>
            {sortedData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Trend badges */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {sortedData.slice(0, 3).map((value, index) => {
          const hasTrend = value.trend && value.trend !== 'stable' && typeof value.trendPercentage === 'number'
          return (
            <div key={value.valueId} className="flex items-center gap-2 text-xs">
              <span className="font-medium text-muted-foreground">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {value.valueName}:
              </span>
              {hasTrend && (
                <Badge
                  variant={value.trend === 'up' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {value.trend === 'up' ? '+' : ''}
                  {value.trendPercentage.toFixed(1)}%
                </Badge>
              )}
            </div>
          )
        })}
      </div>
    </animated.div>
  )
}
