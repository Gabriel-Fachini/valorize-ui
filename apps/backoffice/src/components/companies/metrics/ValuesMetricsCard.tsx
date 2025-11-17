import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CompanyMetrics } from '@/types/company'
import { formatNumber, formatPercentage } from '@/utils/formatters'

interface ValuesMetricsCardProps {
  values: CompanyMetrics['values']
}

export function ValuesMetricsCard({ values }: ValuesMetricsCardProps) {
  const activePercentage = values.total > 0 ? (values.active / values.total) * 100 : 0
  const inactiveCount = values.total - values.active

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <i className="ph ph-star text-muted-foreground" style={{ fontSize: '1.25rem' }} />
          Valores da Empresa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Values */}
        <div className="flex items-center justify-between pb-3 border-b">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total de Valores</p>
            <p className="text-3xl font-bold">{formatNumber(values.total)}</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
            <i className="ph ph-heart text-blue-600 dark:text-blue-500" style={{ fontSize: '2rem' }} />
          </div>
        </div>

        {/* Active Values */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-600 dark:bg-green-500" />
              <span className="text-sm font-medium">Valores Ativos</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-green-600 dark:text-green-500">{formatNumber(values.active)}</span>
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

        {/* Inactive Values (if any) */}
        {inactiveCount > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gray-400 dark:bg-gray-500" />
                <span className="text-sm font-medium">Valores Inativos</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{formatNumber(inactiveCount)}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({formatPercentage(100 - activePercentage)})
                </span>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full bg-gray-400 dark:bg-gray-500 transition-all"
                style={{ width: `${100 - activePercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="pt-3 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <i className="ph ph-info" style={{ fontSize: '1rem' }} />
            <span>
              {values.total === 0
                ? 'Nenhum valor cadastrado'
                : values.active === values.total
                  ? 'Todos os valores estão ativos'
                  : `${formatNumber(values.active)} de ${formatNumber(values.total)} valores ativos`}
            </span>
          </div>
        </div>

        {/* Status Indicator */}
        {values.total > 0 && (
          <div className="pt-3 border-t">
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              activePercentage === 100
                ? 'bg-green-50 dark:bg-green-950/30'
                : activePercentage >= 80
                  ? 'bg-blue-50 dark:bg-blue-950/30'
                  : 'bg-yellow-50 dark:bg-yellow-950/30'
            }`}>
              <i
                className={`ph ph-check-circle ${
                  activePercentage === 100
                    ? 'text-green-600 dark:text-green-500'
                    : activePercentage >= 80
                      ? 'text-blue-600 dark:text-blue-500'
                      : 'text-yellow-600 dark:text-yellow-500'
                }`}
                style={{ fontSize: '1.25rem' }}
              />
              <span className={`text-sm font-medium ${
                activePercentage === 100
                  ? 'text-green-700 dark:text-green-400'
                  : activePercentage >= 80
                    ? 'text-blue-700 dark:text-blue-400'
                    : 'text-yellow-700 dark:text-yellow-400'
              }`}>
                {activePercentage === 100
                  ? 'Configuração completa'
                  : activePercentage >= 80
                    ? 'Boa configuração'
                    : 'Revisar valores inativos'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
