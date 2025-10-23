import { useMemo, useCallback, useTransition, Suspense, useState, useEffect } from 'react'
import { PrizeCard, SkeletonPrizeCard } from '@/components/prizes'
import { PrizeFilters } from '@/components/prizes/PrizeFilters'
import { usePrizes } from '@/hooks/usePrizes'
import { PrizeFilters as Filters, Prize } from '@/types/prize.types'
import { useSpring, animated } from '@react-spring/web'
import { PageLayout } from '@/components/layout/PageLayout'
import { ErrorState, EmptyState } from '@/components/ui'
import { Button } from '@/components/ui/button'

export const PrizesPage = () => {
  const [filters, setFilters] = useState<Filters>({})
  const [page, setPage] = useState(1)
  const [allPrizes, setAllPrizes] = useState<Prize[]>([])
  const [isPending, startTransition] = useTransition()
  
  const { data, isLoading, error, isFetching } = usePrizes({ 
    ...filters, 
    search: undefined,
  }, page, 12)

  // Memoized calculations - React 19 optimization
  const totalPages = useMemo(() => 
    data ? Math.ceil(data.total / data.pageSize) : 0, 
    [data],
  )
  
  const hasMore = useMemo(() => page < totalPages, [page, totalPages])

  // Client-side filtering for search only
  const filteredPrizes = useMemo(() => {
    if (!filters.search || filters.search.trim() === '') {
      return allPrizes
    }
    
    const searchTerm = filters.search.toLowerCase().trim()
    return allPrizes.filter(prize => 
      prize.name.toLowerCase().includes(searchTerm) ||
      prize.description.toLowerCase().includes(searchTerm),
    )
  }, [allPrizes, filters.search])

  // Show filtered prizes or all prizes based on search
  const displayPrizes = filteredPrizes

  // Optimized effects with React 19 patterns
  useEffect(() => {
    if (data?.prizes) {
      if (page === 1) {
        setAllPrizes(data.prizes)
      } else {
        setAllPrizes(prev => [...prev, ...data.prizes])
      }
    }
  }, [data?.prizes, page])

  useEffect(() => {
    // Reset prizes when filters change (except search)
    const { search: _search, ...otherFilters } = filters
    if (Object.keys(otherFilters).length > 0) {
      setAllPrizes([])
      setPage(1)
    }
  }, [filters])

  // Debug: Log current state
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('Debug PrizesPage:', {
      filters,
      allPrizesCount: allPrizes.length,
      displayPrizesCount: displayPrizes.length,
      hasSearch: !!filters.search,
      searchTerm: filters.search,
    })
  }, [filters, allPrizes.length, displayPrizes.length])


  // Memoized spring animation
  const headerSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 280, friction: 60 },
  })

  // Stable callbacks with useCallback - React 19 best practice
  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters)
  }, [])

  const handleLoadMore = useCallback(() => {
    startTransition(() => {
      setPage(prev => prev + 1)
    })
  }, [])

  if (error) {
    return (
      <PageLayout maxWidth="6xl">
        <div className="flex min-h-[60vh] items-center justify-center p-4">
          <ErrorState
            title="Erro ao carregar prêmios"
            message="Não foi possível carregar os prêmios. Verifique sua conexão e tente novamente."
            icon="ph-bold ph-warning"
          />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout maxWidth="6xl">
      <div className="relative">
        <animated.div style={headerSpring} className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
            Loja de Prêmios
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Resgate seus prêmios favoritos com as moedas acumuladas
          </p>
        </animated.div>

        <div data-tour="prizes-filters">
          <PrizeFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            totalResults={data?.total}
          />
        </div>

        <Suspense fallback={
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(12)].map((_, i) => (
              <SkeletonPrizeCard key={i} />
            ))}
          </div>
        }>
          {isLoading && allPrizes.length === 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(12)].map((_, i) => (
                <SkeletonPrizeCard key={i} />
              ))}
            </div>
        ) : displayPrizes.length === 0 ? (
          <EmptyState
            icon="ph-bold ph-package"
            title="Nenhum prêmio encontrado"
            description={
              filters.search 
                ? `Nenhum prêmio encontrado para '${filters.search}'. Tente uma busca diferente.`
                : 'Tente ajustar os filtros ou fazer uma nova busca'
            }
            action={{
              label: 'Limpar filtros',
              onClick: () => setFilters({}),
              icon: 'ph-bold ph-x',
            }}
          />
        ) : (
          <>
            <div data-tour="prizes-grid" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayPrizes.map((prize, index) => (
                <PrizeCard key={prize.id} prize={prize} index={index} />
              ))}
            </div>

              {/* Mostrar botão "Carregar mais" apenas se não estiver fazendo busca */}
              {!filters.search && hasMore && (
                <div className="mt-8 flex justify-center">
                  <Button
                    onClick={handleLoadMore}
                    disabled={isFetching || isPending}
                    variant="ghost"
                    size="default"
                    className="min-w-[140px] text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    {isFetching || isPending ? (
                      <>
                        <i className="ph-bold ph-spinner text-base animate-spin mr-2" />
                        Carregando...
                      </>
                    ) : (
                      <>
                        <i className="ph-bold ph-plus text-base mr-2" />
                        Carregar mais
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Mostrar indicador de loading apenas se não estiver fazendo busca */}
              {!filters.search && (isFetching || isPending) && allPrizes.length > 0 && (
                <div className="mt-4 flex justify-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <i className="ph-bold ph-spinner text-sm animate-spin" />
                    <span>Carregando novos prêmios...</span>
                  </div>
                </div>
              )}
            </>
          )}
        </Suspense>
      </div>
    </PageLayout>
  )
}