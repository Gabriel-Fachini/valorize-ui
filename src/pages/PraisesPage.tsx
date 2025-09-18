import { useState } from 'react'
import { useSpring, animated, useTrail, useTransition } from '@react-spring/web'
import { PraiseModal } from '@/components/PraiseModal'

interface Praise {
  id: string
  from: {
    name: string
    avatar?: string
  }
  to: {
    name: string
    avatar?: string
  }
  message: string
  value: string
  coins: number
  createdAt: string
}

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  department: string
}

interface CompanyValue {
  id: string
  name: string
  description: string
  color: string
  icon: string
}

// Mock data for demonstration
const mockPraises: Praise[] = [
  {
    id: '1',
    from: { name: 'Ana Silva' },
    to: { name: 'Carlos Santos' },
    message: 'Excelente trabalho na apresentação do projeto! Sua dedicação e atenção aos detalhes fizeram toda a diferença.',
    value: 'Excelência',
    coins: 50,
    createdAt: '2024-01-18T10:30:00Z',
  },
  {
    id: '2',
    from: { name: 'João Pedro' },
    to: { name: 'Maria Oliveira' },
    message: 'Obrigado por sempre estar disposta a ajudar a equipe. Sua colaboração é inspiradora!',
    value: 'Colaboração',
    coins: 30,
    createdAt: '2024-01-18T09:15:00Z',
  },
  {
    id: '3',
    from: { name: 'Lucas Costa' },
    to: { name: 'Fernanda Lima' },
    message: 'Sua criatividade na solução do problema foi incrível. Parabéns pela inovação!',
    value: 'Inovação',
    coins: 40,
    createdAt: '2024-01-17T16:45:00Z',
  },
]

// Mock data for users
const mockUsers: User[] = [
  { id: '1', name: 'Ana Silva', email: 'ana.silva@empresa.com', department: 'Marketing' },
  { id: '2', name: 'Carlos Santos', email: 'carlos.santos@empresa.com', department: 'Tecnologia' },
  { id: '3', name: 'Maria Oliveira', email: 'maria.oliveira@empresa.com', department: 'Vendas' },
  { id: '4', name: 'João Pedro', email: 'joao.pedro@empresa.com', department: 'RH' },
  { id: '5', name: 'Fernanda Lima', email: 'fernanda.lima@empresa.com', department: 'Design' },
  { id: '6', name: 'Lucas Costa', email: 'lucas.costa@empresa.com', department: 'Produto' },
  { id: '7', name: 'Beatriz Alves', email: 'beatriz.alves@empresa.com', department: 'Financeiro' },
  { id: '8', name: 'Rafael Mendes', email: 'rafael.mendes@empresa.com', department: 'Operações' },
]

// Mock data for company values
const mockCompanyValues: CompanyValue[] = [
  {
    id: '1',
    name: 'Excelência',
    description: 'Buscar sempre a melhor qualidade em tudo que fazemos',
    color: 'from-purple-500 to-indigo-600',
    icon: '⭐',
  },
  {
    id: '2',
    name: 'Colaboração',
    description: 'Trabalhar em equipe para alcançar objetivos comuns',
    color: 'from-green-500 to-emerald-600',
    icon: '🤝',
  },
  {
    id: '3',
    name: 'Inovação',
    description: 'Pensar fora da caixa e criar soluções criativas',
    color: 'from-blue-500 to-cyan-600',
    icon: '💡',
  },
  {
    id: '4',
    name: 'Liderança',
    description: 'Inspirar e guiar outros para o sucesso',
    color: 'from-orange-500 to-red-600',
    icon: '👑',
  },
  {
    id: '5',
    name: 'Dedicação',
    description: 'Comprometimento total com nossos objetivos',
    color: 'from-pink-500 to-rose-600',
    icon: '💪',
  },
]

const valueColors = {
  'Excelência': 'from-purple-500 to-indigo-600',
  'Colaboração': 'from-green-500 to-emerald-600',
  'Inovação': 'from-blue-500 to-cyan-600',
  'Liderança': 'from-orange-500 to-red-600',
  'Dedicação': 'from-pink-500 to-rose-600',
}

export const PraisesPage = () => {
  const [showModal, setShowModal] = useState(false)
  const [praises] = useState<Praise[]>(mockPraises)
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastPraise, setLastPraise] = useState<{ user: User; value: CompanyValue; coins: number } | null>(null)

  // Liquid Glass page animation
  const pageAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 200, friction: 15 },
  })

  // Header animation
  const headerAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(-30px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 200,
    config: { tension: 280, friction: 15 },
  })

  // Floating button animation
  const fabAnimation = useSpring({
    from: { scale: 0, rotate: -180 },
    to: { scale: 1, rotate: 0 },
    delay: 800,
    config: { tension: 260, friction: 15 },
  })

  // Trail animation for praise cards
  const praisesTrail = useTrail(praises.length, {
    from: { opacity: 0, transform: 'translateY(50px) scale(0.9)' },
    to: { opacity: 1, transform: 'translateY(0px) scale(1)' },
    delay: 200,
    config: { tension: 200, friction: 15 },
  })

  // Stats cards animation
  const statsTrail = useTrail(3, {
    from: { opacity: 0, transform: 'translateY(30px) scale(0.4)' },
    to: { opacity: 1, transform: 'translateY(0px) scale(1)' },
    delay: 300,
    config: { tension: 200, friction: 15 },
  })

  // Feed section animation
  const feedSectionAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 600,
    config: { tension: 200, friction: 20 },
  })

  // Filter buttons animation
  const filterAnimation = useSpring({
    from: { opacity: 0, transform: 'translateX(20px)' },
    to: { opacity: 1, transform: 'translateX(0px)' },
    delay: 700,
    config: { tension: 280, friction: 20 },
  })

  // Success animation
  const successTransition = useTransition(showSuccess, {
    from: { opacity: 0, transform: 'scale(0.8) rotate(-10deg)' },
    enter: { opacity: 1, transform: 'scale(1) rotate(0deg)' },
    leave: { opacity: 0, transform: 'scale(0.8) rotate(10deg)' },
    config: { tension: 200, friction: 15 },
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <animated.div 
      style={pageAnimation}
      className="min-h-screen bg-gradient-to-br from-gray-50/80 via-white/60 to-purple-50/80 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/95"
    >
      {/* Liquid Glass Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/15 to-cyan-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-gradient-to-br from-pink-400/20 to-rose-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header with Liquid Glass effect */}
      <animated.div 
        style={headerAnimation}
        className="sticky top-0 z-50 bg-white/40 dark:bg-gray-800/30 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/30"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 hover:bg-white/80 dark:hover:bg-gray-600/80 duration-200"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Elogios
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                  Reconheça e celebre sua equipe
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center space-x-1 sm:space-x-2 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-lg sm:rounded-xl px-2 sm:px-4 py-1.5 sm:py-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-md sm:rounded-lg flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-bold text-white">💰</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">250</span>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">moedas</span>
              </div>
            </div>
          </div>
        </div>
      </animated.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        
        {/* Stats Cards with Liquid Glass */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {statsTrail.map((style, index) => {
            const stats = [
              { label: 'Enviados', value: '12', icon: '📤', gradient: 'from-green-400 to-emerald-500' },
              { label: 'Recebidos', value: '8', icon: '📥', gradient: 'from-blue-400 to-indigo-500' },
              { label: 'Pontos', value: '420', icon: '⭐', gradient: 'from-purple-400 to-pink-500' },
            ]
            const stat = stats[index]
            
            return (
              <animated.div 
                key={index}
                style={style}
                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl hover:scale-105 duration-300"
              >
                <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">{stat.label}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${stat.gradient} rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg`}>
                    <span className="text-lg sm:text-xl">{stat.icon}</span>
                  </div>
                </div>
              </animated.div>
            )
          })}
        </div>

        {/* Feed Section */}
        <animated.div style={feedSectionAnimation} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
              Feed de Reconhecimentos
            </h2>
            <animated.div style={filterAnimation} className="flex flex-wrap gap-2 sm:space-x-2">
              <button className="px-3 py-2 sm:px-4 sm:py-2 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/80 hover:scale-105 duration-200">
                Todos
              </button>
              <button className="px-3 py-2 sm:px-4 sm:py-2 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/80 hover:scale-105 duration-200">
                Recebidos
              </button>
              <button className="px-3 py-2 sm:px-4 sm:py-2 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/80 hover:scale-105 duration-200">
                Enviados
              </button>
            </animated.div>
          </div>

          {/* Praise Cards */}
          <div className="space-y-4 sm:space-y-6">
            {praisesTrail.map((style, index) => {
              const praise = praises[index]
              const valueColor = valueColors[praise.value as keyof typeof valueColors] || valueColors['Excelência']
              
              return (
                <animated.div
                  key={praise.id}
                  style={style}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl hover:shadow-2xl duration-300 group"
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    {/* Avatar From */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-semibold text-sm sm:text-lg">
                          {praise.from.name.charAt(0)}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 sm:gap-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                            {praise.from.name}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">→</span>
                          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                            {praise.to.name}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(praise.createdAt)}
                        </span>
                      </div>

                      {/* Message */}
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
                        {praise.message}
                      </p>

                      {/* Footer */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                        <div className={`inline-flex items-center px-3 py-1.5 bg-gradient-to-r ${valueColor} rounded-full shadow-lg`}>
                          <span className="text-white text-sm font-semibold">
                            {praise.value}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                            <span className="text-yellow-600 dark:text-yellow-400 text-xs sm:text-sm">💰</span>
                            <span className="text-yellow-700 dark:text-yellow-300 font-semibold text-xs sm:text-sm">
                              +{praise.coins}
                            </span>
                          </div>
                          
                          <button className="p-1.5 sm:p-2 rounded-full bg-gray-100/80 dark:bg-gray-700/80 hover:bg-gray-200/80 dark:hover:bg-gray-600/80 transition-colors">
                            <span className="text-red-500 text-sm sm:text-base">❤️</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </animated.div>
              )
            })}
          </div>
        </animated.div>
      </div>

      {/* Floating Action Button - Liquid Glass */}
      <animated.button
        style={fabAnimation}
        onClick={() => setShowModal(true)}
        className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-3xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold hover:scale-110 duration-300 backdrop-blur-xl border border-white/20"
      >
        <span>✨</span>
      </animated.button>

      {/* Praise Modal */}
      <PraiseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={(data) => {
          setLastPraise({ user: data.user, value: data.value, coins: data.coins })
          setShowSuccess(true)
          setTimeout(() => setShowSuccess(false), 3000)
        }}
        users={mockUsers}
        companyValues={mockCompanyValues}
      />

      {/* Success Animation */}
      {successTransition((style, item) =>
        item ? (
          <animated.div
            style={style}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
          >
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-white text-4xl">🎉</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Elogio Enviado!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Seu reconhecimento foi enviado para <strong>{lastPraise?.user.name}</strong> com sucesso!
              </p>
              <div className="flex items-center justify-center space-x-2 text-yellow-600 dark:text-yellow-400">
                <span className="text-2xl">💰</span>
                <span className="font-bold text-lg">+{lastPraise?.coins} moedas enviadas</span>
              </div>
            </div>
          </animated.div>
        ) : null,
      )}
    </animated.div>
  )
}
