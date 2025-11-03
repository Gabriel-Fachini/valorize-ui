/**
 * Alerts Section Component
 * Displays economy alerts prioritized by severity
 */

import type { FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { EconomyAlert } from '@/types/economy'

interface AlertsSectionProps {
  alerts: EconomyAlert[]
  isLoading?: boolean
}

/**
 * AlertsSection - Displays prioritized alerts
 *
 * Features:
 * - Alerts ordered by priority (critical → warning → info)
 * - Clean, minimal design
 * - Empty state when no alerts
 */
export const AlertsSection: FC<AlertsSectionProps> = ({ alerts, isLoading = false }) => {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical':
        return {
          icon: 'ph-warning-circle',
          color: 'text-red-600 dark:text-red-400',
          bgHover: 'hover:bg-red-50 dark:hover:bg-red-950/20',
        }
      case 'warning':
        return {
          icon: 'ph-warning',
          color: 'text-yellow-600 dark:text-yellow-400',
          bgHover: 'hover:bg-yellow-50 dark:hover:bg-yellow-950/20',
        }
      case 'info':
      default:
        return {
          icon: 'ph-info',
          color: 'text-blue-600 dark:text-blue-400',
          bgHover: 'hover:bg-blue-50 dark:hover:bg-blue-950/20',
        }
    }
  }

  // Sort by priority: critical > warning > info
  const priorityOrder = { critical: 0, warning: 1, info: 2 }
  const sortedAlerts = [...alerts].sort(
    (a, b) => (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3),
  )

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (sortedAlerts.length === 0) {
    return (
      <Card className="mb-6 border-green-200 dark:border-green-900/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <i className="ph ph-check-circle text-green-600 dark:text-green-400 text-lg" />
            <CardTitle className="text-base text-foreground">Nenhum alerta crítico</CardTitle>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <i className="ph ph-bell text-lg" />
          {sortedAlerts.length} {sortedAlerts.length === 1 ? 'Alerta' : 'Alertas'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sortedAlerts.map((alert) => {
          const config = getPriorityConfig(alert.priority)

          return (
            <div key={alert.id} className={`rounded p-3 border border-border ${config.bgHover} transition-colors`}>
              <div className="flex gap-3">
                <i className={`ph ${config.icon} text-base flex-shrink-0 mt-0.5 ${config.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">{alert.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{alert.description}</p>
                  {alert.recommended_action && (
                    <p className={`text-xs ${config.color} font-medium mt-2`}>{alert.recommended_action}</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
