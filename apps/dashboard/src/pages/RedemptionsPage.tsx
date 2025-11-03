import React from 'react'
import { useRedemptions } from '@/hooks/useRedemptions'
import { useRedemptionFilters } from '@/hooks/useRedemptionFilters'
import { RedemptionCard, SkeletonRedemptionCard, RedemptionFilters } from '@/components/redemptions'
import { animated } from '@react-spring/web'
import { PageLayout } from '@/components/layout/PageLayout'
import { 
  EmptyState, 
  ErrorState, 
  LoadMoreButton,
} from '@/components/ui'
import { 
  usePageEntrance,
  useListTrail,
  useCardEntrance,
} from '@/hooks/useAnimations'

export const RedemptionsPage: React.FC = () => {
  // Use custom hook for filter management
  const filters = useRedemptionFilters()
  const { data, isLoading, error, refetch, isFetching } = useRedemptions(filters.params)
  
  // Trust backend filtering - no client-side filtering needed
  const redemptions = data?.redemptions ?? []

  // Animations (same pattern as PraisesPage and TransactionsPage)
  const pageAnimation = usePageEntrance()
  const redemptionsTrail = useListTrail(redemptions, filters.status)
  const feedSectionAnimation = useCardEntrance()
  const filterAnimation = useCardEntrance()

  return (
    <PageLayout maxWidth="6xl">
      <animated.div style={pageAnimation as any}>
        {/* Main Content */}
        <div className="relative z-10">

        {/* Header */}
        <div className="mb-8">
          <h1 data-tour="redemptions-page" className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
            Meus Resgates
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Acompanhe o status dos seus prêmios resgatados e rastreamento de entrega
          </p>
        </div>

        {/* Filters Section */}
        <animated.div style={filterAnimation as any} data-tour="redemptions-filters" className="mb-8">
          <RedemptionFilters
            search={filters.search}
            status={filters.status}
            period={filters.period}
            onSearchChange={filters.handleSearchChange}
            onStatusChange={filters.handleStatusChange}
            onPeriodChange={filters.handlePeriodChange}
            onClearFilters={filters.handleClearFilters}
            hasActiveFilters={filters.hasActiveFilters}
          />
        </animated.div>

        {/* Redemptions Feed */}
        <animated.div style={feedSectionAnimation as any} data-tour="redemptions-feed">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonRedemptionCard key={i} />
              ))}
            </div>
          ) : error ? (
            <ErrorState
              title="Erro ao carregar resgates"
              message="Não foi possível carregar seus resgates. Verifique sua conexão e tente novamente."
              onRetry={() => refetch()}
            />
          ) : (
            <>
              {redemptions.length > 0 ? (
                <div data-tour="redemptions-list" className="space-y-4">
                  {redemptionsTrail.map((style, index) => {
                    const redemption = redemptions[index]
                    if (!redemption) return null
                    return (
                      <animated.div key={redemption.id} style={style as any}>
                        <RedemptionCard redemption={redemption} />
                      </animated.div>
                    )
                  })}

                  <LoadMoreButton
                    hasMore={filters.hasMore(redemptions.length)}
                    loading={isFetching}
                    onLoadMore={filters.handleLoadMore}
                    buttonText="Carregar mais resgates"
                  />
                </div>
              ) : (
                <EmptyState
                  icon="ph-bold ph-gift"
                  title="Nenhum resgate encontrado"
                  description={
                    filters.hasActiveFilters
                      ? 'Não encontramos resgates com os filtros aplicados. Tente ajustar os critérios de busca.'
                      : 'Você ainda não resgatou nenhum prêmio. Explore nossa loja e troque suas moedas por recompensas incríveis!'
                  }
                  action={filters.hasActiveFilters ? {
                    label: 'Limpar filtros',
                    onClick: filters.handleClearFilters,
                    icon: 'ph-bold ph-x',
                  } : undefined}
                />
              )}
            </>
          )}
        </animated.div>
      </div>
      </animated.div>
    </PageLayout>
  )
}
