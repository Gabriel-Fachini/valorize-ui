import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { CompanyMetrics } from '@/types/company'
import { formatNumber, formatDateRange } from '@/utils/formatters'

interface ComplimentsBreakdownProps {
  compliments: CompanyMetrics['compliments']
}

export function ComplimentsBreakdown({ compliments }: ComplimentsBreakdownProps) {
  const totalCompliments = compliments.sent + compliments.received
  const sentPercentage = totalCompliments > 0 ? (compliments.sent / totalCompliments) * 100 : 50
  const receivedPercentage = totalCompliments > 0 ? (compliments.received / totalCompliments) * 100 : 50

  // Period data (if available)
  const hasPeriodData = !!compliments.period
  const periodTotal = hasPeriodData
    ? (compliments.period!.sent + compliments.period!.received)
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <i className="ph ph-chat-circle-text text-muted-foreground" style={{ fontSize: '1.25rem' }} />
          Breakdown de Complimentos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Geral</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-500">{formatNumber(totalCompliments)}</p>
            <p className="text-xs text-muted-foreground mt-1">Complimentos</p>
          </div>

          <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">Enviados</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-500">{formatNumber(compliments.sent)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {sentPercentage.toFixed(1)}% do total
            </p>
          </div>

          <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">Recebidos</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-500">{formatNumber(compliments.received)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {receivedPercentage.toFixed(1)}% do total
            </p>
          </div>
        </div>

        {/* Visual Distribution */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Distribuição</span>
            <span className="text-xs text-muted-foreground">
              Enviados vs Recebidos
            </span>
          </div>
          <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex">
            <div
              className="bg-green-600 dark:bg-green-500 transition-all"
              style={{ width: `${sentPercentage}%` }}
              title={`Enviados: ${formatNumber(compliments.sent)}`}
            />
            <div
              className="bg-purple-600 dark:bg-purple-500 transition-all"
              style={{ width: `${receivedPercentage}%` }}
              title={`Recebidos: ${formatNumber(compliments.received)}`}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-600 dark:bg-green-500" />
              <span className="text-xs text-muted-foreground">Enviados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-purple-600 dark:bg-purple-500" />
              <span className="text-xs text-muted-foreground">Recebidos</span>
            </div>
          </div>
        </div>

        {/* Period Comparison (if available) */}
        {hasPeriodData && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Período Específico</span>
              <Badge variant="outline">
                {formatDateRange(compliments.period!.startDate, compliments.period!.endDate)}
              </Badge>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-lg font-bold">{formatNumber(periodTotal)}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">Enviados</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-500">
                  {formatNumber(compliments.period!.sent)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">Recebidos</span>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-500">
                  {formatNumber(compliments.period!.received)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Balance Indicator */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <i className="ph ph-info" style={{ fontSize: '1rem' }} />
            <span>
              {sentPercentage === receivedPercentage
                ? 'Distribuição equilibrada de complimentos'
                : sentPercentage > receivedPercentage
                  ? 'Mais complimentos enviados do que recebidos'
                  : 'Mais complimentos recebidos do que enviados'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
