/**
 * Temporal Patterns Charts
 * Displays temporal analytics: weekly trend, day of week, and hourly distribution
 */

import type { FC } from 'react'
import { useMemo } from 'react'
import {
  LineChart,
  Line,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { TemporalPatterns } from '@/types/compliments'

interface TemporalPatternsChartsProps {
  data?: TemporalPatterns
  isLoading?: boolean
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

interface WeeklyTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; payload: { weekStart: string; weekEnd: string; coins: number } }>
}

const WeeklyTooltip: FC<WeeklyTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <p className="text-sm font-medium mb-1">
          {data.weekStart} - {data.weekEnd}
        </p>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-primary">{payload[0].value}</span> elogios
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {data.coins.toLocaleString('pt-BR')}
            </span>{' '}
            moedas
          </p>
        </div>
      </div>
    )
  }
  return null
}

const ChartsSkeleton: FC = () => {
  return (
    <div className="space-y-4">
      <div className="h-5 w-40 bg-muted animate-pulse rounded" />
      <div className="h-[350px] bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg" />
    </div>
  )
}

export const TemporalPatternsCharts: FC<TemporalPatternsChartsProps> = ({
  data,
  isLoading = false,
}) => {
  const colors = useMemo(() => getChartColors(), [])

  const cardAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 500,
  })

  if (isLoading) {
    return (
      <animated.div
        style={cardAnimation as any}
        className="rounded-3xl border bg-card p-6 shadow-sm"
      >
        <div className="mb-6">
          <div className="h-5 w-48 bg-muted animate-pulse rounded mb-2" />
          <div className="h-3.5 w-36 bg-muted/60 animate-pulse rounded" />
        </div>
        <ChartsSkeleton />
      </animated.div>
    )
  }

  if (!data) {
    return null
  }

  const { weeklyTrend, dayOfWeekDistribution, hourlyDistribution, monthlyGrowth } = data

  // Find peak hour
  const peakHour = hourlyDistribution
    ? [...hourlyDistribution].sort((a, b) => b.count - a.count)[0]
    : null

  // Find peak day
  const peakDay = dayOfWeekDistribution
    ? [...dayOfWeekDistribution].sort((a, b) => b.count - a.count)[0]
    : null

  return (
    <animated.div
      style={cardAnimation as any}
      className="rounded-3xl border bg-card p-6 shadow-sm"
    >
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Padrões Temporais</h3>
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
                  Análise temporal dos elogios: evolução ao longo do tempo e padrões por dia e
                  horário
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground">Evolução e padrões de atividade</p>
      </div>

      {/* Monthly Growth Card */}
      {monthlyGrowth && typeof monthlyGrowth.growthRate === 'number' && (
        <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Crescimento Mensal</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {monthlyGrowth.growthRate >= 0 ? '+' : ''}
                  {monthlyGrowth.growthRate.toFixed(1)}%
                </span>
                <span className="text-sm text-muted-foreground">
                  ({monthlyGrowth.currentMonth.month})
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Mês atual</p>
              <p className="text-xl font-semibold">{monthlyGrowth.currentMonth.count}</p>
              <p className="text-xs text-muted-foreground mt-1">
                vs {monthlyGrowth.previousMonth.count} anterior
              </p>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">
            <i className="ph ph-chart-line mr-2" />
            Evolução Semanal
          </TabsTrigger>
          <TabsTrigger value="weekday">
            <i className="ph ph-calendar-blank mr-2" />
            Por Dia
          </TabsTrigger>
          <TabsTrigger value="hourly">
            <i className="ph ph-clock mr-2" />
            Por Horário
          </TabsTrigger>
        </TabsList>

        {/* Weekly Trend Tab */}
        <TabsContent value="weekly" className="mt-6">
          {weeklyTrend && weeklyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={weeklyTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} opacity={0.5} />
                <XAxis
                  dataKey="weekStart"
                  tick={{ fill: colors.mutedForeground, fontSize: 11 }}
                  stroke={colors.border}
                />
                <YAxis
                  tick={{ fill: colors.mutedForeground, fontSize: 11 }}
                  stroke={colors.border}
                />
                <Tooltip content={<WeeklyTooltip />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={colors.primary}
                  strokeWidth={3}
                  dot={{ fill: colors.background, stroke: colors.primary, strokeWidth: 2, r: 5 }}
                  activeDot={{
                    fill: colors.primary,
                    stroke: colors.background,
                    strokeWidth: 2,
                    r: 6,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[350px] text-muted-foreground">
              <p>Nenhum dado disponível</p>
            </div>
          )}
        </TabsContent>

        {/* Day of Week Tab */}
        <TabsContent value="weekday" className="mt-6">
          {dayOfWeekDistribution && dayOfWeekDistribution.length > 0 ? (
            <>
              <div className="flex items-center justify-end mb-4">
                {peakDay && (
                  <Badge variant="secondary" className="text-xs">
                    Pico: {peakDay.dayName}
                  </Badge>
                )}
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={dayOfWeekDistribution}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} opacity={0.5} />
                  <XAxis
                    dataKey="dayName"
                    tick={{ fill: colors.mutedForeground, fontSize: 11 }}
                    stroke={colors.border}
                  />
                  <YAxis
                    tick={{ fill: colors.mutedForeground, fontSize: 11 }}
                    stroke={colors.border}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-3 shadow-lg">
                            <p className="text-sm font-medium mb-1">{payload[0].payload.dayName}</p>
                            <p className="text-xs text-muted-foreground">
                              <span className="font-semibold text-primary">{payload[0].value}</span>{' '}
                              elogios
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {dayOfWeekDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry === peakDay ? colors.primary : colors.border}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </>
          ) : (
            <div className="flex items-center justify-center h-[350px] text-muted-foreground">
              <p>Nenhum dado disponível</p>
            </div>
          )}
        </TabsContent>

        {/* Hourly Distribution Tab */}
        <TabsContent value="hourly" className="mt-6">
          {hourlyDistribution && hourlyDistribution.length > 0 ? (
            <>
              <div className="flex items-center justify-end mb-4">
                {peakHour && (
                  <Badge variant="secondary" className="text-xs">
                    Horário de pico: {peakHour.hour}h
                  </Badge>
                )}
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={hourlyDistribution}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} opacity={0.5} />
                  <XAxis
                    dataKey="hour"
                    tick={{ fill: colors.mutedForeground, fontSize: 11 }}
                    stroke={colors.border}
                    label={{ value: 'Hora do dia', position: 'insideBottom', offset: -5, fill: colors.mutedForeground, fontSize: 12 }}
                  />
                  <YAxis
                    tick={{ fill: colors.mutedForeground, fontSize: 11 }}
                    stroke={colors.border}
                    label={{ value: 'Elogios', angle: -90, position: 'insideLeft', fill: colors.mutedForeground, fontSize: 12 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-3 shadow-lg">
                            <p className="text-sm font-medium mb-1">{payload[0].payload.hour}h</p>
                            <p className="text-xs text-muted-foreground">
                              <span className="font-semibold text-primary">{payload[0].value}</span>{' '}
                              elogios
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {hourlyDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry === peakHour ? colors.primary : colors.border}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </>
          ) : (
            <div className="flex items-center justify-center h-[350px] text-muted-foreground">
              <p>Nenhum dado disponível</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </animated.div>
  )
}
