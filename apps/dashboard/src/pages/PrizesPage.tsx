import React from 'react'
import { PrizeCard } from '@/components/prizes/PrizeCard'
import { PrizeFilters } from '@/components/prizes/PrizeFilters'
import { usePrizes } from '@/hooks/usePrizes'
import { PrizeFilters as Filters } from '@/types/prize.types'
import { useSpring, animated } from '@react-spring/web'
import { PageLayout } from '@/components/layout/PageLayout'

export const PrizesPage: React.FC = () => {
  const [filters, setFilters] = React.useState<Filters>({})
  const [page, setPage] = React.useState(1)
  const { data, isLoading, error } = usePrizes(filters, page, 12)

  const headerSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 280, friction: 60 },
  })

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters)
    setPage(1)
  }

  const handleLoadMore = () => {
    setPage(prev => prev + 1)
  }

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0
  const hasMore = page < totalPages

  if (error) {
    return (
      <PageLayout maxWidth="6xl">
        <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-8 text-center backdrop-blur-xl">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Erro ao carregar prêmios</h2>
          <p className="text-gray-600 dark:text-gray-400">Tente novamente mais tarde</p>
        </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout maxWidth="6xl">
      <div className="relative">
        <div className="absolute inset-0 opacity-20 dark:opacity-30" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }} />

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

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="h-[450px] animate-pulse rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl"
                >
                  <div className="aspect-square bg-gray-200 dark:bg-gray-800/50" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700/50 rounded" />
                    <div className="h-3 bg-gray-300 dark:bg-gray-700/50 rounded w-3/4" />
                    <div className="h-3 bg-gray-300 dark:bg-gray-700/50 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.prizes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 rounded-full bg-gray-100 dark:bg-gray-800/50 p-6">
                <svg
                  className="h-16 w-16 text-gray-400 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">Nenhum prêmio encontrado</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">Tente ajustar os filtros ou fazer uma nova busca</p>
              <button
                onClick={() => setFilters({})}
                className="rounded-xl bg-green-600 px-6 py-3 font-medium text-white transition-all hover:bg-green-700"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <>
              <div data-tour="prizes-grid" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data?.prizes.map((prize, index) => (
                  <PrizeCard key={prize.id} prize={prize} index={index} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    className="group flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-3 font-medium text-gray-700 dark:text-white backdrop-blur-xl transition-all hover:border-green-500 dark:hover:border-green-500/50 hover:bg-green-50 dark:hover:bg-green-500/10"
                  >
                    <span>Carregar mais</span>
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageLayout>
  )
}