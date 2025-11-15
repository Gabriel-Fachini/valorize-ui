import { memo, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Prize, PrizeVariant } from '@/types/prize.types'

interface VoucherConfirmationCardProps {
  prize: Prize
  selectedVariant?: PrizeVariant
  className?: string
}

export const VoucherConfirmationCard = memo<VoucherConfirmationCardProps>(({
  prize,
  selectedVariant,
  className,
}) => {
  const formattedPrice = useMemo(() => {
    return prize.coinPrice.toLocaleString('pt-BR')
  }, [prize.coinPrice])

  return (
    <div className={cn(
      'rounded-2xl border border-gray-200 dark:border-white/10 bg-white/95 dark:bg-[#262626]/95 p-6 backdrop-blur-xl shadow-lg',
      className,
    )}>
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
        Confirmar Resgate
      </h2>

      <div className="flex gap-4 mb-6">
        <img
          src={prize.images[0]}
          alt={prize.name}
          className="h-24 w-24 rounded-lg object-cover flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white truncate">
            {prize.name}
          </h3>

          <div className="mb-2 flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="rounded-full">
              {prize.category}
            </Badge>
            {selectedVariant && (
              <Badge variant="outline" className="rounded-full">
                {selectedVariant.name}: {selectedVariant.value}
              </Badge>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formattedPrice}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              moedas
            </span>
          </div>
        </div>
      </div>

      {/* Info Box - Voucher Delivery */}
      <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <i className="ph-fill ph-envelope-simple text-2xl text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
              Receba seu voucher por email
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Após a confirmação, o voucher será enviado automaticamente para o seu email cadastrado.
              Não é necessário fornecer endereço de entrega.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

VoucherConfirmationCard.displayName = 'VoucherConfirmationCard'
