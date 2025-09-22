import React from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { usePrizeById, useRedeemPrize } from '@/hooks/usePrizes'
import { ImageCarousel } from '@/components/prizes/ImageCarousel'
import { useSpring, animated, useTrail } from '@react-spring/web'

export const PrizeDetailsPage: React.FC = () => {
  const { prizeId } = useParams({ from: '/prizes/$prizeId' })
  const navigate = useNavigate()
  const { data: prize, isLoading, error } = usePrizeById(prizeId)
  const redeemMutation = useRedeemPrize()

  const [preferences, setPreferences] = React.useState<Record<string, string>>({})
  const [showRedeemModal, setShowRedeemModal] = React.useState(false)

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

  const handlePreferenceChange = (label: string, value: string) => {
    setPreferences(prev => ({ ...prev, [label]: value }))
  }

  const handleRedeem = async () => {
    if (!prize) return

    const requiredPrefs = prize.preferences?.filter(p => p.required) ?? []
    const missingPrefs = requiredPrefs.filter(p => !preferences[p.label])

    if (missingPrefs.length > 0) {
      alert(`Por favor, selecione: ${missingPrefs.map(p => p.label).join(', ')}`)
      return
    }

    setShowRedeemModal(true)

    try {
      await redeemMutation.mutateAsync({
        prizeId: prize.id,
        preferences,
      })
    } catch (error) {
      console.error('Erro ao resgatar prêmio:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 p-4">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-8 h-8 w-32 rounded bg-gray-800" />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="aspect-[4/3] rounded-2xl bg-gray-800" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded bg-gray-800" />
              <div className="h-4 w-1/2 rounded bg-gray-800" />
              <div className="h-24 rounded bg-gray-800" />
              <div className="h-12 rounded bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !prize) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 p-4">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center backdrop-blur-xl">
          <h2 className="mb-2 text-xl font-semibold text-white">Prêmio não encontrado</h2>
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

  const categoryColors = {
    eletronicos: 'from-blue-500/20 to-cyan-500/20',
    casa: 'from-amber-500/20 to-orange-500/20',
    esporte: 'from-green-500/20 to-emerald-500/20',
    livros: 'from-purple-500/20 to-pink-500/20',
    'vale-compras': 'from-red-500/20 to-rose-500/20',
    experiencias: 'from-indigo-500/20 to-purple-500/20',
  }

  const categoryLabels = {
    eletronicos: 'Eletrônicos',
    casa: 'Casa',
    esporte: 'Esporte',
    livros: 'Livros',
    'vale-compras': 'Vale Compras',
    experiencias: 'Experiências',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950">
      <div className="relative">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }} />

        <animated.div style={fadeIn} className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate({ to: '/prizes' })}
            className="mb-6 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10"
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
              <ImageCarousel images={prize.images} title={prize.title} />

              {prize.specifications && Object.keys(prize.specifications).length > 0 && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <h3 className="mb-4 text-lg font-semibold text-white">Especificações</h3>
                  <dl className="space-y-3">
                    {trail.map((style, index) => {
                      const key = Object.keys(prize.specifications!)[index]
                      const value = prize.specifications![key]
                      return (
                        <animated.div
                          key={key}
                          style={style}
                          className="flex justify-between border-b border-white/5 pb-2"
                        >
                          <dt className="text-sm text-gray-400">{key}</dt>
                          <dd className="text-sm font-medium text-white">{value}</dd>
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
                  <h1 className="text-3xl font-bold text-white">{prize.title}</h1>
                  {prize.featured && (
                    <span className="rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 px-3 py-1 text-xs font-semibold text-white">
                      Destaque
                    </span>
                  )}
                </div>

                <div className="mb-4 flex items-center gap-3">
                  <span className={`rounded-full bg-gradient-to-r ${categoryColors[prize.category]} px-4 py-1.5 text-sm font-medium text-white`}>
                    {categoryLabels[prize.category]}
                  </span>
                  {prize.brand && (
                    <span className="text-sm text-gray-400">por {prize.brand}</span>
                  )}
                </div>

                <p className="text-gray-300">{prize.description}</p>
              </div>

              {prize.preferences && prize.preferences.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <h3 className="mb-4 text-lg font-semibold text-white">Preferências</h3>
                  <div className="space-y-4">
                    {prize.preferences.map(pref => (
                      <div key={pref.label}>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                          {pref.label}
                          {pref.required && <span className="ml-1 text-red-400">*</span>}
                        </label>
                        {pref.type === 'select' ? (
                          <div className="flex flex-wrap gap-2">
                            {pref.options.map(option => (
                              <button
                                key={option}
                                onClick={() => handlePreferenceChange(pref.label, option)}
                                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                                  preferences[pref.label] === option
                                    ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        ) : pref.type === 'color' ? (
                          <div className="flex gap-2">
                            {pref.options.map(color => (
                              <button
                                key={color}
                                onClick={() => handlePreferenceChange(pref.label, color)}
                                className={`h-10 w-10 rounded-full border-2 ${
                                  preferences[pref.label] === color
                                    ? 'border-purple-500'
                                    : 'border-white/20'
                                }`}
                                style={{ backgroundColor: color }}
                                aria-label={color}
                              />
                            ))}
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={preferences[pref.label] || ''}
                            onChange={(e) => handlePreferenceChange(pref.label, e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-400 backdrop-blur-xl focus:border-purple-500 focus:outline-none"
                            placeholder={`Digite ${pref.label.toLowerCase()}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 p-6 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Valor do prêmio</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                        {prize.price.toLocaleString('pt-BR')}
                      </span>
                      <span className="text-lg text-gray-300">moedas</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Estoque</p>
                    <p className={`text-lg font-semibold ${prize.stock <= 5 ? 'text-orange-400' : 'text-green-400'}`}>
                      {prize.stock} {prize.stock === 1 ? 'unidade' : 'unidades'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleRedeem}
                  disabled={prize.stock === 0}
                  className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 font-semibold text-white transition-all hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {prize.stock === 0 ? 'Produto Esgotado' : 'Resgatar Prêmio'}
                </button>
              </div>
            </div>
          </div>
        </animated.div>
      </div>

      {showRedeemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <animated.div
            style={useSpring({
              from: { opacity: 0, transform: 'scale(0.9)' },
              to: { opacity: 1, transform: 'scale(1)' },
              config: { tension: 300, friction: 20 },
            })}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900/95 p-8 backdrop-blur-xl"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mx-auto">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="mb-4 text-center text-2xl font-bold text-white">
              Prêmio Resgatado!
            </h2>

            <p className="mb-6 text-center text-gray-400">
              Seu prêmio foi resgatado com sucesso. Em breve entraremos em contato para a entrega.
            </p>

            <button
              onClick={() => navigate({ to: '/prizes' })}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 font-semibold text-white transition-all hover:from-purple-700 hover:to-indigo-700"
            >
              Voltar para a Loja
            </button>
          </animated.div>
        </div>
      )}
    </div>
  )
}