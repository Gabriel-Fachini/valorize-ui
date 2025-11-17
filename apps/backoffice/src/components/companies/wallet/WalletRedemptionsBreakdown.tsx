import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CompanyWalletStatus } from '@/types/company'

interface WalletRedemptionsBreakdownProps {
  wallet: CompanyWalletStatus
}

export function WalletRedemptionsBreakdown({ wallet }: WalletRedemptionsBreakdownProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const redemptions = wallet.totalRedemptions ?? { vouchers: 0, products: 0 }
  const totalRedemptions = redemptions.vouchers + redemptions.products
  const averageTicket = totalRedemptions > 0 ? wallet.totalSpent / totalRedemptions : 0

  const vouchersPercentage =
    totalRedemptions > 0 ? (redemptions.vouchers / totalRedemptions) * 100 : 0
  const productsPercentage =
    totalRedemptions > 0 ? (redemptions.products / totalRedemptions) * 100 : 0

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Financial Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="ph ph-chart-line" style={{ fontSize: '1.25rem' }} />
            Resumo Financeiro
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Total Depositado</span>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(wallet.totalDeposited)}
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Total Gasto</span>
              <p className="text-xl font-bold text-red-600">
                {formatCurrency(wallet.totalSpent)}
              </p>
            </div>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">Saldo Disponível</span>
            <p className="text-2xl font-bold">{formatCurrency(wallet.balance)}</p>
          </div>

          {wallet.overdraftLimit > 0 && (
            <div>
              <span className="text-sm text-muted-foreground">Limite de Descoberto</span>
              <p className="text-lg font-semibold text-blue-600">
                {formatCurrency(wallet.overdraftLimit)}
              </p>
            </div>
          )}

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Utilização</span>
              <span>
                {wallet.totalDeposited > 0
                  ? ((wallet.totalSpent / wallet.totalDeposited) * 100).toFixed(1)
                  : 0}
                %
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-red-500 transition-all"
                style={{
                  width: `${wallet.totalDeposited > 0 ? Math.min((wallet.totalSpent / wallet.totalDeposited) * 100, 100) : 0}%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Redemptions Analysis Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="ph ph-gift" style={{ fontSize: '1.25rem' }} />
            Análise de Resgates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="text-sm text-muted-foreground">Total de Resgates</span>
            <p className="text-2xl font-bold">{totalRedemptions.toLocaleString('pt-BR')}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Vouchers</span>
              <p className="text-xl font-bold text-purple-600">
                {redemptions.vouchers.toLocaleString('pt-BR')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {vouchersPercentage.toFixed(1)}% do total
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Produtos</span>
              <p className="text-xl font-bold text-blue-600">
                {redemptions.products.toLocaleString('pt-BR')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {productsPercentage.toFixed(1)}% do total
              </p>
            </div>
          </div>

          {/* Redemptions Bar Chart */}
          {totalRedemptions > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground mb-1">Distribuição</div>
              <div className="flex h-8 w-full rounded-full overflow-hidden">
                {redemptions.vouchers > 0 && (
                  <div
                    className="bg-purple-500 flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${vouchersPercentage}%` }}
                  >
                    {vouchersPercentage > 15 && `${vouchersPercentage.toFixed(0)}%`}
                  </div>
                )}
                {redemptions.products > 0 && (
                  <div
                    className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${productsPercentage}%` }}
                  >
                    {productsPercentage > 15 && `${productsPercentage.toFixed(0)}%`}
                  </div>
                )}
              </div>
              <div className="flex justify-between text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-purple-500" />
                  <span className="text-muted-foreground">Vouchers</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-blue-500" />
                  <span className="text-muted-foreground">Produtos</span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 border-t">
            <span className="text-sm text-muted-foreground">Ticket Médio</span>
            <p className="text-xl font-bold text-green-600">{formatCurrency(averageTicket)}</p>
            <p className="text-xs text-muted-foreground mt-1">Por resgate</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
