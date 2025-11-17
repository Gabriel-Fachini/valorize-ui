import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { CompanyMetrics } from '@/types/company'
import { formatNumber, formatPercentage } from '@/utils/formatters'

interface MetricsOverviewCardsProps {
  metrics: CompanyMetrics
}

export function MetricsOverviewCards({ metrics }: MetricsOverviewCardsProps) {
  // Calculate derived metrics
  const totalCompliments = metrics.compliments.sent + metrics.compliments.received
  const activeUserPercentage = metrics.users.total > 0
    ? (metrics.users.active / metrics.users.total) * 100
    : 0

  // Get engagement status
  const getEngagementStatus = (rate: number) => {
    if (rate >= 70) return { color: 'text-green-600 dark:text-green-500', label: 'Excelente', variant: 'default' as const }
    if (rate >= 40) return { color: 'text-yellow-600 dark:text-yellow-500', label: 'Bom', variant: 'secondary' as const }
    return { color: 'text-red-600 dark:text-red-500', label: 'Atenção', variant: 'destructive' as const }
  }

  const getWAUStatus = () => {
    const wauPercentage = metrics.users.total > 0
      ? (metrics.engagement.WAU / metrics.users.total) * 100
      : 0

    if (wauPercentage >= 60) return { color: 'text-green-600 dark:text-green-500', label: 'Ótimo' }
    if (wauPercentage >= 30) return { color: 'text-yellow-600 dark:text-yellow-500', label: 'Moderado' }
    return { color: 'text-red-600 dark:text-red-500', label: 'Baixo' }
  }

  const engagementStatus = getEngagementStatus(metrics.engagement.complimentUsageRate)
  const wauStatus = getWAUStatus()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Card 1: Total Users */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Total de Usuários</span>
            <i className="ph ph-users text-muted-foreground" style={{ fontSize: '1.25rem' }} />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{formatNumber(metrics.users.total)}</p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1">
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full bg-green-600 dark:bg-green-500 transition-all"
                  style={{ width: `${activeUserPercentage}%` }}
                />
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatPercentage(activeUserPercentage)} ativos
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {formatNumber(metrics.users.active)} ativos · {formatNumber(metrics.users.inactive)} inativos
          </p>
        </CardContent>
      </Card>

      {/* Card 2: Weekly Active Users (WAU) */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">WAU</span>
            <i className="ph ph-chart-line-up text-muted-foreground" style={{ fontSize: '1.25rem' }} />
          </div>
          <div className="flex items-baseline gap-2">
            <p className={`text-2xl font-bold ${wauStatus.color}`}>
              {formatNumber(metrics.engagement.WAU)}
            </p>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {wauStatus.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Usuários ativos semanalmente
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Total Compliments */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Complimentos</span>
            <i className="ph ph-chat-circle-text text-muted-foreground" style={{ fontSize: '1.25rem' }} />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-500">
              {formatNumber(totalCompliments)}
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {formatNumber(metrics.compliments.sent)} enviados · {formatNumber(metrics.compliments.received)} recebidos
          </p>
        </CardContent>
      </Card>

      {/* Card 4: Engagement Rate */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Taxa de Engajamento</span>
            <i className="ph ph-activity text-muted-foreground" style={{ fontSize: '1.25rem' }} />
          </div>
          <div className="flex items-baseline gap-2">
            <p className={`text-2xl font-bold ${engagementStatus.color}`}>
              {formatPercentage(metrics.engagement.complimentUsageRate)}
            </p>
          </div>
          <div className="mt-2">
            <Badge variant={engagementStatus.variant} className="text-xs">
              {engagementStatus.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Uso de complimentos
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
