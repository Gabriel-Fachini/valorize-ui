import React from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useRedemptionById, useCancelRedemption } from '@/hooks/useRedemptions'
import { useSpring, animated, useTrail } from '@react-spring/web'

const statusConfig: Record<string, {
  badge: string
  icon: React.ReactNode
}> = {
  pending: {
    badge: 'bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10 text-amber-700 border border-amber-300/30 dark:from-amber-400/20 dark:via-yellow-400/20 dark:to-orange-400/20 dark:text-amber-300 dark:border-amber-400/40',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  processing: {
    badge: 'bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-cyan-500/10 text-indigo-700 border border-indigo-300/30 dark:from-indigo-400/20 dark:via-blue-400/20 dark:to-cyan-400/20 dark:text-indigo-300 dark:border-indigo-400/40',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  shipped: {
    badge: 'bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-fuchsia-500/10 text-purple-700 border border-purple-300/30 dark:from-purple-400/20 dark:via-violet-400/20 dark:to-fuchsia-400/20 dark:text-purple-300 dark:border-purple-400/40',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
  },
  completed: {
    badge: 'bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 text-emerald-700 border border-emerald-300/30 dark:from-emerald-400/20 dark:via-green-400/20 dark:to-teal-400/20 dark:text-emerald-300 dark:border-emerald-400/40',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  cancelled: {
    badge: 'bg-gradient-to-r from-gray-500/10 via-slate-500/10 to-gray-600/10 text-gray-700 border border-gray-300/30 dark:from-white/10 dark:via-gray-400/10 dark:to-gray-500/10 dark:text-gray-300 dark:border-white/20',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
}

export const RedemptionDetailsPage: React.FC = () => {
  const { redemptionId } = useParams({ strict: false })
  const navigate = useNavigate()
  const { data: redemption, isLoading, error } = useRedemptionById(redemptionId)
  const cancelMutation = useCancelRedemption()

  const fadeIn = useSpring({ from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0px)' } })

  const tracking = React.useMemo(() => {
    // Mock de tracking; em produção, viria do backend do pedido
    const base = redemption?.redeemedAt ? new Date(redemption.redeemedAt).getTime() : Date.now() - 1000 * 60 * 60 * 6
    const status = redemption?.status?.toLowerCase()
    return [
      { title: 'Pedido recebido', time: new Date(base).toLocaleString('pt-BR'), done: true },
      { title: 'Processando pedido', time: new Date(base + 1000 * 60 * 60 * 2).toLocaleString('pt-BR'), done: status !== 'pending' },
      { title: 'Despachado para entrega', time: new Date(base + 1000 * 60 * 60 * 4).toLocaleString('pt-BR'), done: status === 'completed' || status === 'shipped' },
      { title: 'Entregue', time: status === 'completed' ? new Date(base + 1000 * 60 * 60 * 6).toLocaleString('pt-BR') : '-', done: status === 'completed' },
    ]
  }, [redemption])

  const trail = useTrail(tracking.length, {
    from: { opacity: 0, transform: 'translateX(-12px)' },
    to: { opacity: 1, transform: 'translateX(0px)' },
    config: { tension: 280, friction: 60 },
  })

  const canCancel = React.useMemo(() => {
    if (!redemption) return false
    const status = redemption.status?.toLowerCase()
    if (status === 'cancelled' || status === 'completed') return false
    const created = new Date(redemption.redeemedAt).getTime()
    const now = Date.now()
    return now - created <= 24 * 60 * 60 * 1000
  }, [redemption])

  const handleCancel = async () => {
    if (!redemption) return
    const ok = window.confirm('Deseja cancelar este resgate? O valor será estornado ao seu saldo.')
    if (!ok) return
    
    const reason = window.prompt('Por favor, informe o motivo do cancelamento:')
    if (!reason || reason.trim() === '') {
      alert('É necessário informar um motivo para o cancelamento.')
      return
    }
    
    try {
      await cancelMutation.mutateAsync({ id: redemption.id, reason: reason.trim() })
    } catch (e) {
      alert((e as Error).message)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50/80 via-white/60 to-purple-50/80 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/95">
        {/* Liquid Glass Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/15 to-cyan-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          {/* Back Button Skeleton */}
          <div className="h-12 w-48 rounded-2xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse" />
          
          {/* Hero Section Skeleton */}
          <div className="rounded-3xl border border-gray-200/50 dark:border-white/10 bg-gradient-to-br from-white/90 via-white/80 to-purple-50/80 dark:from-white/10 dark:via-white/5 dark:to-purple-500/10 backdrop-blur-2xl p-8 shadow-xl">
            <div className="flex items-start gap-8">
              <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse" />
              <div className="flex-1 space-y-6">
                <div className="space-y-3">
                  <div className="h-10 w-3/4 rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse" />
                  <div className="h-4 w-1/2 rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-8 w-32 rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse" />
                  <div className="h-10 w-24 rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Grid Skeleton */}
          <div className="grid gap-6 lg:gap-8 xl:grid-cols-3">
            {/* Timeline Skeleton */}
            <div className="lg:col-span-2 rounded-3xl border border-gray-200/50 dark:border-white/10 bg-gradient-to-br from-white/90 via-white/80 to-gray-50/80 dark:from-white/10 dark:via-white/5 dark:to-gray-500/5 backdrop-blur-2xl p-8 shadow-xl">
              <div className="h-8 w-64 rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse mb-8" />
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 w-48 rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse" />
                      <div className="h-4 w-32 rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Actions Skeleton */}
            <div className="rounded-3xl border border-gray-200/50 dark:border-white/10 bg-gradient-to-br from-white/90 via-white/80 to-gray-50/80 dark:from-white/10 dark:via-white/5 dark:to-gray-500/5 backdrop-blur-2xl p-8 shadow-xl space-y-6">
              <div className="h-8 w-40 rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse" />
              <div className="rounded-2xl border border-gray-200/50 dark:border-white/10 bg-gradient-to-br from-gray-50/80 to-white/80 dark:from-white/5 dark:to-gray-500/5 p-6 space-y-4">
                <div className="h-5 w-32 rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="h-4 w-20 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse" />
                    <div className="h-4 w-16 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="h-12 w-full rounded-2xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !redemption) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50/80 via-white/60 to-purple-50/80 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/95">
        {/* Liquid Glass Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-rose-400/15 to-pink-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
          <div className="w-full max-w-lg">
            <div className="text-center">
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-xl">
                <svg className="h-10 w-10 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <div className="rounded-3xl border border-red-200/50 dark:border-red-500/20 bg-gradient-to-br from-white/90 via-white/80 to-red-50/80 dark:from-white/10 dark:via-white/5 dark:to-red-500/10 backdrop-blur-2xl p-8 shadow-xl">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {error ? 'Erro ao carregar resgate' : 'Resgate não encontrado'}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {error 
                    ? 'Não foi possível carregar os detalhes do resgate. Verifique sua conexão e tente novamente.'
                    : 'O resgate que você está procurando não foi encontrado ou pode ter sido removido.'
                  }
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-red-600 hover:to-orange-600 hover:shadow-xl hover:scale-105 active:scale-95"
                  >
                    Tentar novamente
                  </button>
                  <button
                    onClick={() => navigate({ to: '/redemptions' })}
                    className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gradient-to-r from-white/90 to-gray-50/90 dark:from-white/10 dark:to-gray-500/10 px-6 py-3 font-medium text-gray-700 dark:text-gray-300 backdrop-blur-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-white/20 dark:hover:to-gray-500/20 hover:scale-105 active:scale-95"
                  >
                    Voltar aos resgates
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/80 via-white/60 to-purple-50/80 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/95">
      {/* Liquid Glass Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/15 to-cyan-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10">

        <animated.div style={fadeIn} className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          <button
            onClick={() => navigate({ to: '/resgates' })}
            className="group mb-6 flex items-center gap-3 rounded-2xl border border-gray-200/50 dark:border-white/10 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-white/10 dark:to-white/5 px-6 py-3 text-sm font-medium text-gray-700 dark:text-white backdrop-blur-2xl transition-all duration-300 hover:border-purple-300/50 dark:hover:border-purple-500/30 hover:from-purple-50/80 hover:to-indigo-50/80 dark:hover:from-purple-500/10 dark:hover:to-indigo-500/10 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10"
          >
            <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar aos resgates
          </button>

          {/* Hero Section */}
          <div className="rounded-3xl border border-gray-200/50 dark:border-white/10 bg-gradient-to-br from-white/90 via-white/80 to-purple-50/80 dark:from-white/10 dark:via-white/5 dark:to-purple-500/10 backdrop-blur-2xl p-6 sm:p-8 shadow-xl shadow-purple-500/5 dark:shadow-purple-500/10">
            <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
              <div className="relative group">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src={'/valorize_logo.png'}
                  alt="Prize"
                  className="h-24 w-24 sm:h-32 sm:w-32 rounded-3xl object-cover border-4 border-white/50 dark:border-white/20 shadow-2xl relative z-10 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                    Resgate #{redemption.id.slice(0, 8)}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-mono text-purple-600 dark:text-purple-400">{redemption.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(redemption.redeemedAt).toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <div className={`inline-flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-semibold backdrop-blur-sm ${statusConfig[redemption.status.toLowerCase()] ? statusConfig[redemption.status.toLowerCase()].badge : statusConfig.pending.badge}`}>
                    <span className="flex items-center justify-center">
                      {statusConfig[redemption.status.toLowerCase()]?.icon ?? statusConfig.pending.icon}
                    </span>
                    <span>
                      {redemption.status.toLowerCase() === 'pending' && 'Pendente'}
                      {redemption.status.toLowerCase() === 'processing' && 'Processando'}
                      {redemption.status.toLowerCase() === 'shipped' && 'Enviado'}
                      {redemption.status.toLowerCase() === 'completed' && 'Concluído'}
                      {redemption.status === 'CANCELLED' && 'Cancelado'}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => navigate({ to: `/prizes/${redemption.prizeId}` })}
                    className="group flex items-center gap-2 rounded-xl border border-gray-200/50 dark:border-white/10 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-white/10 dark:to-white/5 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 backdrop-blur-xl transition-all duration-300 hover:border-purple-300/50 dark:hover:border-purple-500/30 hover:from-purple-50/80 hover:to-indigo-50/80 dark:hover:from-purple-500/10 dark:hover:to-indigo-500/10 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10"
                  >
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Ver prêmio
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:gap-8 xl:grid-cols-3">
            <div className="xl:col-span-2 rounded-3xl border border-gray-200/50 dark:border-white/10 bg-gradient-to-br from-white/90 via-white/80 to-gray-50/80 dark:from-white/10 dark:via-white/5 dark:to-gray-500/5 backdrop-blur-2xl p-6 lg:p-8 shadow-xl shadow-purple-500/5 dark:shadow-purple-500/10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-500/20 dark:to-indigo-500/20">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Timeline de Rastreamento
                </h2>
              </div>
              
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-indigo-500 to-gray-300 dark:to-gray-600" />
                
                <div className="space-y-8">
                  {trail.map((style, idx) => (
                    <animated.div key={idx} style={style} className="relative flex items-start gap-6">
                      {/* Timeline Dot */}
                      <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-2xl border-4 ${
                        tracking[idx].done 
                          ? 'bg-gradient-to-br from-emerald-400 to-green-500 border-emerald-300 dark:border-emerald-400 shadow-lg shadow-emerald-500/25' 
                          : 'bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 border-gray-200 dark:border-gray-500'
                      } transition-all duration-500`}>
                        {tracking[idx].done ? (
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-white dark:bg-gray-800" />
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className={`flex-1 pb-8 ${tracking[idx].done ? '' : 'opacity-60'}`}>
                        <div className={`rounded-2xl border p-6 transition-all duration-500 ${
                          tracking[idx].done 
                            ? 'border-emerald-200/50 dark:border-emerald-500/30 bg-gradient-to-br from-emerald-50/80 to-green-50/80 dark:from-emerald-500/10 dark:to-green-500/10 shadow-lg shadow-emerald-500/10' 
                            : 'border-gray-200/50 dark:border-white/10 bg-gradient-to-br from-gray-50/80 to-slate-50/80 dark:from-white/5 dark:to-gray-500/5'
                        }`}>
                          <h3 className={`text-lg font-bold mb-2 ${
                            tracking[idx].done 
                              ? 'text-emerald-800 dark:text-emerald-300' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {tracking[idx].title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {tracking[idx].time}
                          </div>
                        </div>
                      </div>
                    </animated.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200/50 dark:border-white/10 bg-gradient-to-br from-white/90 via-white/80 to-gray-50/80 dark:from-white/10 dark:via-white/5 dark:to-gray-500/5 backdrop-blur-2xl p-8 shadow-xl shadow-purple-500/5 dark:shadow-purple-500/10 space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-500/20 dark:to-indigo-500/20">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Ações Disponíveis
                </h2>
              </div>
              
              {/* Informações do Resgate */}
              <div className="rounded-2xl border border-gray-200/50 dark:border-white/10 bg-gradient-to-br from-gray-50/80 to-white/80 dark:from-white/5 dark:to-gray-500/5 p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Detalhes do Resgate</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200/50 dark:border-white/10">
                    <span className="text-sm text-gray-600 dark:text-gray-400">ID do Prêmio</span>
                    <span className="font-mono text-sm text-gray-800 dark:text-gray-200">{redemption.prizeId.slice(0, 12)}...</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-gray-200/50 dark:border-white/10">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Valor Total</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-rose-600 dark:text-rose-400">
                        -{new Intl.NumberFormat('pt-BR').format(redemption.coinsSpent)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">moedas</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                    <span className={`text-sm font-semibold ${
                      redemption.status === 'COMPLETED' ? 'text-emerald-600 dark:text-emerald-400' :
                      redemption.status === 'PROCESSING' ? 'text-indigo-600 dark:text-indigo-400' :
                      redemption.status === 'PENDING' ? 'text-amber-600 dark:text-amber-400' :
                      'text-gray-600 dark:text-gray-400'
                    }`}>
                      {redemption.status === 'PENDING' && 'Pendente'}
                      {redemption.status === 'PROCESSING' && 'Processando'}
                      {redemption.status === 'COMPLETED' && 'Concluído'}
                      {redemption.status === 'CANCELLED' && 'Cancelado'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Botão de Cancelamento */}
              {canCancel ? (
                <button
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                  className="w-full flex items-center justify-center gap-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  {cancelMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-400/30 border-t-gray-700 dark:border-t-gray-300 rounded-full" style={{ animation: 'spin 1s linear infinite' }} />
                      Cancelando resgate...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancelar Resgate
                    </>
                  )}
                </button>
              ) : (
                <div className="rounded-2xl border border-gray-300/50 dark:border-gray-600/50 bg-gradient-to-br from-gray-100/80 to-gray-200/80 dark:from-gray-700/50 dark:to-gray-800/50 p-6 text-center">
                  <svg className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Cancelamento não disponível
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {redemption.status === 'COMPLETED' || redemption.status === 'CANCELLED' 
                      ? 'Resgate já finalizado' 
                      : 'Prazo de 24h expirado'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </animated.div>
      </div>
    </div>
  )
}
