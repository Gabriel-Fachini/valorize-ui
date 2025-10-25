import React from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useRedemptionById } from '@/hooks/useRedemptions'
import { useSpring, animated } from '@react-spring/web'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/ui/BackButton'
import { ErrorState } from '@/components/ui'
import { useRedemptionCancellation } from '@/hooks/useRedemptionCancellation'
import { RedemptionDetailsHero } from '@/components/redemptions/RedemptionDetailsHero'
import { RedemptionTimeline } from '@/components/redemptions/RedemptionTimeline'
import { CancelRedemptionModal } from '@/components/redemptions/CancelRedemptionModal'
import { RedemptionDetailsSkeleton } from '@/components/redemptions/RedemptionDetailsSkeleton'


export const RedemptionDetailsPage: React.FC = () => {
  const params = useParams({ strict: false })
  const redemptionId = params.redemptionId as string | undefined
  const navigate = useNavigate()
  const { data: redemption, isLoading, error } = useRedemptionById(redemptionId)
  
  const {
    canCancel,
    state: cancellationState,
    isLoading: isCancelling,
    handleCancelClick,
    handleCancelSubmit,
    handleCancelClose,
    handleGoToRedemptions,
    updateReason,
  } = useRedemptionCancellation(redemption ?? null)

  // React 19: Simplified animation with automatic optimization
  const fadeIn = useSpring({ 
    from: { opacity: 0, transform: 'translateY(20px)' }, 
    to: { opacity: 1, transform: 'translateY(0px)' }, 
  })

  // Check if redemptionId exists
  if (!redemptionId) {
    return (
      <PageLayout maxWidth="6xl">
        <div className="relative z-10 flex min-h-[60vh] items-center justify-center px-4 py-8">
          <div className="w-full max-w-lg">
            <ErrorState
              title="Resgate não encontrado"
              message="Não foi possível identificar o resgate. Por favor, tente acessar novamente pela lista de resgates."
              icon="ph-bold ph-warning"
            />
            <div className="mt-4">
              <Button
                onClick={() => navigate({ to: '/resgates' })}
                variant="outline"
                className="w-full"
              >
                Voltar aos resgates
              </Button>
            </div>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (isLoading) {
    return <RedemptionDetailsSkeleton />
  }

  if (error || !redemption) {
    return (
      <PageLayout maxWidth="6xl">
        <div className="relative z-10 flex min-h-[60vh] items-center justify-center px-4 py-8">
          <div className="w-full max-w-lg">
            <ErrorState
              title={error ? 'Erro ao carregar resgate' : 'Resgate não encontrado'}
              message={error 
                ? 'Não foi possível carregar os detalhes do resgate. Verifique sua conexão e tente novamente.'
                : 'O resgate que você está procurando não foi encontrado ou pode ter sido removido.'
              }
              onRetry={() => window.location.reload()}
              retryLabel="Tentar novamente"
              icon="ph-bold ph-warning"
            />
            <div className="mt-4">
              <Button
                onClick={() => navigate({ to: '/resgates' })}
                variant="outline"
                className="w-full"
              >
                Voltar aos resgates
              </Button>
            </div>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout maxWidth="6xl">
      <div className="relative z-10">
        <animated.div style={fadeIn} className="space-y-6">
          {/* Back Button */}
          <BackButton 
            onClick={() => navigate({ to: '/resgates' })} 
            label="Voltar aos resgates"
          />

          {/* Hero Card - Prize Information */}
          <RedemptionDetailsHero redemption={redemption} />

          {/* Timeline Section - Full Width */}
          <RedemptionTimeline 
            redemption={redemption} 
          />

          {/* Cancellation Section */}
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-950 rounded-xl">
                <i className="ph-bold ph-clock text-2xl text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Cancelamento do Resgate</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Você pode cancelar seu resgate em até 24 horas após a confirmação
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Status do cancelamento */}
              {canCancel ? (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <i className="ph-bold ph-info text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">
                    Prazo de cancelamento: 24 horas após a confirmação do resgate
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg">
                  <i className="ph-bold ph-lock text-gray-500 dark:text-gray-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {redemption.status === 'completed' || redemption.status === 'delivered' || redemption.status === 'cancelled'
                      ? 'Cancelamento indisponível - resgate finalizado'
                      : 'Prazo de cancelamento expirado (24h)'}
                  </p>
                </div>
              )}
              
              {/* Botão de cancelamento sempre visível */}
              <Button
                onClick={canCancel ? handleCancelClick : undefined}
                variant="outline"
                size="lg"
                disabled={!canCancel}
                className={`w-full font-semibold ${
                  canCancel 
                    ? 'bg-red-800/80 dark:bg-red-900/60 text-white border-red-800/80 dark:border-red-900/60 hover:bg-red-800 dark:hover:bg-red-900/80' 
                    : 'bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                }`}
              >
                <i className={`ph-bold ph-x-circle text-lg mr-2 ${canCancel ? '' : 'opacity-50'}`} />
                Cancelar Resgate
              </Button>
            </div>
          </div>
        </animated.div>

        {/* Cancel Modal */}
        <CancelRedemptionModal
          isOpen={cancellationState.showModal}
          redemption={redemption}
          isLoading={isCancelling}
          reason={cancellationState.reason}
          error={cancellationState.error}
          success={cancellationState.success}
          countdown={cancellationState.countdown}
          onClose={handleCancelClose}
          onReasonChange={updateReason}
          onSubmit={handleCancelSubmit}
          onGoToRedemptions={handleGoToRedemptions}
        />
      </div>
    </PageLayout>
  )
}
