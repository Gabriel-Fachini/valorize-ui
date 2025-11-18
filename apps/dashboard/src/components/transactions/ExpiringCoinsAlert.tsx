/**
 * ExpiringCoinsAlert Component
 * Displays information about coins that will expire soon
 */

import { ExpiringCoins } from '@/types/compliments'
import { cn } from '@/lib/utils'

interface ExpiringCoinsAlertProps {
  expiringCoins?: ExpiringCoins
  className?: string
}

export const ExpiringCoinsAlert = ({
  expiringCoins,
  className
}: ExpiringCoinsAlertProps) => {
  // Use default values if no data available yet
  const next30Days = expiringCoins?.next30Days ?? 0
  const next90Days = expiringCoins?.next90Days ?? 0
  const urgentExpiration = expiringCoins?.urgentExpiration ?? false
  const totalExpiring = next30Days + next90Days
  const hasExpiringCoins = totalExpiring > 0

  // Determine styling based on state
  const isUrgent = hasExpiringCoins && (urgentExpiration || next30Days > 0)
  const isInfo = !hasExpiringCoins

  const bgGradient = isUrgent
    ? 'from-amber-500/20 to-orange-500/20 dark:from-amber-500/10 dark:to-orange-500/10'
    : isInfo
    ? 'from-gray-500/10 to-gray-600/10 dark:from-gray-500/5 dark:to-gray-600/5'
    : 'from-blue-500/20 to-blue-600/20 dark:from-blue-500/10 dark:to-blue-600/10'

  const borderColor = isUrgent
    ? 'border-amber-400/30 dark:border-amber-500/20'
    : isInfo
    ? 'border-gray-400/20 dark:border-gray-500/20'
    : 'border-blue-400/30 dark:border-blue-500/20'

  const iconColor = isUrgent
    ? 'text-amber-600 dark:text-amber-400'
    : isInfo
    ? 'text-gray-600 dark:text-gray-400'
    : 'text-blue-600 dark:text-blue-400'

  const textColor = isUrgent
    ? 'text-amber-900 dark:text-amber-100'
    : isInfo
    ? 'text-gray-900 dark:text-gray-100'
    : 'text-blue-900 dark:text-blue-100'

  const subTextColor = isUrgent
    ? 'text-amber-700 dark:text-amber-300'
    : isInfo
    ? 'text-gray-700 dark:text-gray-300'
    : 'text-blue-700 dark:text-blue-300'

  return (
    <div
      className={cn(
        'bg-gradient-to-r backdrop-blur-xl border rounded-xl p-4 shadow-sm',
        bgGradient,
        borderColor,
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn(
          'flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0',
          isUrgent
            ? 'bg-amber-100 dark:bg-amber-900/30'
            : isInfo
            ? 'bg-gray-100 dark:bg-gray-900/30'
            : 'bg-blue-100 dark:bg-blue-900/30'
        )}>
          <i
            className={cn(
              'ph-duotone',
              isUrgent ? 'ph-warning' : isInfo ? 'ph-info' : 'ph-clock',
              iconColor
            )}
            style={{ fontSize: '20px' }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Main message */}
          <div className="flex items-center gap-2 mb-1">
            <h4 className={cn('text-sm font-semibold', textColor)}>
              {hasExpiringCoins ? (
                <>
                  {totalExpiring.toLocaleString('pt-BR')} {totalExpiring === 1 ? 'moeda expirando' : 'moedas expirando'}
                </>
              ) : (
                'Sobre a expiração de moedas'
              )}
            </h4>
            {isUrgent && (
              <span className={cn(
                'px-2 py-0.5 text-xs font-medium rounded-full',
                'bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200'
              )}>
                Urgente
              </span>
            )}
          </div>

          {/* Breakdown or Info message */}
          {hasExpiringCoins ? (
            <div className={cn('text-xs space-y-0.5', subTextColor)}>
              {next30Days > 0 && (
                <p className="flex items-center gap-1.5">
                  <i className="ph ph-calendar-dots" style={{ fontSize: '14px' }} />
                  <span>
                    <strong>{next30Days.toLocaleString('pt-BR')}</strong> nos próximos 30 dias
                  </span>
                </p>
              )}
              {next90Days > 0 && (
                <p className="flex items-center gap-1.5">
                  <i className="ph ph-calendar" style={{ fontSize: '14px' }} />
                  <span>
                    <strong>{next90Days.toLocaleString('pt-BR')}</strong> nos próximos 90 dias
                  </span>
                </p>
              )}
            </div>
          ) : (
            <p className={cn('text-xs', subTextColor)}>
              Suas moedas estão seguras! Nenhuma moeda expirará nos próximos 90 dias.
            </p>
          )}

          {/* Helper text */}
          <p className={cn('text-xs mt-2', subTextColor)}>
            {hasExpiringCoins ? (
              'As moedas expiram após 18 meses do crédito. Resgate prêmios antes do vencimento.'
            ) : (
              'Lembre-se: as moedas expiram após 18 meses do crédito. Fique atento!'
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
