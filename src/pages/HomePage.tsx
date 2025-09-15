import { useEffect } from 'react'
import { useAuth } from '@hooks/useAuth'
import { useTheme } from '@hooks/useTheme'
import { useNavigate } from '@tanstack/react-router'
import { useSpring, animated, useTrail } from '@react-spring/web'

export const HomePage = () => {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!user) {
      navigate({ to: '/login' })
    }
  }, [user, navigate])

  // Animação principal da página - entrada pela direita
  const pageAnimation = useSpring({
    from: { transform: 'translateX(100%)', opacity: 0 },
    to: { transform: 'translateX(0%)', opacity: 1 },
    config: { tension: 180, friction: 25 },
  })

  // Animação do header
  const headerAnimation = useSpring({
    from: { transform: 'translateY(-100%)', opacity: 0 },
    to: { transform: 'translateY(0%)', opacity: 1 },
    delay: 600,                    // ← Reduzido de 200ms para 100ms
    config: { tension: 200, friction: 15 },  // ← Mais rápido
  })

  // Animação para os cards de estatísticas
  const statsCards = [
    { title: 'Pontos Totais', value: '2,547', icon: '⭐', gradient: 'from-yellow-400 to-orange-500' },
    { title: 'Conquistas', value: '15', icon: '🏆', gradient: 'from-green-400 to-emerald-500' },
    { title: 'Rank', value: '#3', icon: '🏅', gradient: 'from-purple-400 to-indigo-500' },
    { title: 'Engajamento', value: '94%', icon: '💎', gradient: 'from-pink-400 to-rose-500' },
  ]

  const statsTrail = useTrail(statsCards.length, {
    from: {
      scale: 0.1,
    },
    to: {
      scale: 1,
    },
    delay: 400,                     // ← Sem delay inicial
    config: {
      tension: 280,
      friction: 10,
    },
  })

  // Animação para as features principais
  const featuresAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 250,                   // ← Reduzido drasticamente (600ms → 250ms)
    config: { tension: 280, friction: 18 },  // ← Mais rápido
  })

  return (
    <animated.div style={pageAnimation} className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <animated.div style={headerAnimation} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <span className="text-white font-bold text-xl">V</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Valorize
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Olá, {user?.name}!</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 shadow-sm hover:shadow-md"
                title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
              >
                {isDark ? (
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => void logout()}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </animated.div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <animated.div 
            style={useSpring({
              from: { opacity: 0, transform: 'scale(0.9)' },
              to: { opacity: 1, transform: 'scale(1)' },
              delay: 150,                // ← Reduzido (300ms → 150ms)
              config: { tension: 280, friction: 20 },  // ← Mais rápido
            })}
            className="text-center relative"
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <div className="w-96 h-96 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
                Bem-vindo ao{' '}
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Valorize!
                </span>
                <span className="ml-2 text-4xl">🎉</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Sua plataforma de cultura e engajamento empresarial. 
                Transforme o ambiente de trabalho com reconhecimento, recompensas e conexão real.
              </p>
            </div>
          </animated.div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {statsTrail.map((style, index) => {
            const card = statsCards[index]
            return (
              <animated.div 
                key={index}
                style={style}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{card.value}</p>
                  </div>
                  <div className={`w-14 h-14 bg-gradient-to-r ${card.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <span className="text-2xl">{card.icon}</span>
                  </div>
                </div>
              </animated.div>
            )
          })}
        </div>
      </div>

      {/* Main Features */}
      <animated.div style={featuresAnimation} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl group">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110">
                <span className="text-4xl">🏆</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Conquistas</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Acompanhe suas conquistas e marcos alcançados na empresa. 
                Cada meta atingida é uma vitória celebrada.
              </p>
              <div className="flex justify-center">
                <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl">
                  Ver Conquistas
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl group">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110">
                <span className="text-4xl">🎁</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Recompensas</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Resgate prêmios incríveis com seus pontos acumulados. 
                De vales-presente a experiências únicas.
              </p>
              <div className="flex justify-center">
                <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl">
                  Explorar Loja
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl group">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Veja suas métricas de engajamento e evolução cultural. 
                Dados que mostram seu crescimento profissional.
              </p>
              <div className="flex justify-center">
                <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl">
                  Ver Relatórios  
                </button>
              </div>
            </div>
          </div>
        </div>
      </animated.div>

      {/* Success Message */}
      <animated.div 
        style={useSpring({
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0px)' },
          delay: 350,                // ← Reduzido drasticamente (800ms → 350ms)
          config: { tension: 260, friction: 20 },  // ← Mais rápido
        })}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
      >
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-green-900 dark:text-green-100">
                Autenticação realizada com sucesso!
              </h4>
              <p className="text-green-700 dark:text-green-200 mt-1">
                Você está conectado na plataforma Valorize. Explore todas as funcionalidades disponíveis.
              </p>
            </div>
          </div>
        </div>
      </animated.div>
    </animated.div>
  )
}