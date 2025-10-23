import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RedemptionStatusBadge } from './RedemptionStatusBadge'
import { getStatusInfo } from '@/lib/redemptionStatusConfig'
import { formatCoinsAmount } from '@/lib/redemptionUtils'
import type { Redemption } from '@/types/redemption.types'

interface RedemptionActionCardProps {
  redemption: Redemption
  canCancel: boolean
  onCancelClick: () => void
  className?: string
}

export const RedemptionActionCard: React.FC<RedemptionActionCardProps> = ({
  redemption,
  canCancel,
  onCancelClick,
  className,
}) => {
  const statusInfo = getStatusInfo(redemption.status)

  return (
    <Card className={`border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 h-fit ${className}`}>
      <CardHeader className="bg-white dark:bg-neutral-900">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-xl">
            <i className="ph-bold ph-lightning text-2xl text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-xl">Ações Rápidas</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 bg-white dark:bg-neutral-900">
        {/* Summary Card */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">
            Resumo do Pedido
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-neutral-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status Atual</span>
              <RedemptionStatusBadge 
                status={redemption.status}
                size="md"
                showIcon={true}
              />
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-neutral-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Valor Total</span>
              <span className="text-base font-bold text-red-600 dark:text-red-400">
                -{formatCoinsAmount(redemption.coinsSpent)} moedas
              </span>
            </div>
            
            {redemption.trackingCode && (
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Código de Rastreio</span>
                <code className="text-sm font-mono font-bold text-green-600 dark:text-green-400">
                  {redemption.trackingCode}
                </code>
              </div>
            )}
          </div>
        </div>
        
        {/* Cancel Button or Info */}
        {canCancel ? (
          <div className="space-y-3">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex gap-3">
                <i className="ph-bold ph-info text-lg text-blue-600 dark:text-blue-400 shrink-0" />
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  Você pode cancelar este resgate dentro de 24 horas. O valor será devolvido ao seu saldo.
                </p>
              </div>
            </div>
            
            <Button
              onClick={onCancelClick}
              variant="outline"
              size="lg"
              className="w-full font-semibold text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <i className="ph-bold ph-x-circle text-lg mr-2" />
              Cancelar Resgate
            </Button>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-5 text-center space-y-3">
            <div className="inline-flex p-3 bg-gray-200 dark:bg-neutral-700 rounded-full">
              <i className="ph-bold ph-lock text-2xl text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                Cancelamento Indisponível
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {redemption.status === 'completed' || redemption.status === 'delivered' || redemption.status === 'cancelled'
                  ? 'Este resgate já foi finalizado'
                  : 'O prazo de 24 horas para cancelamento expirou'
                }
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
