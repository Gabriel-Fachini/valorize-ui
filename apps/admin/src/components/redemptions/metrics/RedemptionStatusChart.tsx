import type { FC } from 'react'
import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import type { StatusBreakdownItem } from '@/types/redemptions'
import { animated, useSpring } from '@react-spring/web'

interface RedemptionStatusChartProps {
  statusBreakdown?: StatusBreakdownItem[]
  isLoading?: boolean
}

const STATUS_COLORS: Record<string, string> = {
  delivered: '#00d959',
  pending: '#f59e0b',
  sent: '#3b82f6',
  shipped: '#8b5cf6',
  processing: '#ec4899',
  completed: '#10b981',
  failed: '#ef4444',
  cancelled: '#6b7280',
}

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
    payload: StatusBreakdownItem
  }>
}

const CustomTooltip: FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { status, count, percentage } = payload[0].payload
    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <p className="text-sm font-medium capitalize">{status}</p>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-primary">{count}</span> resgate
          {count > 1 ? 's' : ''}
        </p>
        <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
      </div>
    )
  }
  return null
}

export const RedemptionStatusChart: FC<RedemptionStatusChartProps> = ({
  statusBreakdown = [],
  isLoading = false,
}) => {
  useMemo(() => getChartColors(), [])

  const chartAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 400,
  })

  if (isLoading) {
    return (
      <animated.div
        style={chartAnimation as any}
        className="rounded-3xl border bg-card p-6 shadow-sm"
      >
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="space-y-2">
            <div className="h-5 w-40 bg-muted animate-pulse rounded" />
            <div className="h-3.5 w-32 bg-muted/60 animate-pulse rounded" />
          </div>

          {/* Chart skeleton */}
          <div className="relative h-[300px] flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-muted/30 animate-pulse" />
          </div>
        </div>
      </animated.div>
    )
  }

  const chartData = statusBreakdown.map(item => ({
    ...item,
    value: item.count,
  }))

  return (
    <animated.div
      style={chartAnimation as any}
      className="rounded-3xl border bg-card p-6 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Distribuição por Status</h3>
        <p className="text-sm text-muted-foreground">
          {statusBreakdown.reduce((sum, item) => sum + item.count, 0)} resgates no total
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name} ${(percentage as number).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#8b5cf6'} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '12px',
            }}
            formatter={(value) => <span className="capitalize text-muted-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </animated.div>
  )
}
