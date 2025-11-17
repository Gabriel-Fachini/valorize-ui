import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CompanyMetrics } from '@/types/company'
import { formatNumber, formatPercentage } from '@/utils/formatters'

interface UsersMetricsCardProps {
  users: CompanyMetrics['users']
}

export function UsersMetricsCard({ users }: UsersMetricsCardProps) {
  const activePercentage = users.total > 0 ? (users.active / users.total) * 100 : 0
  const inactivePercentage = users.total > 0 ? (users.inactive / users.total) * 100 : 0

  // Determine health status
  const getHealthStatus = () => {
    if (activePercentage >= 80) return { color: 'text-green-600 dark:text-green-500', bgColor: 'bg-green-600 dark:bg-green-500', label: 'Excelente' }
    if (activePercentage >= 60) return { color: 'text-green-500 dark:text-green-400', bgColor: 'bg-green-500 dark:bg-green-400', label: 'Bom' }
    if (activePercentage >= 40) return { color: 'text-yellow-600 dark:text-yellow-500', bgColor: 'bg-yellow-600 dark:bg-yellow-500', label: 'Moderado' }
    return { color: 'text-red-600 dark:text-red-500', bgColor: 'bg-red-600 dark:bg-red-500', label: 'Crítico' }
  }

  const healthStatus = getHealthStatus()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <i className="ph ph-users text-muted-foreground" style={{ fontSize: '1.25rem' }} />
          Métricas de Usuários
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Users */}
        <div className="flex items-center justify-between pb-3 border-b">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total de Usuários</p>
            <p className="text-3xl font-bold">{formatNumber(users.total)}</p>
          </div>
          <div className="text-right">
            <span className={`text-sm font-semibold ${healthStatus.color}`}>
              {healthStatus.label}
            </span>
          </div>
        </div>

        {/* Active Users */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-600 dark:bg-green-500" />
              <span className="text-sm font-medium">Usuários Ativos</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold">{formatNumber(users.active)}</span>
              <span className="text-xs text-muted-foreground ml-2">
                ({formatPercentage(activePercentage)})
              </span>
            </div>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div
              className="h-full bg-green-600 dark:bg-green-500 transition-all"
              style={{ width: `${activePercentage}%` }}
            />
          </div>
        </div>

        {/* Inactive Users */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-400 dark:bg-gray-500" />
              <span className="text-sm font-medium">Usuários Inativos</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold">{formatNumber(users.inactive)}</span>
              <span className="text-xs text-muted-foreground ml-2">
                ({formatPercentage(inactivePercentage)})
              </span>
            </div>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div
              className="h-full bg-gray-400 dark:bg-gray-500 transition-all"
              style={{ width: `${inactivePercentage}%` }}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="pt-3 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <i className="ph ph-info" style={{ fontSize: '1rem' }} />
            <span>
              Base de usuários com {formatPercentage(activePercentage)} de ativação
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
