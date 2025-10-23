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
import { RedemptionActionCard } from '@/components/redemptions/RedemptionActionCard'
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
  } = useRedemptionCancellation(redemption ?? null)

  // React 19: Simplified animation with automatic optimization
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
          {/* Back Button - React 19: Improved accessibility */}
          <Button
            onClick={() => navigate({ to: '/resgates' })}
            size="lg"
            variant="outline"
            className="flex items-center gap-2 hover:gap-3 transition-all duration-200"
            aria-label="Voltar para a página de resgates"
          >
            <i className="ph-bold ph-arrow-left text-lg" aria-hidden="true" />
            <span className="font-semibold">Voltar aos resgates</span>
          </Button>

          {/* Hero Card - Prize Information */}
          <RedemptionDetailsHero redemption={redemption} />

          {/* React 19: Optimized grid layout with automatic responsive behavior */}
          <div className="grid gap-6 xl:grid-cols-3">
            {/* Timeline Section - React 19: Automatic memoization */}
            <RedemptionTimeline 
              redemption={redemption} 
              className="xl:col-span-2" 
            />

            {/* Actions Card - React 19: Simplified prop passing */}
            <RedemptionActionCard
              redemption={redemption}
              canCancel={canCancel}
              onCancelClick={handleCancelClick}
            />
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
