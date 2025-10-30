import type { FC } from 'react'
import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { ComplimentsByWeek } from '../../types/dashboard'

interface ComplimentsChartProps {
  data: ComplimentsByWeek[]
  isLoading?: boolean
}

/**
 * Get computed CSS color values for chart
 * Recharts can't parse CSS variables directly, so we need to resolve them
 */
const getChartColors = () => {
  if (typeof window === 'undefined') {
    // SSR fallback
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
    background: styles.getPropertyValue('--color-background') ||
                (root.classList.contains('dark') ? '#171717' : '#ffffff'),
    border: styles.getPropertyValue('--color-border') ||
            (root.classList.contains('dark') ? '#404040' : '#e5e5e5'),
    mutedForeground: styles.getPropertyValue('--color-muted-foreground') ||
                     (root.classList.contains('dark') ? '#a3a3a3' : '#737373'),
  }
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    dataKey: string
  }>
  label?: string
}

const CustomTooltip: FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length && label) {
    const date = new Date(label)
    const formattedDate = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    })

    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <p className="text-sm font-medium">{formattedDate}</p>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-primary">{payload[0].value}</span> elogios
        </p>
      </div>
    )
  }
  return null
}

export const ComplimentsChart: FC<ComplimentsChartProps> = ({ data, isLoading = false }) => {
  // Get theme-aware colors for the chart
  const colors = useMemo(() => getChartColors(), [])

  if (isLoading) {
    return (
      <div className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="space-y-2">
            <div className="h-5 w-40 bg-muted animate-pulse rounded" />
            <div className="h-3.5 w-32 bg-muted/60 animate-pulse rounded" />
          </div>

          {/* Chart skeleton */}
          <div className="relative h-[300px] bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg overflow-hidden">
            {/* Animated bars to simulate chart */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around gap-2 px-8 pb-8">
              {[40, 60, 45, 70, 85, 75, 65, 90].map((height, i) => (
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
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-around p-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-px bg-muted/30" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Transform data for chart
  const chartData = data.map(item => ({
    week: item.weekStart,
    elogios: item.count,
  }))

  // Format date for X axis
  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    })
  }

  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Evolução de Elogios</h3>
        <p className="text-sm text-muted-foreground">
          Últimas 8 semanas
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={colors.border}
            opacity={0.5}
          />
          <XAxis
            dataKey="week"
            tickFormatter={formatXAxis}
            tick={{ fill: colors.mutedForeground, fontSize: 12 }}
            stroke={colors.border}
          />
          <YAxis
            tick={{ fill: colors.mutedForeground, fontSize: 12 }}
            stroke={colors.border}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="elogios"
            stroke={colors.primary}
            strokeWidth={3}
            dot={{
              fill: colors.background,
              stroke: colors.primary,
              strokeWidth: 3,
              r: 6,
            }}
            activeDot={{
              fill: colors.primary,
              stroke: colors.background,
              strokeWidth: 3,
              r: 8,
            }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
