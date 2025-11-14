/**
 * Insights Panel
 * Displays AI-generated insights and alerts about compliments data
 */

import type { FC } from 'react'
import { animated, useSpring } from '@react-spring/web'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { InsightItem } from '@/types/compliments'

interface InsightsPanelProps {
  data?: InsightItem[]
  isLoading?: boolean
}

const getTypeConfig = (type: 'warning' | 'success' | 'info') => {
  switch (type) {
    case 'warning':
      return {
        bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
        borderColor: 'border-yellow-200 dark:border-yellow-900',
        iconBg: 'bg-yellow-100 dark:bg-yellow-900/50',
        iconColor: 'text-yellow-600 dark:text-yellow-500',
        icon: 'ph-warning',
      }
    case 'success':
      return {
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        borderColor: 'border-green-200 dark:border-green-900',
        iconBg: 'bg-green-100 dark:bg-green-900/50',
        iconColor: 'text-green-600 dark:text-green-500',
        icon: 'ph-check-circle',
      }
    case 'info':
      return {
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        borderColor: 'border-blue-200 dark:border-blue-900',
        iconBg: 'bg-blue-100 dark:bg-blue-900/50',
        iconColor: 'text-blue-600 dark:text-blue-500',
        icon: 'ph-info',
      }
    default:
      return {
        bgColor: 'bg-gray-50 dark:bg-gray-950/30',
        borderColor: 'border-gray-200 dark:border-gray-900',
        iconBg: 'bg-gray-100 dark:bg-gray-900/50',
        iconColor: 'text-gray-600 dark:text-gray-500',
        icon: 'ph-lightbulb',
      }
  }
}

const getPriorityVariant = (priority: 'high' | 'medium' | 'low') => {
  switch (priority) {
    case 'high':
      return 'destructive'
    case 'medium':
      return 'default'
    case 'low':
      return 'secondary'
    default:
      return 'outline'
  }
}

const InsightCard: FC<{ insight: InsightItem }> = ({ insight }) => {
  const config = getTypeConfig(insight.type)

  return (
    <div
      className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor} hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 p-2 rounded-full ${config.iconBg}`}>
          <i className={`ph ${config.icon} text-xl ${config.iconColor}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold text-sm">{insight.title}</h4>
            <Badge variant={getPriorityVariant(insight.priority)} className="text-xs flex-shrink-0">
              {insight.priority === 'high' && '🔴'}
              {insight.priority === 'medium' && '🟡'}
              {insight.priority === 'low' && '🟢'}{' '}
              {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>

          {insight.metric !== null && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-background/50 rounded text-xs font-medium mb-2">
              <i className="ph ph-chart-line-up text-primary" />
              {insight.metric}
            </div>
          )}

          {insight.actionable && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-start gap-2">
                <i className="ph ph-lightbulb text-primary mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Insight acionável</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const InsightsSkeleton: FC = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-4 rounded-lg border bg-card">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
              <div className="h-3 w-full bg-muted/60 animate-pulse rounded" />
              <div className="h-3 w-32 bg-muted/40 animate-pulse rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export const InsightsPanel: FC<InsightsPanelProps> = ({ data, isLoading = false }) => {
  const cardAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 700,
  })

  // Sort insights by priority: high > medium > low
  const sortedInsights = data
    ? [...data].sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      })
    : []

  // Count by type
  const typeCounts = sortedInsights.reduce(
    (acc, insight) => {
      acc[insight.type] = (acc[insight.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <animated.div
      style={cardAnimation as any}
      className="rounded-3xl border bg-card p-6 shadow-sm"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Insights e Alertas</h3>
              <TooltipProvider>
                <Tooltip delayDuration={200}>
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
                      Insights automáticos sobre padrões, tendências e oportunidades de melhoria
                      detectados nos dados
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-sm text-muted-foreground">
              Análises e recomendações automáticas
            </p>
          </div>

          {!isLoading && sortedInsights.length > 0 && (
            <div className="flex items-center gap-2">
              {typeCounts.warning > 0 && (
                <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-600">
                  {typeCounts.warning} avisos
                </Badge>
              )}
              {typeCounts.success > 0 && (
                <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                  {typeCounts.success} sucessos
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {isLoading ? (
          <InsightsSkeleton />
        ) : sortedInsights.length > 0 ? (
          sortedInsights.map((insight, index) => <InsightCard key={index} insight={insight} />)
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <i className="ph ph-lightbulb text-4xl mb-2 opacity-50" />
            <p>Nenhum insight disponível no momento</p>
            <p className="text-xs mt-1">Os insights são gerados automaticamente com base nos dados</p>
          </div>
        )}
      </div>

      {!isLoading && sortedInsights.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <i className="ph ph-sparkle text-primary" />
            <span>
              {sortedInsights.filter((i) => i.actionable).length} insights acionáveis
            </span>
          </div>
        </div>
      )}
    </animated.div>
  )
}
