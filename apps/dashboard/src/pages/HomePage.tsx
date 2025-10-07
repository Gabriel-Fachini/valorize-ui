import { useNavigate } from '@tanstack/react-router'
import { useSpring, animated, useTrail } from '@react-spring/web'
import { PageLayout } from '@/components/layout/PageLayout'

export const HomePage = () => {
  const navigate = useNavigate()

  // Animação principal da página - entrada pela direita
  const pageAnimation = useSpring({
    from: { transform: 'translateX(100%)', opacity: 0 },
    to: { transform: 'translateX(0%)', opacity: 1 },
    config: { tension: 180, friction: 25 },
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

  // Animação para a seção Hero
  const heroAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
    delay: 150,                // ← Reduzido (300ms → 150ms)
    config: { tension: 280, friction: 20 },  // ← Mais rápido
  })

  return (
    <PageLayout maxWidth="7xl">
      <animated.div style={pageAnimation}>

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="pt-6 sm:pt-8 lg:pt-12 pb-6 sm:pb-8">
          <animated.div
            style={heroAnimation}
            className="text-center relative"
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <h1 data-tour="welcome" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 leading-tight">
                Bem-vindo ao{' '}
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Valorize!
                </span>
                <span className="ml-1 sm:ml-2 text-2xl sm:text-3xl lg:text-4xl">🎉</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
                Sua plataforma de cultura e engajamento empresarial. 
                Transforme o ambiente de trabalho com reconhecimento, recompensas e conexão real.
              </p>
            </div>
          </animated.div>
        </div>
      </div>

        {/* Elogios CTA Section - Moved to top */}
        <animated.div style={featuresAnimation} className="mb-6 sm:mb-8 lg:mb-12">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
          <div className="max-w-3xl mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <span className="text-3xl sm:text-4xl">✨</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              Sistema de Elogios
            </h3>
            <p className="text-base sm:text-lg lg:text-xl text-purple-100 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0">
              Reconheça seus colegas, compartilhe valores da empresa e fortaleça a cultura organizacional. 
              Cada elogio conta pontos e fortalece os laços da equipe.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button 
                onClick={() => navigate({ to: '/elogios' })}
                className="bg-white text-purple-600 px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-100 shadow-lg hover:shadow-xl"
              >
                📝 Enviar Elogio
              </button>
              <button 
                onClick={() => navigate({ to: '/elogios' })}
                className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white/30 shadow-lg hover:shadow-xl"
              >
                👀 Ver Feed
              </button>
            </div>
          </div>
        </div>
      </animated.div>

        {/* Stats Cards */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {statsTrail.map((style, index) => {
            const card = statsCards[index]
            return (
              <animated.div 
                key={index}
                style={style}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl"
              >
                <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">{card.title}</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">{card.value}</p>
                  </div>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-r ${card.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg`}>
                    <span className="text-lg sm:text-xl lg:text-2xl">{card.icon}</span>
                  </div>
                </div>
              </animated.div>
            )
          })}
        </div>
      </div>

        {/* Main Features */}
        <animated.div style={featuresAnimation} className="mb-6 sm:mb-8 lg:mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl group sm:col-span-2 lg:col-span-1">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                <span className="text-3xl sm:text-4xl">🏆</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Conquistas</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6">
                Acompanhe suas conquistas e marcos alcançados na empresa. 
                Cada meta atingida é uma vitória celebrada.
              </p>
              <div className="flex justify-center">
                <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base font-semibold hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl">
                  Ver Conquistas
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl group">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                <span className="text-3xl sm:text-4xl">🎁</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Recompensas</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6">
                Resgate prêmios incríveis com seus pontos acumulados. 
                De vales-presente a experiências únicas.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => navigate({ to: '/prizes' })}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base font-semibold hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl">
                  Explorar Loja
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl group sm:col-span-2 lg:col-span-1">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                <span className="text-3xl sm:text-4xl">📊</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Analytics</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6">
                Veja suas métricas de engajamento e evolução cultural. 
                Dados que mostram seu crescimento profissional.
              </p>
              <div className="flex justify-center">
                <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base font-semibold hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl">
                  Ver Relatórios  
                </button>
              </div>
            </div>
          </div>
        </div>
        </animated.div>

      </animated.div>
    </PageLayout>
  )
}