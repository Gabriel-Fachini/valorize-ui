import type { FC } from 'react'

interface Alert {
  id: string
  type: 'info' | 'warning' | 'success' | 'error'
  title: string
  message: string
  timestamp: string
}

interface AlertsSectionProps {
  alerts?: Alert[]
  isLoading?: boolean
}

const AlertItem: FC<{ alert: Alert }> = ({ alert }) => {
  const getAlertStyles = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: 'ph-warning-circle text-red-600',
          text: 'text-red-900',
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          icon: 'ph-warning text-yellow-600',
          text: 'text-yellow-900',
        }
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: 'ph-check-circle text-green-600',
          text: 'text-green-900',
        }
      default:
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: 'ph-info text-blue-600',
          text: 'text-blue-900',
        }
    }
  }

  const styles = getAlertStyles(alert.type)

  return (
    <div className={`p-4 rounded-lg border ${styles.bg}`}>
      <div className="flex gap-3">
        <i className={`ph ${styles.icon} text-xl flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium ${styles.text}`}>{alert.title}</h4>
          <p className={`text-sm ${styles.text} opacity-80 mt-1`}>{alert.message}</p>
          <p className="text-xs text-muted-foreground mt-2">{alert.timestamp}</p>
        </div>
      </div>
    </div>
  )
}

const EmptyState: FC = () => (
  <div className="text-center py-12">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
      <i className="ph ph-bell-slash text-3xl text-muted-foreground" />
    </div>
    <h4 className="font-medium mb-1">Nenhum alerta no momento</h4>
    <p className="text-sm text-muted-foreground">
      Quando houver alertas importantes, eles aparecerão aqui
    </p>
  </div>
)

const LoadingSkeleton: FC = () => (
  <div className="space-y-3">
    {[1, 2, 3].map(i => (
      <div key={i} className="p-4 rounded-lg border bg-card">
        <div className="flex gap-3">
          {/* Icon skeleton */}
          <div className="flex-shrink-0">
            <div className="w-6 h-6 rounded-full bg-muted animate-pulse" />
          </div>

          {/* Content skeleton */}
          <div className="flex-1 space-y-2.5">
            {/* Title */}
            <div
              className="h-4 bg-muted animate-pulse rounded"
              style={{
                width: `${60 + i * 10}%`,
                animationDelay: `${i * 100}ms`,
              }}
            />
            {/* Message */}
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-muted/70 animate-pulse rounded" />
              <div
                className="h-3 bg-muted/70 animate-pulse rounded"
                style={{
                  width: `${70 - i * 10}%`,
                  animationDelay: `${i * 100 + 50}ms`,
                }}
              />
            </div>
            {/* Timestamp */}
            <div
              className="h-2.5 w-20 bg-muted/50 animate-pulse rounded"
              style={{ animationDelay: `${i * 100 + 100}ms` }}
            />
          </div>
        </div>
      </div>
    ))}
  </div>
)

export const AlertsSection: FC<AlertsSectionProps> = ({ alerts = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-6">
          <div className="h-5 w-32 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        </div>
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <i className="ph ph-bell text-xl" />
          <h3 className="text-lg font-semibold">Alertas e Notificações</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Acompanhe eventos importantes da plataforma
        </p>
      </div>

      {alerts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  )
}
