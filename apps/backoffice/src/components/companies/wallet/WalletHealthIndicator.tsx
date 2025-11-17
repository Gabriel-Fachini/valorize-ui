import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { CompanyWalletStatus } from '@/types/company'

interface WalletHealthIndicatorProps {
  wallet: CompanyWalletStatus
}

type HealthStatus = 'excellent' | 'good' | 'attention' | 'critical' | 'frozen'

export function WalletHealthIndicator({ wallet }: WalletHealthIndicatorProps) {
  const calculateHealthStatus = (): HealthStatus => {
    if (wallet.isFrozen) {
      return 'frozen'
    }

    // Se coverageIndex é null, significa que não há consumo (burnRate = 0)
    // Nesse caso, se há saldo positivo, está excelente (duração infinita)
    if (wallet.coverageIndex === null || wallet.coverageIndex === undefined) {
      if (wallet.balance > 0) {
        return 'excellent'
      }
      return 'critical'
    }

    const burnRate = wallet.burnRate ?? 0

    if (wallet.coverageIndex < 1 || wallet.balance < burnRate) {
      return 'critical'
    }

    if (wallet.coverageIndex >= 6 && wallet.balance > burnRate * 6) {
      return 'excellent'
    }

    if (wallet.coverageIndex >= 3 && wallet.balance > burnRate * 3) {
      return 'good'
    }

    return 'attention'
  }

  const healthStatus = calculateHealthStatus()

  const statusConfig = {
    excellent: {
      icon: 'ph-check-circle',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      title: 'EXCELENTE',
      titleColor: 'text-green-700',
      message:
        wallet.coverageIndex === null || wallet.coverageIndex === undefined
          ? 'A carteira está saudável com saldo positivo e sem consumo ativo.'
          : 'A carteira está saudável com cobertura superior a 6 meses.',
      recommendations: [
        'Continue monitorando o uso de créditos',
        'Considere estratégias de engajamento',
      ],
    },
    good: {
      icon: 'ph-thumbs-up',
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      title: 'BOM',
      titleColor: 'text-green-600',
      message: 'A carteira tem uma boa cobertura de 3-6 meses.',
      recommendations: [
        'Monitore o burn rate mensalmente',
        'Planeje adições futuras de crédito',
      ],
    },
    attention: {
      icon: 'ph-warning',
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      title: 'ATENÇÃO',
      titleColor: 'text-yellow-700',
      message: 'Saldo baixo. Recomendamos adicionar créditos para evitar interrupções.',
      recommendations: [
        'Adicione créditos em breve',
        'Revise o padrão de consumo',
        'Considere ajustar limites de gastos',
      ],
    },
    critical: {
      icon: 'ph-x-circle',
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      title: 'CRÍTICO',
      titleColor: 'text-red-700',
      message: 'Carteira em estado crítico! O saldo pode esgotar em menos de 30 dias.',
      recommendations: [
        'URGENTE: Adicione créditos imediatamente',
        'Considere congelar temporariamente para avaliar gastos',
        'Revise o plano de benefícios da empresa',
      ],
    },
    frozen: {
      icon: 'ph-snowflake',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      title: 'CONGELADA',
      titleColor: 'text-blue-700',
      message: 'Carteira congelada. Os colaboradores não podem resgatar prêmios.',
      recommendations: [
        'Descongele a carteira quando apropriado',
        'Verifique se há créditos suficientes',
        'Comunique o status aos colaboradores',
      ],
    },
  }

  const config = statusConfig[healthStatus]

  return (
    <Card className={`${config.borderColor} border-2`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <i className="ph ph-heart-straight" style={{ fontSize: '1.25rem' }} />
          Saúde da Carteira
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Status Indicator */}
          <div className={`${config.bgColor} rounded-lg p-6`}>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="rounded-full bg-white p-3 shadow-sm">
                  <i
                    className={`ph-fill ${config.icon} ${config.iconColor}`}
                    style={{ fontSize: '2rem' }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className={`text-2xl font-bold ${config.titleColor}`}>
                  {config.title}
                </h3>
                <p className="text-sm text-gray-700 mt-1">{config.message}</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Recomendações:</h4>
            <ul className="space-y-1">
              {config.recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <i
                    className="ph ph-dot text-lg flex-shrink-0 mt-0.5"
                    style={{ fontSize: '0.75rem' }}
                  />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Info */}
          {wallet.isFrozen && (
            <Alert variant="destructive">
              <AlertDescription className="text-sm flex items-center gap-2">
                <i className="ph ph-info" style={{ fontSize: '1rem' }} />
                <span>
                  Enquanto a carteira estiver congelada, nenhum colaborador poderá resgatar
                  vouchers ou produtos.
                </span>
              </AlertDescription>
            </Alert>
          )}

          {healthStatus === 'critical' && !wallet.isFrozen && (
            <Alert variant="destructive">
              <AlertDescription className="text-sm flex items-center gap-2">
                <i className="ph ph-warning" style={{ fontSize: '1rem' }} />
                <span>
                  Ação urgente necessária! Adicione créditos para manter os benefícios ativos.
                </span>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
