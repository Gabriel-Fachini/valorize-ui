import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CANCEL_WINDOW_MS } from '@/lib/redemptionUtils'
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
  // Calculate remaining time for cancellation
  const getRemainingCancelTime = (): string | null => {
    if (!canCancel) return null
    
    const created = new Date(redemption.redeemedAt).getTime()
    const now = Date.now()
    const remaining = CANCEL_WINDOW_MS - (now - created)
    
    if (remaining <= 0) return null
    
    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}min restantes`
    }
    return `${minutes} minutos restantes`
  }

  const remainingTime = getRemainingCancelTime()

  return (
    <Card className={`border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 h-fit ${className}`}>
      <CardHeader className="bg-white dark:bg-neutral-900">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 dark:bg-purple-950 rounded-xl">
            <i className="ph-bold ph-package text-2xl text-purple-600 dark:text-purple-400" />
          </div>
          <CardTitle className="text-xl">Informações do Pedido</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 bg-white dark:bg-neutral-900">
        {/* Rastreamento */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide flex items-center gap-2">
            <i className="ph-bold ph-map-pin text-green-600 dark:text-green-400" />
            Rastreamento
          </h3>
          <div className="pl-6">
            {redemption.trackingCode ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <i className="ph-bold ph-barcode text-green-600 dark:text-green-400" />
                <code className="text-sm font-mono font-semibold text-green-700 dark:text-green-300">
                  {redemption.trackingCode}
                </code>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Código de rastreio ainda não disponível
              </p>
            )}
          </div>
        </div>

        {/* Botão de Cancelamento */}
        {canCancel ? (
          <div className="space-y-3">
            {remainingTime && (
              <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <i className="ph-bold ph-clock text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  {remainingTime}
                </span>
              </div>
            )}
            
            <Button
              onClick={onCancelClick}
              variant="outline"
              size="lg"
              className="w-full font-semibold text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 bg-gray-50 dark:bg-neutral-800"
            >
              <i className="ph-bold ph-x-circle text-lg mr-2" />
              Cancelar Resgate
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg">
            <i className="ph-bold ph-lock text-gray-500 dark:text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {redemption.status === 'completed' || redemption.status === 'delivered' || redemption.status === 'cancelled'
                ? 'Cancelamento indisponível - resgate finalizado'
                : 'Prazo de cancelamento expirado (24h)'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
