import React from 'react'
import { useRedemptions } from '@/hooks/useRedemptions'
import type { RedemptionsQuery } from '@/types/redemption.types'
import { RedemptionCard } from '@/components/redemptions/RedemptionCard'
import { SkeletonRedemptionCard } from '@/components/redemptions/SkeletonRedemptionCard'
import { useSpring, useTrail, animated } from '@react-spring/web'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const STATUS_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Pendente', value: 'pending' },
  { label: 'Processando', value: 'processing' },
  { label: 'Enviado', value: 'shipped' },
  { label: 'Concluído', value: 'completed' },
  { label: 'Cancelado', value: 'cancelled' },
]

const PERIOD_OPTIONS: Array<{ label: string; days?: number }> = [
  { label: 'Últimos 30 dias', days: 30 },
  { label: 'Últimos 90 dias', days: 90 },
  { label: 'Todos' },
]

export const RedemptionsPage: React.FC = () => {
  const [status, setStatus] = React.useState<string>('ALL')
  const [period, setPeriod] = React.useState<typeof PERIOD_OPTIONS[number]>(PERIOD_OPTIONS[0])
  const [search, setSearch] = React.useState('')
  const [offset, setOffset] = React.useState(0)
  const limit = 12

  const { fromDate, toDate } = React.useMemo(() => {
    if (!period.days) return { fromDate: undefined, toDate: undefined }
    const to = new Date()
    const from = new Date(Date.now() - period.days * 24 * 60 * 60 * 1000)
    return { fromDate: from.toISOString(), toDate: to.toISOString() }
  }, [period])

  const params: RedemptionsQuery = React.useMemo(() => ({
    limit,
    offset,
    status: status === 'ALL' ? undefined : status,
    fromDate,
    toDate,
    search: search.trim() || undefined,
  }), [limit, offset, status, fromDate, toDate, search])

  const { data, isLoading, error, refetch, isFetching } = useRedemptions(params)
  
  // Client-side filtering (backup since backend doesn't filter properly)
  const filteredRedemptions = React.useMemo(() => {
    if (!data?.redemptions) return []
    
    let filtered = [...data.redemptions]
    
    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim()
      filtered = filtered.filter(redemption => 
        redemption.prize.name.toLowerCase().includes(searchLower) ||
        redemption.prize.category.toLowerCase().includes(searchLower) ||
        redemption.variant?.value?.toLowerCase().includes(searchLower),
      )
    }
    
    // Apply status filter
    if (status !== 'ALL') {
      filtered = filtered.filter(redemption => {
        // Handle 'completed' and 'delivered' as the same status
        if (status === 'completed') {
          return redemption.status === 'completed' || redemption.status === 'delivered'
        }
        return redemption.status === status
      })
    }
    
    // Apply period filter
    if (period.days) {
      const cutoffDate = new Date(Date.now() - period.days * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(redemption => 
        new Date(redemption.redeemedAt) >= cutoffDate,
      )
    }
    
    return filtered
  }, [data?.redemptions, search, status, period])
  
  const hasMore = data ? data.redemptions.length === limit : false

  // Animations
  const headerSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 280, friction: 60 },
  })

  const filtersSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 250, friction: 20 },
    delay: 200,
  })

  const cardsTrail = useTrail(filteredRedemptions.length ?? 0, {
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 200, friction: 25 },
    delay: 400,
  })

  const emptyStateSpring = useSpring({
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
    config: { tension: 200, friction: 25 },
    delay: 600,
  })

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setOffset(0)
  }
  const onStatusChange = (value: string) => {
    setStatus(value)
    setOffset(0)
  }
  const onPeriodChange = (opt: typeof PERIOD_OPTIONS[number]) => {
    setPeriod(opt)
    setOffset(0)
  }

  const handleLoadMore = () => {
    if (hasMore) setOffset((prev) => prev + limit)
  }

  const handleClearFilters = () => {
    setSearch('')
    setStatus('ALL')
    setPeriod(PERIOD_OPTIONS[0])
    setOffset(0)
  }

  return (
    <PageLayout maxWidth="6xl">
      <div className="relative z-10">
        {/* Header */}
        <animated.div style={headerSpring} className="mb-8">
          <h1 data-tour="redemptions-page" className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
            Meus Resgates
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Acompanhe o status dos seus prêmios resgatados e rastreamento de entrega
          </p>
        </animated.div>

        {/* Filters Section */}
        <animated.div style={filtersSpring} data-tour="redemptions-filters" className="mb-8">
          <Card className="p-6 bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700">
            <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
              Filtros de Busca
            </h2>
            
            <div className="space-y-6">
              {/* Search Input */}
              <div>
                <label htmlFor="search-input" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Buscar por prêmio
                </label>
                <div className="relative">
                  <i className="ph-bold ph-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400 dark:text-gray-500" />
                  <input
                    id="search-input"
                    type="text"
                    value={search}
                    onChange={onSearchChange}
                    placeholder="Digite o nome do prêmio..."
                    className="w-full rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 pl-12 pr-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status do Resgate
                </label>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map(opt => (
                    <Button
                      key={opt.value}
                      onClick={() => onStatusChange(opt.value)}
                      variant={status === opt.value ? 'default' : 'outline'}
                      size="sm"
                      className={
                        status === opt.value
                          ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                          : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-neutral-600 hover:bg-gray-100 dark:hover:bg-neutral-700'
                      }
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Period Filter */}
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Período
                </label>
                <div className="flex flex-wrap gap-2">
                  {PERIOD_OPTIONS.map(opt => (
                    <Button
                      key={opt.label}
                      onClick={() => onPeriodChange(opt)}
                      variant={period.label === opt.label ? 'default' : 'outline'}
                      size="sm"
                      className={
                        period.label === opt.label
                          ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                          : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-neutral-600 hover:bg-gray-100 dark:hover:bg-neutral-700'
                      }
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-neutral-700">
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-neutral-600 hover:bg-gray-100 dark:hover:bg-neutral-700"
                >
                  <i className="ph-bold ph-arrow-clockwise text-base" />
                  Limpar filtros
                </Button>
              </div>
            </div>
          </Card>
        </animated.div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonRedemptionCard key={i} />
            ))}
          </div>
        ) : error ? (
          <animated.div
            style={emptyStateSpring}
          >
            <Card className="p-12 text-center border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900">
                <i className="ph-bold ph-warning text-5xl text-red-600 dark:text-red-400" />
              </div>
              <h2 className="mb-3 text-2xl font-bold text-red-900 dark:text-red-100">
                Erro ao carregar resgates
              </h2>
              <p className="mb-8 text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-md mx-auto">
                Não foi possível carregar seus resgates. Verifique sua conexão e tente novamente.
              </p>
              <Button
                onClick={() => refetch()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <i className="ph-bold ph-arrow-clockwise text-base mr-2" />
                Tentar novamente
              </Button>
            </Card>
          </animated.div>
        ) : (
          <>
            {filteredRedemptions.length > 0 ? (
              <div data-tour="redemptions-list" className="space-y-4">
                {cardsTrail.map((style, index) => {
                  const redemption = filteredRedemptions[index]
                  if (!redemption) return null
                  return (
                    <animated.div key={redemption.id} style={style}>
                      <RedemptionCard redemption={redemption} />
                    </animated.div>
                  )
                })}

                {hasMore && (
                  <div className="flex justify-center pt-8">
                    <Button
                      onClick={handleLoadMore}
                      disabled={isFetching}
                      variant="outline"
                      size="lg"
                      className="flex items-center gap-3 min-w-[200px] border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950"
                    >
                      {isFetching ? (
                        <>
                          <i className="ph-bold ph-spinner text-base animate-spin" />
                          Carregando...
                        </>
                      ) : (
                        <>
                          <i className="ph-bold ph-caret-down text-base" />
                          Carregar mais resgates
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <animated.div style={emptyStateSpring}>
                <Card className="p-12 text-center border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-green-50 dark:bg-green-950">
                    <i className="ph-bold ph-gift text-6xl text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                    Nenhum resgate encontrado
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-md mx-auto mb-8">
                    {search || status !== 'ALL' || period.days
                      ? 'Não encontramos resgates com os filtros aplicados. Tente ajustar os critérios de busca.'
                      : 'Você ainda não resgatou nenhum prêmio. Explore nossa loja e troque suas moedas por recompensas incríveis!'
                    }
                  </p>
                  {(search || status !== 'ALL' || period.days) && (
                    <Button
                      onClick={handleClearFilters}
                      variant="outline"
                      className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950"
                    >
                      <i className="ph-bold ph-x text-base mr-2" />
                      Limpar filtros
                    </Button>
                  )}
                </Card>
              </animated.div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  )
}
