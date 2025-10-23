import React from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useRedemptionById } from '@/hooks/useRedemptions'
import { useSpring, animated } from '@react-spring/web'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/ui'
import { useRedemptionCancellation } from '@/hooks/useRedemptionCancellation'
import { RedemptionDetailsHero } from '@/components/redemptions/RedemptionDetailsHero'
import { RedemptionTimeline } from '@/components/redemptions/RedemptionTimeline'
import { CancelRedemptionModal } from '@/components/redemptions/CancelRedemptionModal'
import { RedemptionDetailsSkeleton } from '@/components/redemptions/RedemptionDetailsSkeleton'


export const RedemptionDetailsPage: React.FC = () => {
  const { redemptionId } = useParams({ strict: false })
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
  } = useRedemptionCancellation(redemption)

  const fadeIn = useSpring({ 
    from: { opacity: 0, transform: 'translateY(20px)' }, 
    to: { opacity: 1, transform: 'translateY(0px)' }, 
  })

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
          <Button
            onClick={() => navigate({ to: '/resgates' })}
            size="lg"
            className="flex items-center gap-2 hover:gap-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
          >
            <i className="ph-bold ph-arrow-left text-lg" />
            <span className="font-semibold">Voltar aos resgates</span>
          </Button>

          {/* Hero Card - Prize Information */}
          <RedemptionDetailsHero redemption={redemption} />

          {/* Timeline Section */}
          <RedemptionTimeline redemption={redemption} />

          {/* Cancel Section */}
          <div 
            className="rounded-2xl border p-6 shadow-sm"
            style={{
              borderColor: '#e5e5e5 !important',
              backgroundColor: '#fafafa !important',
              border: '1px solid #e5e5e5 !important',
            }}
          >
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <i className="ph-bold ph-warning text-xl text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Cancelamento de resgate
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Você pode cancelar seu resgate em até <span className="font-semibold">24 horas</span> após a solicitação. Após este prazo, o cancelamento não será mais possível.
                </p>
              </div>
            </div>
            <Button
              onClick={handleCancelClick}
              variant="destructive"
              size="lg"
              disabled={!canCancel}
              className="w-full"
            >
              <i className="ph-bold ph-x-circle text-lg" />
              <span className="font-semibold">
                {canCancel ? 'Cancelar resgate' : 'Resgate não pode ser cancelado'}
              </span>
            </Button>
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
