import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CompanyMetrics } from '@/types/company'
import { formatNumber, formatCurrency } from '@/utils/formatters'

interface RedemptionsBreakdownProps {
  redemptions: CompanyMetrics['redemptions']
}

export function RedemptionsBreakdown({ redemptions }: RedemptionsBreakdownProps) {
  const vouchersPercentage = redemptions.total > 0
    ? (redemptions.vouchers / redemptions.total) * 100
    : 0
  const productsPercentage = redemptions.total > 0
    ? (redemptions.products / redemptions.total) * 100
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <i className="ph ph-gift text-muted-foreground" style={{ fontSize: '1.25rem' }} />
          Breakdown de Resgates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">Total de Resgates</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-500">{formatNumber(redemptions.total)}</p>
            <p className="text-xs text-muted-foreground mt-1">Todos os tipos</p>
          </div>

          <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">Vouchers</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-500">{formatNumber(redemptions.vouchers)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {vouchersPercentage.toFixed(1)}% do total
            </p>
          </div>

          <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">Produtos</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-500">{formatNumber(redemptions.products)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {productsPercentage.toFixed(1)}% do total
            </p>
          </div>
        </div>

        {/* Visual Distribution */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Distribuição por Tipo</span>
            <span className="text-xs text-muted-foreground">
              Vouchers vs Produtos
            </span>
          </div>
          <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex">
            <div
              className="bg-green-600 dark:bg-green-500 transition-all"
              style={{ width: `${vouchersPercentage}%` }}
              title={`Vouchers: ${formatNumber(redemptions.vouchers)}`}
            />
            <div
              className="bg-purple-600 dark:bg-purple-500 transition-all"
              style={{ width: `${productsPercentage}%` }}
              title={`Produtos: ${formatNumber(redemptions.products)}`}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-600 dark:bg-green-500" />
              <span className="text-xs text-muted-foreground">
                Vouchers ({formatNumber(redemptions.vouchers)})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-purple-600 dark:bg-purple-500" />
              <span className="text-xs text-muted-foreground">
                Produtos ({formatNumber(redemptions.products)})
              </span>
            </div>
          </div>
        </div>

        {/* Average Ticket */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/50">
                <i className="ph ph-coins text-orange-600 dark:text-orange-500" style={{ fontSize: '1.5rem' }} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ticket Médio</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-500">
                  {formatCurrency(redemptions.averageTicket)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Por resgate</p>
              <p className="text-sm font-medium text-muted-foreground">
                {redemptions.total > 0
                  ? `${formatNumber(redemptions.total)} resgates`
                  : 'Sem resgates'}
              </p>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <i className="ph ph-info" style={{ fontSize: '1rem' }} />
            <span>
              {redemptions.total === 0
                ? 'Nenhum resgate registrado ainda'
                : vouchersPercentage > productsPercentage
                  ? `Usuários preferem vouchers (${vouchersPercentage.toFixed(0)}% dos resgates)`
                  : productsPercentage > vouchersPercentage
                    ? `Usuários preferem produtos (${productsPercentage.toFixed(0)}% dos resgates)`
                    : 'Distribuição equilibrada entre vouchers e produtos'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
