import React from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useRedemptionById, useCancelRedemption } from '@/hooks/useRedemptions'
import { useSpring, animated, useTrail } from '@react-spring/web'
import { PageLayout } from '@/components/layout/PageLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { statusColors } from '@/lib/colors'

const statusConfig: Record<string, {
  badge: string
  icon: string
  label: string
}> = {
  pending: {
    badge: `${statusColors.pending.bg} ${statusColors.pending.text} ${statusColors.pending.border}`,
    icon: 'ph-bold ph-clock',
    label: 'Pendente',
  },
  processing: {
    badge: `${statusColors.processing.bg} ${statusColors.processing.text} ${statusColors.processing.border}`,
    icon: 'ph-bold ph-arrows-clockwise',
    label: 'Processando',
  },
  shipped: {
    badge: `${statusColors.shipped.bg} ${statusColors.shipped.text} ${statusColors.shipped.border}`,
    icon: 'ph-bold ph-package',
    label: 'Enviado',
  },
  delivered: {
    badge: `${statusColors.completed.bg} ${statusColors.completed.text} ${statusColors.completed.border}`,
    icon: 'ph-bold ph-check-circle',
    label: 'Concluído',
  },
  completed: {
    badge: `${statusColors.completed.bg} ${statusColors.completed.text} ${statusColors.completed.border}`,
    icon: 'ph-bold ph-check-circle',
    label: 'Concluído',
  },
  cancelled: {
    badge: `${statusColors.cancelled.bg} ${statusColors.cancelled.text} ${statusColors.cancelled.border}`,
    icon: 'ph-bold ph-x-circle',
    label: 'Cancelado',
  },
}

export const RedemptionDetailsPage: React.FC = () => {
  const { redemptionId } = useParams({ strict: false })
  const navigate = useNavigate()
  const { data: redemption, isLoading, error } = useRedemptionById(redemptionId)
  const cancelMutation = useCancelRedemption()
  const [showCancelModal, setShowCancelModal] = React.useState(false)
  const [cancelReason, setCancelReason] = React.useState('')
  const [cancelSuccess, setCancelSuccess] = React.useState(false)
  const [cancelError, setCancelError] = React.useState<string | null>(null)
  const [countdown, setCountdown] = React.useState(3)

  const fadeIn = useSpring({ 
    from: { opacity: 0, transform: 'translateY(20px)' }, 
    to: { opacity: 1, transform: 'translateY(0px)' }, 
  })

  const tracking = React.useMemo(() => {
    const status = redemption?.status?.toLowerCase()
    const redeemedDate = redemption?.redeemedAt ? new Date(redemption.redeemedAt).toLocaleString('pt-BR') : null
    
    // Always build complete tracking with all steps (done and pending)
    // This ensures users can see what's coming next
    const steps = [
      { 
        title: 'Pedido recebido', 
        time: redeemedDate ?? '-', 
        done: true,
      },
      { 
        title: 'Processando pedido', 
        time: '-', 
        done: status !== 'pending',
      },
      { 
        title: 'Despachado para entrega', 
        time: '-', 
        done: status === 'shipped' || status === 'completed' || status === 'delivered',
      },
      { 
        title: 'Entregue', 
        time: '-', 
        done: status === 'completed' || status === 'delivered',
      },
    ]
    
    return steps
  }, [redemption])

  const trail = useTrail(tracking.length, {
    from: { opacity: 0, transform: 'translateX(-12px)' },
    to: { opacity: 1, transform: 'translateX(0px)' },
    config: { tension: 280, friction: 60 },
  })

  const canCancel = React.useMemo(() => {
    if (!redemption) return false
    const status = redemption.status?.toLowerCase()
    if (status === 'cancelled' || status === 'completed' || status === 'delivered') return false
    const created = new Date(redemption.redeemedAt).getTime()
    const now = Date.now()
    return now - created <= 24 * 60 * 60 * 1000
  }, [redemption])

  const handleCancelClick = () => {
    setShowCancelModal(true)
    setCancelSuccess(false)
    setCancelError(null)
    setCancelReason('')
  }

  const handleCancelSubmit = async () => {
    if (!redemption || !cancelReason.trim()) return
    
    setCancelError(null)
    
    try {
      await cancelMutation.mutateAsync({ id: redemption.id, reason: cancelReason.trim() })
      setCancelSuccess(true)
      setCountdown(3)
      
      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            navigate({ to: '/resgates' })
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (e) {
      setCancelError((e as Error).message || 'Erro ao cancelar resgate')
    }
  }

  const handleGoToRedemptions = () => {
    navigate({ to: '/resgates' })
  }

  const handleCancelCancel = () => {
    setShowCancelModal(false)
    setCancelReason('')
    setCancelSuccess(false)
    setCancelError(null)
  }

  if (isLoading) {
    return (
      <PageLayout maxWidth="5xl">
        <div className="relative z-10 space-y-8">
          {/* Back Button Skeleton */}
          <div className="h-12 w-48 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
          
          {/* Hero Section Skeleton */}
          <Card className="p-8">
            <div className="flex items-start gap-8">
              <div className="h-32 w-32 rounded-xl bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
              <div className="flex-1 space-y-6">
                <div className="space-y-3">
                  <div className="h-10 w-3/4 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                  <div className="h-4 w-1/2 rounded-md bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-8 w-32 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                  <div className="h-10 w-24 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                </div>
              </div>
            </div>
          </Card>
          
          {/* Grid Skeleton */}
          <div className="grid gap-6 lg:gap-8 xl:grid-cols-3">
            <Card className="lg:col-span-2 p-8">
              <div className="h-8 w-64 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse mb-8" />
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-6">
                    <div className="h-12 w-12 rounded-xl bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 w-48 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                      <div className="h-4 w-32 rounded-md bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card className="p-8 space-y-6">
              <div className="h-8 w-40 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
              <div className="h-12 w-full rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
            </Card>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (error || !redemption) {
    return (
      <PageLayout maxWidth="6xl">
        <div className="relative z-10 flex min-h-[60vh] items-center justify-center px-4 py-8">
          <div className="w-full max-w-lg">
            <Card className="text-center p-8 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900">
                <i className="ph-bold ph-warning text-5xl text-red-500 dark:text-red-400" />
              </div>
              
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
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  Tentar novamente
                </Button>
                <Button
                  onClick={() => navigate({ to: '/redemptions' })}
                  variant="outline"
                  className="w-full"
                >
                  Voltar aos resgates
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </PageLayout>
    )
  }

  const safeStatus = redemption.status.toLowerCase()
  const statusInfo = statusConfig[safeStatus] ?? statusConfig.pending
  
  // Get prize data from API response
  const prizeImage = redemption.prize?.images?.[0] ?? '/valorize_logo.png'
  const prizeName = redemption.prize?.name ?? `Resgate #${redemption.id.slice(0, 8).toUpperCase()}`
  const prizeCategory = redemption.prize?.category ?? 'Prêmio'
  const variantInfo = redemption.variant ? `${redemption.variant.name}: ${redemption.variant.value}` : null

  return (
    <PageLayout maxWidth="6xl">
      <div className="relative z-10">
        <animated.div style={fadeIn} className="space-y-6">
          {/* Back Button */}
          <Button
            onClick={() => navigate({ to: '/resgates' })}
            variant="outline"
            size="lg"
            className="flex items-center gap-2 hover:gap-3"
          >
            <i className="ph-bold ph-arrow-left text-lg" />
            <span className="font-semibold">Voltar aos resgates</span>
          </Button>

          {/* Hero Card - Prize Information */}
          <Card className="overflow-hidden border-gray-200 dark:border-neutral-700">
            <div className="p-6 sm:p-8 bg-white dark:bg-neutral-900">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Prize Image */}
                <div className="shrink-0">
                  <img
                    src={prizeImage}
                    alt={prizeName}
                    className="h-32 w-32 sm:h-40 sm:w-40 rounded-xl object-cover border-2 border-gray-200 dark:border-neutral-700"
                  />
                </div>
                
                {/* Prize Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge 
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-bold border-2 ${statusInfo.badge}`}
                        variant="outline"
                      >
                        <i className={`${statusInfo.icon} text-lg`} />
                        {statusInfo.label}
                      </Badge>
                    </div>
                    
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {prizeName}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <i className="ph-bold ph-tag text-lg text-green-600 dark:text-green-400" />
                        <span className="font-medium">{prizeCategory}</span>
                      </div>
                      
                      {variantInfo && (
                        <>
                          <span className="text-gray-400">•</span>
                          <div className="flex items-center gap-2">
                            <i className="ph-bold ph-package text-lg text-green-600 dark:text-green-400" />
                            <span className="font-medium">{variantInfo}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Redemption Details */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-neutral-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-neutral-700">
                      <div className="p-2 bg-red-100 dark:bg-red-950 rounded-lg">
                        <i className="ph-bold ph-coins text-xl text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Valor Gasto</p>
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">
                          {new Intl.NumberFormat('pt-BR').format(redemption.coinsSpent)} moedas
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-neutral-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-neutral-700">
                      <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                        <i className="ph-bold ph-calendar-blank text-xl text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Data do Resgate</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {new Date(redemption.redeemedAt).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      onClick={() => navigate({ to: `/prizes/${redemption.prizeId}` })}
                      variant="outline"
                      size="lg"
                      className="flex items-center gap-2 font-semibold"
                    >
                      <i className="ph-bold ph-gift text-lg" />
                      Ver detalhes do prêmio
                      <i className="ph-bold ph-arrow-up-right text-base" />
                    </Button>
                    
                    {redemption.trackingCode && (
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex items-center gap-2 font-semibold border-green-300 dark:border-green-700 text-green-700 dark:text-green-300"
                      >
                        <i className="ph-bold ph-barcode text-lg" />
                        {redemption.trackingCode}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Redemption ID Footer */}
            <div className="bg-gray-50 dark:bg-neutral-900 px-6 sm:px-8 py-4 border-t border-gray-200 dark:border-neutral-700">
              <div className="flex items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <i className="ph-bold ph-hash text-base" />
                  <span className="font-medium">ID do Resgate:</span>
                </div>
                <code className="px-3 py-1.5 bg-gray-200 dark:bg-neutral-800 rounded-lg font-mono text-gray-900 dark:text-white font-semibold">
                  {redemption.id}
                </code>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 xl:grid-cols-3">
            {/* Timeline Section */}
            <Card className="xl:col-span-2 border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
              <CardHeader className="pb-6 bg-white dark:bg-neutral-900">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 dark:bg-green-950 rounded-xl">
                    <i className="ph-bold ph-clock-countdown text-2xl text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Acompanhamento do Pedido</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Veja o status e histórico do seu resgate
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6 bg-white dark:bg-neutral-900">
                  {trail.map((style, idx) => {
                    const item = tracking[idx]
                    const isLast = idx === tracking.length - 1
                    
                    return (
                      <animated.div key={idx} style={style}>
                        <div className="relative flex gap-4">
                          {/* Timeline Line */}
                          {!isLast && (
                            <div className={`absolute left-5 top-10 w-0.5 h-full ${
                              item.done && tracking[idx + 1]?.done
                                ? 'bg-green-500' 
                                : 'bg-gray-300 dark:bg-neutral-700'
                            }`} />
                          )}
                          
                          {/* Timeline Dot */}
                          <div className="relative shrink-0">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                              item.done 
                                ? 'bg-green-500 border-green-500' 
                                : 'bg-gray-200 dark:bg-neutral-700 border-gray-300 dark:border-neutral-600'
                            }`}>
                              {item.done ? (
                                <i className="ph-bold ph-check text-lg text-white" />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-neutral-500" />
                              )}
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 pb-2">
                            <h3 className={`text-base font-bold mb-1 ${
                              item.done 
                                ? 'text-gray-900 dark:text-white' 
                                : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {item.title}
                            </h3>
                            <div className={`flex items-center gap-2 text-sm ${
                              item.done 
                                ? 'text-gray-600 dark:text-gray-400' 
                                : 'text-gray-500 dark:text-gray-500'
                            }`}>
                              <i className="ph-bold ph-clock text-base" />
                              {item.time}
                            </div>
                          </div>
                        </div>
                      </animated.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card className="border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 h-fit">
              <CardHeader className="bg-white dark:bg-neutral-900">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-xl">
                    <i className="ph-bold ph-lightning text-2xl text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">Ações Rápidas</CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6 bg-white dark:bg-neutral-900">{/* Summary Card */}
                {/* Summary Card */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">
                    Resumo do Pedido
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-neutral-700">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status Atual</span>
                      <Badge className={`${statusInfo.badge} font-bold`} variant="outline">
                        {statusInfo.label}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-neutral-700">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Valor Total</span>
                      <span className="text-base font-bold text-red-600 dark:text-red-400">
                        -{new Intl.NumberFormat('pt-BR').format(redemption.coinsSpent)} moedas
                      </span>
                    </div>
                    
                    {redemption.trackingCode && (
                      <div className="flex items-center justify-between py-3">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Código de Rastreio</span>
                        <code className="text-sm font-mono font-bold text-green-600 dark:text-green-400">
                          {redemption.trackingCode}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Cancel Button or Info */}
                {canCancel ? (
                  <div className="space-y-3">
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex gap-3">
                        <i className="ph-bold ph-info text-lg text-blue-600 dark:text-blue-400 shrink-0" />
                        <p className="text-sm text-blue-900 dark:text-blue-100">
                          Você pode cancelar este resgate dentro de 24 horas. O valor será devolvido ao seu saldo.
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      onClick={handleCancelClick}
                      variant="outline"
                      size="lg"
                      className="w-full font-semibold text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <i className="ph-bold ph-x-circle text-lg mr-2" />
                      Cancelar Resgate
                    </Button>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-5 text-center space-y-3">
                    <div className="inline-flex p-3 bg-gray-200 dark:bg-neutral-700 rounded-full">
                      <i className="ph-bold ph-lock text-2xl text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                        Cancelamento Indisponível
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {redemption.status === 'completed' || redemption.status === 'delivered' || redemption.status === 'cancelled'
                          ? 'Este resgate já foi finalizado'
                          : 'O prazo de 24 horas para cancelamento expirou'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </animated.div>

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700 overflow-hidden">
              {/* Success State */}
              {cancelSuccess ? (
                <div className="p-8 text-center space-y-6">
                  <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center">
                    <i className="ph-bold ph-check-circle text-5xl text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Resgate Cancelado!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      O valor foi devolvido ao seu saldo.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Redirecionando em {countdown} segundo{countdown !== 1 ? 's' : ''}...
                    </p>
                  </div>
                  <Button
                    onClick={handleGoToRedemptions}
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
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          Cancelar Resgate
                        </h3>
                      </div>
                      <button
                        onClick={handleCancelCancel}
                        disabled={cancelMutation.isPending}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50"
                      >
                        <i className="ph-bold ph-x text-2xl text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      Você está prestes a cancelar este resgate. O valor de <span className="font-bold text-red-600 dark:text-red-400">{redemption ? new Intl.NumberFormat('pt-BR').format(redemption.coinsSpent) : '0'} moedas</span> será devolvido ao seu saldo.
                    </p>

                    {cancelError && (
                      <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex gap-3">
                          <i className="ph-bold ph-warning text-lg text-red-600 dark:text-red-400 shrink-0" />
                          <div>
                            <h4 className="font-bold text-red-900 dark:text-red-100 mb-1">Erro ao cancelar</h4>
                            <p className="text-sm text-red-700 dark:text-red-300">{cancelError}</p>
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
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Ex: Escolhi o prêmio errado, não preciso mais, etc."
                        rows={4}
                        className="w-full px-4 py-3 text-sm border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 focus:border-transparent resize-none"
                        disabled={cancelMutation.isPending}
                      />
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Por favor, informe o motivo para que possamos melhorar nossos serviços.
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 bg-gray-50 dark:bg-neutral-800/50 border-t border-gray-200 dark:border-neutral-700">
                    <div className="flex gap-3">
                      <Button
                        onClick={handleCancelCancel}
                        variant="outline"
                        size="lg"
                        className="flex-1"
                        disabled={cancelMutation.isPending}
                      >
                        Manter Resgate
                      </Button>
                      <Button
                        onClick={handleCancelSubmit}
                        disabled={cancelMutation.isPending || !cancelReason.trim()}
                        variant="destructive"
                        size="lg"
                        className="flex-1"
                      >
                        {cancelMutation.isPending ? (
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
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
