import { type FC, useState, useEffect } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { usePrizeById } from '@/hooks/usePrizes'
import { ImageCarousel } from '@/components/prizes/ImageCarousel'
import { PageLayout } from '@/components/layout/PageLayout'
import { useSpring, animated, useTrail } from '@react-spring/web'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const PrizeDetailsPage: FC = () => {
  const { prizeId } = useParams({ strict: false })
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

    // Navigate to confirmation page using TanStack Router
    navigate({ 
      to: '/prizes/$prizeId/confirm',
      params: { prizeId: prize.id },
      search: selectedVariantId ? { variantId: selectedVariantId } : undefined,
    })
  }

  if (isLoading) {
    return (
      <PageLayout maxWidth="6xl">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-8 h-8 w-32 rounded bg-white/50 dark:bg-white/10" />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="aspect-[4/3] rounded-2xl bg-white/50 dark:bg-white/10" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded bg-white/50 dark:bg-white/10" />
              <div className="h-4 w-1/2 rounded bg-white/50 dark:bg-white/10" />
              <div className="h-24 rounded bg-white/50 dark:bg-white/10" />
              <div className="h-12 rounded bg-white/50 dark:bg-white/10" />
            </div>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (error || !prize) {
    return (
      <PageLayout maxWidth="6xl">
        <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-8 text-center backdrop-blur-xl">
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Prêmio não encontrado</h2>
          <Button
            onClick={() => navigate({ to: '/prizes' })}
            className="mt-4"
          >
            Voltar para a loja
          </Button>
        </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout maxWidth="6xl">
      <div className="relative">
        <animated.div style={fadeIn} className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Button
            onClick={() => navigate({ to: '/prizes' })}
            variant="ghost"
            className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5"
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
          </Button>

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
                  <Badge 
                    variant="outline" 
                    className="rounded-full bg-gray-100/50 dark:bg-gray-800/30 border-gray-200/60 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
                  >
                    {prize.category}
                  </Badge>
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
                            <Button
                              key={variant.id}
                              onClick={() => handleVariantChange(variant.id)}
                              disabled={variant.stock === 0}
                              variant="outline"
                              size="sm"
                              className={
                                selectedVariantId === variant.id
                                  ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary hover:bg-primary/10 dark:hover:bg-primary/15 ring-2 ring-primary/20'
                                  : variant.stock === 0
                                    ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900/20'
                                    : 'bg-white dark:bg-gray-800/30 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                              }
                            >
                              {variant.value}
                              {variant.stock === 0 && ' (Esgotado)'}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Valor do prêmio</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-primary">
                        {prize.coinPrice.toLocaleString('pt-BR')}
                      </span>
                      <span className="text-lg font-medium text-gray-600 dark:text-gray-400">moedas</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Estoque</p>
                    <p className={`text-lg font-semibold ${prize.stock <= 5 ? 'text-orange-600 dark:text-orange-400' : 'text-primary'}`}>
                      {prize.stock} {prize.stock === 1 ? 'unidade' : 'unidades'}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleProceedToConfirm}
                  disabled={prize.stock === 0}
                  className="w-full h-12 rounded-xl bg-primary text-white font-semibold hover:bg-primary-600 active:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                >
                  {prize.stock === 0 ? 'Produto Esgotado' : 'Continuar para Resgate'}
                </Button>
              </div>
            </div>
          </div>
        </animated.div>
      </div>
    </PageLayout>
  )
}