import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useSpring, animated } from '@react-spring/web'
import { Button } from '@/components/ui/button'
import { formatCoinsAmount } from '@/lib/redemptionUtils'
import type { Redemption } from '@/types/redemption.types'

interface CancelRedemptionModalProps {
  isOpen: boolean
  redemption: Redemption | null
  isLoading: boolean
  reason: string
  error: string | null
  success: boolean
  countdown: number
  onClose: () => void
  onReasonChange: (reason: string) => void
  onSubmit: () => void
  onGoToRedemptions: () => void
}

export const CancelRedemptionModal: React.FC<CancelRedemptionModalProps> = ({
  isOpen,
  redemption,
  isLoading,
  reason,
  error,
  success,
  countdown,
  onClose,
  onReasonChange,
  onSubmit,
  onGoToRedemptions,
}) => {
  const modalSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'scale(1)' : 'scale(0.9)',
    config: { tension: 300, friction: 20 },
  })

  // Body overflow management
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      aria-hidden="true"
    >
      <animated.div
        style={modalSpring}
        className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Success State */}
        {success ? (
          <div className="p-8 text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center">
              <i className="ph-bold ph-check-circle text-5xl text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 id="modal-title" className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Resgate Cancelado!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                O valor foi devolvido ao seu saldo.
              </p>
              <p 
                className="text-sm text-gray-500 dark:text-gray-500"
                aria-live="polite"
              >
                Redirecionando em {countdown} segundo{countdown !== 1 ? 's' : ''}...
              </p>
            </div>
            <Button
              onClick={onGoToRedemptions}
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold"
            >
              <i className="ph-bold ph-arrow-left text-lg mr-2" />
              Voltar para resgates
            </Button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-950 rounded-lg">
                    <i className="ph-bold ph-warning text-2xl text-red-600 dark:text-red-400" />
                  </div>
                  <h3 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
                    Cancelar Resgate
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50"
                  aria-label="Fechar modal"
                >
                  <i className="ph-bold ph-x text-2xl text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Você está prestes a cancelar este resgate. O valor de{' '}
                <span className="font-bold text-red-600 dark:text-red-400">
                  {redemption ? formatCoinsAmount(redemption.coinsSpent) : '0'} moedas
                </span>{' '}
                será devolvido ao seu saldo.
              </p>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex gap-3">
                    <i className="ph-bold ph-warning text-lg text-red-600 dark:text-red-400 shrink-0" />
                    <div>
                      <h4 className="font-bold text-red-900 dark:text-red-100 mb-1">Erro ao cancelar</h4>
                      <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="cancel-reason" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Motivo do cancelamento *
                </label>
                <textarea
                  id="cancel-reason"
                  value={reason}
                  onChange={(e) => onReasonChange(e.target.value)}
                  placeholder="Ex: Escolhi o prêmio errado, não preciso mais, etc."
                  rows={4}
                  className="w-full px-4 py-3 text-sm border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 focus:border-transparent resize-none"
                  disabled={isLoading}
                  aria-describedby="reason-help"
                />
                <p id="reason-help" className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Por favor, informe o motivo para que possamos melhorar nossos serviços.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 dark:bg-neutral-800/50 border-t border-gray-200 dark:border-neutral-700">
              <div className="flex gap-3">
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  disabled={isLoading}
                >
                  Manter Resgate
                </Button>
                <Button
                  onClick={onSubmit}
                  disabled={isLoading || !reason.trim()}
                  variant="destructive"
                  size="lg"
                  className="flex-1"
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="ph-bold ph-spinner text-lg animate-spin mr-2" />
                      Cancelando...
                    </>
                  ) : (
                    <>
                      <i className="ph-bold ph-check text-lg mr-2" />
                      Confirmar Cancelamento
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </animated.div>
    </div>,
    document.body
  )
}
