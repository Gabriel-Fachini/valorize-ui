/**
 * Alerts Section Component
 * Displays economy alerts prioritized by severity
 */

import type { FC } from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
 * - Semantic colors for each priority
 * - Dismissible alerts (local state only)
 * - Empty state when no alerts
 */
export const AlertsSection: FC<AlertsSectionProps> = ({ alerts, isLoading = false }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical':
        return {
          icon: 'ph-warning-circle',
          bgColor: 'bg-transparent',
          borderColor: 'border-l-2 border-l-red-500',
          textColor: 'text-foreground',
          descColor: 'text-muted-foreground',
          accentColor: 'text-red-600 dark:text-red-400',
        }
      case 'warning':
        return {
          icon: 'ph-warning',
          bgColor: 'bg-transparent',
          borderColor: 'border-l-2 border-l-yellow-500',
          textColor: 'text-foreground',
          descColor: 'text-muted-foreground',
          accentColor: 'text-yellow-600 dark:text-yellow-400',
        }
      case 'info':
      default:
        return {
          icon: 'ph-info',
          bgColor: 'bg-transparent',
          borderColor: 'border-l-2 border-l-blue-500',
          textColor: 'text-foreground',
          descColor: 'text-muted-foreground',
          accentColor: 'text-blue-600 dark:text-blue-400',
        }
    }
  }

  const handleDismiss = (alertId: string) => {
    const updated = new Set(dismissedAlerts)
    updated.add(alertId)
    setDismissedAlerts(updated)
  }

  // Sort by priority: critical > warning > info
  const priorityOrder = { critical: 0, warning: 1, info: 2 }
  const sortedAlerts = [...alerts]
    .sort((a, b) => (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3))
    .filter((alert) => !dismissedAlerts.has(alert.id))

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (sortedAlerts.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <i className="ph ph-check-circle text-green-600 dark:text-green-400 text-lg" />
            <CardTitle className="text-base">
              Nenhum alerta crítico
            </CardTitle>
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
          Alertas ({sortedAlerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedAlerts.map((alert) => {
          const config = getPriorityConfig(alert.priority)

          return (
            <div
              key={alert.id}
              className={`rounded-lg border-l-4 p-3 ${config.bgColor} ${config.borderColor} flex items-start justify-between gap-3`}
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <i className={`ph ${config.icon} text-base ${config.textColor}`} />
                  <p className={`font-medium text-sm ${config.textColor}`}>{alert.title}</p>
                </div>
                <p className={`text-xs ${config.descColor} leading-relaxed`}>{alert.description}</p>
                {alert.recommended_action && (
                  <div className={`text-xs ${config.accentColor} mt-2 pt-1`}>
                    <p className="font-medium">{alert.recommended_action}</p>
                  </div>
                )}
              </div>
              {alert.dismissible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDismiss(alert.id)}
                  className="text-muted-foreground hover:text-foreground flex-shrink-0 h-6 w-6 p-0"
                >
                  <i className="ph ph-x text-base" />
                </Button>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
