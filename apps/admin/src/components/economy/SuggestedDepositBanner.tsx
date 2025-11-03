/**
 * Suggested Deposit Banner Component
 * Smart suggestion for deposit amount
 */

import type { FC } from 'react'
import { Button } from '@/components/ui/button'
import type { SuggestedDeposit } from '@/types/economy'

interface SuggestedDepositBannerProps {
  suggestion: SuggestedDeposit | null
  isLoading?: boolean
}

/**
 * SuggestedDepositBanner - Shows smart deposit suggestion
 *
 * Features:
 * - Only renders if suggestion is not null
 * - Strong visual emphasis
 * - Call-to-action button (disabled for now)
 * - Clear motivation and target
 */
export const SuggestedDepositBanner: FC<SuggestedDepositBannerProps> = ({
  suggestion,
  isLoading = false,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  if (isLoading || !suggestion) {
    return null
  }

  return (
    <div className="mb-6 rounded-lg border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 dark:border-amber-800 dark:from-amber-950 dark:to-orange-950">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <i className="ph ph-lightbulb text-2xl text-amber-600" />
            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100">
              Sugestão de Aporte
            </h3>
          </div>

          <p className="text-3xl font-bold text-primary">{formatCurrency(suggestion.amount)}</p>

          <p className="text-sm text-amber-800 dark:text-amber-200">
            {suggestion.reason}
          </p>

          <p className="text-xs text-amber-700 dark:text-amber-300">
            <i className="ph ph-target inline mr-1" />
            Meta: {suggestion.target_runway_days} dias de cobertura
          </p>
        </div>

        <Button disabled className="min-w-fit">
          Aplicar Sugestão
        </Button>
      </div>
    </div>
  )
}
