import { type FC } from 'react'
import { Button } from '@/components/ui/button'

interface PrizePricingCardProps {
  coinPrice: number
  stock: number
  onAction: () => void
  disabled?: boolean
  loading?: boolean
  actionLabel?: string
}

export const PrizePricingCard: FC<PrizePricingCardProps> = ({
  coinPrice,
  stock,
  onAction,
  disabled = false,
  loading = false,
  actionLabel = 'Continuar para Resgate',
}) => {
  const isLowStock = stock <= 5 && stock > 0
  const isOutOfStock = stock === 0

  const getStockStatus = () => {
    if (isOutOfStock) return { text: 'Produto Esgotado', color: 'text-red-600 dark:text-red-400' }
    if (isLowStock) return { text: `${stock} restantes`, color: 'text-orange-600 dark:text-orange-400' }
    return { text: `${stock} unidades`, color: 'text-primary' }
  }

  const stockStatus = getStockStatus()

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Valor do prêmio</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">
              {coinPrice.toLocaleString('pt-BR')}
            </span>
            <span className="text-lg font-medium text-gray-600 dark:text-gray-400">moedas</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Estoque</p>
          <p className={`text-lg font-semibold ${stockStatus.color}`}>
            {stockStatus.text}
          </p>
        </div>
      </div>

      <Button
        onClick={onAction}
        disabled={disabled || loading}
        className="w-full h-12 rounded-xl bg-primary text-white font-semibold hover:bg-primary-600 active:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        size="lg"
        aria-label={isOutOfStock ? 'Produto esgotado' : actionLabel}
      >
        {loading ? (
          <>
            <i className="ph ph-circle-notch animate-spin mr-2" />
            Processando...
          </>
        ) : isOutOfStock ? (
          'Produto Esgotado'
        ) : (
          actionLabel
        )}
      </Button>
    </div>
  )
}
