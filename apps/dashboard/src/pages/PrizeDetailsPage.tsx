import { type FC, useState, useEffect } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { usePrizeById } from '@/hooks/usePrizes'
import { ImageCarousel } from '@/components/prizes/ImageCarousel'
import { useSpring, animated, useTrail } from '@react-spring/web'

export const PrizeDetailsPage: FC = () => {
  const { prizeId } = useParams({ from: '/prizes/$prizeId' })
  const navigate = useNavigate()
  const { data: prize, isLoading, error } = usePrizeById(prizeId)

  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(undefined)

  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 280, friction: 60 },
  })

  const trail = useTrail(prize?.specifications ? Object.keys(prize.specifications).length : 0, {
    from: { opacity: 0, transform: 'translateX(-20px)' },
    to: { opacity: 1, transform: 'translateX(0px)' },
    config: { tension: 280, friction: 60 },
  })

  // Auto-select first variant if available
  useEffect(() => {
    if (prize?.variants && prize.variants.length > 0 && !selectedVariantId) {
      setSelectedVariantId(prize.variants[0].id)
    }
  }, [prize, selectedVariantId])

  const handleVariantChange = (variantId: string) => {
    setSelectedVariantId(variantId)
  }

  const handleProceedToConfirm = () => {
    if (!prize) return

    // Validate variant selection if prize has variants
    if (prize.variants && prize.variants.length > 0 && !selectedVariantId) {
      alert('Por favor, selecione uma variante do produto')
      return
    }

    // Navigate to confirmation page
    const confirmPath = `/prizes/${prize.id}/confirm${selectedVariantId ? `?variantId=${selectedVariantId}` : ''}`
    window.location.href = confirmPath
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 p-4">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-8 h-8 w-32 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="aspect-[4/3] rounded-2xl bg-gray-200 dark:bg-gray-800" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-24 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-12 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !prize) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 p-4">
        <div className="rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-8 text-center backdrop-blur-xl">
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Prêmio não encontrado</h2>
          <button
            onClick={() => navigate({ to: '/prizes' })}
            className="mt-4 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            Voltar para a loja
          </button>
        </div>
      </div>
    )
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      eletronicos: 'from-blue-500/20 to-cyan-500/20',
      electronics: 'from-blue-500/20 to-cyan-500/20',
      casa: 'from-amber-500/20 to-orange-500/20',
      'home-office': 'from-amber-500/20 to-orange-500/20',
      esporte: 'from-green-500/20 to-emerald-500/20',
      livros: 'from-purple-500/20 to-pink-500/20',
      'vale-compras': 'from-red-500/20 to-rose-500/20',
      'gift-cards': 'from-red-500/20 to-rose-500/20',
      experiencias: 'from-indigo-500/20 to-purple-500/20',
      experiences: 'from-indigo-500/20 to-purple-500/20',
    }
    return colors[category] || 'from-gray-500/20 to-gray-600/20'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      <div className="relative">
        <div className="absolute inset-0 opacity-30 dark:opacity-30" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }} />

        <animated.div style={fadeIn} className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate({ to: '/prizes' })}
            className="mb-6 flex items-center gap-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-sm text-gray-700 dark:text-white backdrop-blur-xl transition-all hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Voltar
          </button>

          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <ImageCarousel images={prize.images} title={prize.name} />

              {prize.specifications && Object.keys(prize.specifications).length > 0 && (
                <div className="mt-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-xl">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Especificações</h3>
                  <dl className="space-y-3">
                    {trail.map((style, index) => {
                      const key = Object.keys(prize.specifications!)[index]
                      const value = prize.specifications![key]
                      return (
                        <animated.div
                          key={key}
                          style={style}
                          className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-2"
                        >
                          <dt className="text-sm text-gray-600 dark:text-gray-400">{key}</dt>
                          <dd className="text-sm font-medium text-gray-900 dark:text-white">{value}</dd>
                        </animated.div>
                      )
                    })}
                  </dl>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <div className="mb-3 flex items-start justify-between">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{prize.name}</h1>
                </div>

                <div className="mb-4 flex items-center gap-3">
                  <span className={`rounded-full bg-gradient-to-r ${getCategoryColor(prize.category)} px-4 py-1.5 text-sm font-medium text-white`}>
                    {prize.category}
                  </span>
                  {prize.brand && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">por {prize.brand}</span>
                  )}
                </div>

                <p className="text-gray-700 dark:text-gray-300">{prize.description}</p>
              </div>

              {prize.variants && prize.variants.length > 0 && (
                <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-xl">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Variantes</h3>
                  <div className="space-y-4">
                    {/* Group variants by name */}
                    {Object.entries(
                      prize.variants.reduce((acc, variant) => {
                        if (!acc[variant.name]) acc[variant.name] = []
                        acc[variant.name].push(variant)
                        return acc
                      }, {} as Record<string, typeof prize.variants>),
                    ).map(([name, variants]) => (
                      <div key={name}>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {name}
                          <span className="ml-1 text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {variants.map(variant => (
                            <button
                              key={variant.id}
                              onClick={() => handleVariantChange(variant.id)}
                              disabled={variant.stock === 0}
                              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                                selectedVariantId === variant.id
                                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300'
                                  : variant.stock === 0
                                    ? 'border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                    : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10'
                              }`}
                            >
                              {variant.value}
                              {variant.stock === 0 && ' (Esgotado)'}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-purple-200 dark:border-purple-500/20 bg-gradient-to-br from-purple-50 dark:from-purple-500/10 to-indigo-50 dark:to-indigo-500/10 p-6 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Valor do prêmio</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                        {prize.coinPrice.toLocaleString('pt-BR')}
                      </span>
                      <span className="text-lg text-gray-600 dark:text-gray-300">moedas</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Estoque</p>
                    <p className={`text-lg font-semibold ${prize.stock <= 5 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                      {prize.stock} {prize.stock === 1 ? 'unidade' : 'unidades'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleProceedToConfirm}
                  disabled={prize.stock === 0}
                  className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 font-semibold text-white transition-all hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {prize.stock === 0 ? 'Produto Esgotado' : 'Continuar para Resgate'}
                </button>
              </div>
            </div>
          </div>
        </animated.div>
      </div>
    </PageLayout>
  )
}