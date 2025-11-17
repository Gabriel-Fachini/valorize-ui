import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { CompanyWalletStatus } from '@/types/company'

interface WalletMetricsCardsProps {
  wallet: CompanyWalletStatus
}

export function WalletMetricsCards({ wallet }: WalletMetricsCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Calculate status colors based on wallet health
  const getBalanceStatus = () => {
    if (wallet.isFrozen) return 'frozen'
    const burnRate = wallet.burnRate ?? 0
    if (wallet.balance <= burnRate) return 'critical'
    if (wallet.balance <= burnRate * 3) return 'warning'
    return 'healthy'
  }

  const getCoverageStatus = () => {
    // Se coverageIndex é null, significa sem consumo (cobertura infinita)
    if (wallet.coverageIndex === null || wallet.coverageIndex === undefined) {
      return wallet.balance > 0 ? 'excellent' : 'critical'
    }
    if (wallet.coverageIndex < 1) return 'critical'
    if (wallet.coverageIndex < 3) return 'warning'
    if (wallet.coverageIndex < 6) return 'good'
    return 'excellent'
  }

  const getDepletionStatus = () => {
    if (!wallet.projectedDepletion) return 'none'
    const daysUntil = getDaysUntil(wallet.projectedDepletion)
    if (daysUntil < 30) return 'critical'
    if (daysUntil < 60) return 'warning'
    if (daysUntil < 180) return 'caution'
    return 'good'
  }

  const balanceStatus = getBalanceStatus()
  const coverageStatus = getCoverageStatus()
  const depletionStatus = getDepletionStatus()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Card 1: Current Balance */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Saldo Atual</span>
            <i className="ph ph-wallet text-muted-foreground" style={{ fontSize: '1.25rem' }} />
          </div>
          <div className="flex items-baseline gap-2">
            <p
              className={`text-2xl font-bold ${
                balanceStatus === 'frozen'
                  ? 'text-blue-600'
                  : balanceStatus === 'critical'
                    ? 'text-red-600'
                    : balanceStatus === 'warning'
                      ? 'text-yellow-600'
                      : 'text-green-600'
              }`}
            >
              {formatCurrency(wallet.balance)}
            </p>
          </div>
          {wallet.isFrozen && (
            <Badge variant="destructive" className="mt-2">
              <i className="ph ph-snowflake mr-1" style={{ fontSize: '0.75rem' }} />
              Congelada
            </Badge>
          )}
          {!wallet.isFrozen && balanceStatus === 'critical' && (
            <p className="text-xs text-red-600 mt-2">Saldo crítico!</p>
          )}
          {!wallet.isFrozen && balanceStatus === 'warning' && (
            <p className="text-xs text-yellow-600 mt-2">Saldo baixo</p>
          )}
        </CardContent>
      </Card>

      {/* Card 2: Burn Rate */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Taxa de Queima</span>
            <i className="ph ph-flame text-orange-500" style={{ fontSize: '1.25rem' }} />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{formatCurrency(wallet.burnRate ?? 0)}</p>
            <span className="text-sm text-muted-foreground">/mês</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Gasto médio mensal</p>
        </CardContent>
      </Card>

      {/* Card 3: Coverage Index */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Cobertura</span>
            <i className="ph ph-shield-check text-muted-foreground" style={{ fontSize: '1.25rem' }} />
          </div>
          <div className="flex items-baseline gap-2">
            <p
              className={`text-2xl font-bold ${
                coverageStatus === 'critical'
                  ? 'text-red-600'
                  : coverageStatus === 'warning'
                    ? 'text-yellow-600'
                    : coverageStatus === 'good'
                      ? 'text-green-500'
                      : 'text-green-600'
              }`}
            >
              {wallet.coverageIndex === null || wallet.coverageIndex === undefined
                ? '∞'
                : wallet.coverageIndex.toFixed(1)}
            </p>
            {wallet.coverageIndex !== null && wallet.coverageIndex !== undefined && (
              <span className="text-sm text-muted-foreground">
                {wallet.coverageIndex === 1 ? 'mês' : 'meses'}
              </span>
            )}
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className={`h-full transition-all ${
                coverageStatus === 'critical'
                  ? 'bg-red-600'
                  : coverageStatus === 'warning'
                    ? 'bg-yellow-500'
                    : coverageStatus === 'good'
                      ? 'bg-green-500'
                      : 'bg-green-600'
              }`}
              style={{
                width:
                  wallet.coverageIndex === null || wallet.coverageIndex === undefined
                    ? '100%'
                    : `${Math.min((wallet.coverageIndex / 12) * 100, 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {coverageStatus === 'excellent' &&
              (wallet.coverageIndex === null || wallet.coverageIndex === undefined
                ? 'Sem consumo ativo'
                : 'Excelente cobertura')}
            {coverageStatus === 'good' && 'Boa cobertura'}
            {coverageStatus === 'warning' && 'Atenção necessária'}
            {coverageStatus === 'critical' && 'Cobertura crítica'}
          </p>
        </CardContent>
      </Card>

      {/* Card 4: Projected Depletion */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Projeção</span>
            <i
              className={`ph ph-calendar-x ${depletionStatus === 'critical' ? 'text-red-500' : depletionStatus === 'warning' ? 'text-yellow-500' : 'text-muted-foreground'}`}
              style={{ fontSize: '1.25rem' }}
            />
          </div>
          {wallet.projectedDepletion ? (
            <>
              <div className="flex items-baseline gap-2">
                <p
                  className={`text-2xl font-bold ${
                    depletionStatus === 'critical'
                      ? 'text-red-600'
                      : depletionStatus === 'warning'
                        ? 'text-yellow-600'
                        : depletionStatus === 'caution'
                          ? 'text-yellow-500'
                          : 'text-green-600'
                  }`}
                >
                  {getDaysUntil(wallet.projectedDepletion)}
                </p>
                <span className="text-sm text-muted-foreground">dias</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {formatDate(wallet.projectedDepletion)}
              </p>
              {depletionStatus === 'critical' && (
                <p className="text-xs text-red-600 mt-1 font-medium">
                  Esgotamento iminente!
                </p>
              )}
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-green-600">∞</p>
              <p className="text-xs text-muted-foreground mt-2">
                Saldo estável
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
