import React from 'react'
import { useRedemptions } from '@/hooks/useRedemptions'
import type { RedemptionsQuery, RedemptionStatus } from '@/types/redemption.types'
import { RedemptionCard } from '@/components/redemptions/RedemptionCard'
import { SkeletonRedemptionCard } from '@/components/redemptions/SkeletonRedemptionCard'
import { useSpring, useTrail, animated } from '@react-spring/web'

const STATUS_OPTIONS: Array<{ label: string; value: RedemptionStatus | 'ALL' }> = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Pendente', value: 'PENDING' },
  { label: 'Processando', value: 'PROCESSING' },
  { label: 'Concluído', value: 'COMPLETED' },
  { label: 'Cancelado', value: 'CANCELLED' },
]

const PERIOD_OPTIONS: Array<{ label: string; days?: number }> = [
  { label: 'Últimos 30 dias', days: 30 },
  { label: 'Últimos 90 dias', days: 90 },
  { label: 'Todos' },
]

export const RedemptionsPage: React.FC = () => {
  const [status, setStatus] = React.useState<RedemptionStatus | 'ALL'>('ALL')
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
    status,
    fromDate,
    toDate,
    search: search.trim() || undefined,
  }), [limit, offset, status, fromDate, toDate, search])

  const { data, isLoading, error, refetch, isFetching } = useRedemptions(params)
  const hasMore = data?.pagination.hasMore

  // Animações
  const headerSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 280, friction: 60 },
  })

  const filtersTrail = useTrail(4, {
    from: { opacity: 0, transform: 'translateY(20px) scale(0.95)' },
    to: { opacity: 1, transform: 'translateY(0px) scale(1)' },
    config: { tension: 250, friction: 20 },
    delay: 300,
  })

  const cardsTrail = useTrail(data?.redemptions.length ?? 0, {
    from: { opacity: 0, transform: 'translateY(30px) scale(0.95)' },
    to: { opacity: 1, transform: 'translateY(0px) scale(1)' },
    config: { tension: 200, friction: 25 },
    delay: 600,
  })

  const emptyStateSpring = useSpring({
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
    config: { tension: 200, friction: 25 },
    delay: 800,
  })

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setOffset(0)
  }
  const onStatusChange = (value: RedemptionStatus | 'ALL') => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/80 via-white/60 to-purple-50/80 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/95">
      {/* Liquid Glass Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/15 to-cyan-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-rose-400/15 to-pink-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '6s' }}></div>
      </div>

      <div className="relative z-10">

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <animated.div style={headerSpring} className="mb-8">
            <h1 className="mb-2 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
              Meus Resgates
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Histórico de prêmios resgatados e status de processamento
            </p>
          </animated.div>

          {/* Filtros */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filtersTrail.map((style, index) => {
              const filterElements = [
                // Search Input
                <animated.div
                  key="search"
                  style={style}
                  className="rounded-2xl border border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-white/10 px-4 py-3 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      value={search}
                      onChange={onSearchChange}
                      placeholder="Buscar resgates..."
                      className="w-full bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>
                </animated.div>,

                // Status Filter
                <animated.div
                  key="status"
                  style={style}
                  className="rounded-2xl border border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-white/10 p-4 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Status</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => onStatusChange(opt.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium focus:outline-none ${
                          status === opt.value
                            ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </animated.div>,

                // Period Filter
                <animated.div
                  key="period"
                  style={style}
                  className="rounded-2xl border border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-white/10 p-4 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Período</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {PERIOD_OPTIONS.map(opt => (
                      <button
                        key={opt.label}
                        onClick={() => onPeriodChange(opt)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium focus:outline-none ${
                          period.label === opt.label
                            ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </animated.div>,

                // Clear Filters Button
                <animated.div
                  key="clear"
                  style={style}
                  className="flex items-center justify-end"
                >
                  <button
                    onClick={() => { setSearch(''); setStatus('ALL'); setPeriod(PERIOD_OPTIONS[0]); setOffset(0); refetch() }}
                    className="group rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:from-purple-700 hover:to-indigo-700 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Limpar filtros
                    </div>
                  </button>
                </animated.div>,
              ]
              return filterElements[index]
            })}
          </div>

          {/* Conteúdo */}
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonRedemptionCard key={i} />
              ))}
            </div>
          ) : error ? (
            <animated.div
              style={emptyStateSpring}
              className="rounded-3xl border border-red-200/50 dark:border-red-500/20 bg-gradient-to-br from-red-50/80 via-red-25/70 to-rose-50/80 dark:from-red-500/10 dark:via-red-500/5 dark:to-rose-500/10 p-12 text-center backdrop-blur-2xl shadow-xl shadow-red-500/10"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-500/20 dark:to-rose-500/20 shadow-lg">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="mb-3 text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
                Erro ao carregar resgates
              </h2>
              <p className="mb-8 text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-md mx-auto">
                Ops! Algo deu errado. Verifique sua conexão e tente novamente.
              </p>
              <button
                onClick={() => refetch()}
                className="group rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 px-8 py-4 text-sm font-medium text-white transition-all duration-300 hover:from-red-700 hover:to-rose-700 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Tentar novamente
                </div>
              </button>
            </animated.div>
          ) : (
            <>
              {data && data.redemptions.length > 0 ? (
                <div className="space-y-6">
                  {cardsTrail.map((style, index) => {
                    const redemption = data.redemptions[index]
                    if (!redemption) return null
                    return (
                      <animated.div key={redemption.id} style={style}>
                        <RedemptionCard redemption={redemption} />
                      </animated.div>
                    )
                  })}

                  {hasMore && (
                    <div className="flex justify-center pt-8">
                      <button
                        onClick={handleLoadMore}
                        disabled={isFetching}
                        className="group rounded-2xl border border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-white/10 px-8 py-4 text-sm font-medium text-gray-800 dark:text-gray-200 backdrop-blur-xl transition-all duration-300 hover:border-purple-300/50 dark:hover:border-purple-500/30 hover:bg-white/90 dark:hover:bg-white/15 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10 disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center gap-3">
                          {isFetching ? (
                            <>
                              <div className="w-4 h-4 border-2 border-purple-600/30 border-t-purple-600 rounded-full" style={{ animation: 'spin 1s linear infinite' }} />
                              Carregando...
                            </>
                          ) : (
                            <>
                              <span>Carregar mais</span>
                              <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </>
                          )}
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <animated.div
                  style={emptyStateSpring}
                  className="rounded-3xl border border-gray-200/50 dark:border-white/10 bg-gradient-to-br from-white/80 via-white/70 to-purple-50/80 dark:from-white/10 dark:via-white/5 dark:to-purple-500/10 p-12 text-center backdrop-blur-2xl shadow-xl shadow-purple-500/5 dark:shadow-purple-500/10"
                >
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-500/20 dark:to-indigo-500/20 shadow-lg">
                    <span className="text-3xl" style={{ animationDelay: '1s' }}>🎁</span>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Nenhum resgate encontrado
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-md mx-auto">
                    Seus resgates aparecerão aqui quando você trocar suas moedas por prêmios incríveis!
                  </p>
                  <div className="mt-8">
                    <div className="inline-flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Explore nossa loja de prêmios
                    </div>
                  </div>
                </animated.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
