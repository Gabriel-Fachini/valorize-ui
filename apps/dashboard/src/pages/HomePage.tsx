import { useNavigate } from '@tanstack/react-router'
import { useSpring, animated, useTrail } from '@react-spring/web'
import { PageLayout } from '@/components/layout/PageLayout'
import { WelcomeHeader } from '@/components/dashboard'
import { OnboardingManager } from '@/components/onboarding/OnboardingManager'
import { PublicComplimentsFeed } from '@/components/compliments'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useUser } from '@/hooks/useUser'
import { usePraisesData } from '@/hooks/usePraisesData'
import { useState, useMemo } from 'react'

export const HomePage = () => {
  const navigate = useNavigate()
  const { hasAnyError } = useDashboardData()
  const { balance } = useUser()
  const { users } = usePraisesData()
  
  const [searchQuery, setSearchQuery] = useState('')

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return []
    return users
      .filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .slice(0, 5) // Show max 5 results
  }, [searchQuery, users])

  // Animação principal da página
  const pageAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { tension: 180, friction: 25 },
  })

  // Animação para seções com stagger
  const sectionsTrail = useTrail(2, {
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 100,
    config: { tension: 280, friction: 20 },
  })



  if (hasAnyError) {
    return (
      <PageLayout maxWidth="7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ph-duotone ph-warning text-red-600 dark:text-red-400" style={{ fontSize: '48px' }}></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Erro ao carregar dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Tente recarregar a página ou entre em contato com o suporte.
            </p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <>
      <OnboardingManager 
        autoStart={false}
        showWelcomeMessage={true}
        onComplete={() => {
          console.log('Onboarding completed!')
        }}
        onSkip={() => {
          console.log('Onboarding skipped!')
        }}
      />
      <PageLayout maxWidth="7xl">
        <animated.div style={pageAnimation} className="space-y-8">
        
        {/* Welcome Header */}
        <animated.div style={sectionsTrail[0]}>
          <WelcomeHeader />
        </animated.div>

        {/* Reconhecimentos */}
        <animated.div style={sectionsTrail[1]} className="relative z-30">
          {/* Container único para widget e feed */}
          <div className="bg-white/70 dark:bg-[#2a2a2a]/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-neutral-700/50 shadow-lg">

            {/* Layout vertical - Widget em cima, Feed embaixo */}
            <div className="space-y-8">

              {/* Enviar Elogio - Em Destaque */}
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                      <i className="ph-duotone ph-paper-plane-tilt text-white" style={{ fontSize: '28px' }}></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Enviar Elogio
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Reconheça um colega
                      </p>
                    </div>
                  </div>

                  {/* Saldo Display */}
                  <div className="text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Seu saldo</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-1">
                      {balance.complimentBalance}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                  Reconheça o trabalho incrível de um colega e fortaleça a cultura da empresa
                </p>
              
                {/* Search Field */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar colega para elogiar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-10 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-neutral-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <i className="ph-bold ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" style={{ fontSize: '18px' }}></i>
                
                {/* Search Results Dropdown */}
                {searchQuery && filteredUsers.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-neutral-600 rounded-xl shadow-xl max-h-60 overflow-y-auto z-[9999]">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          // Navigate to praise page with user pre-selected
                          navigate({ 
                            to: '/elogios/novo',
                            search: { userId: user.id }
                          })
                        }}
                        className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] cursor-pointer border-b border-gray-200 dark:border-neutral-700 last:border-b-0 flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#3a3a3a] flex items-center justify-center flex-shrink-0">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {user.name}
                          </div>
                          {user.department && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {user.department}
                            </div>
                          )}
                        </div>
                        <i className="ph-bold ph-arrow-right text-gray-400 dark:text-gray-500" style={{ fontSize: '16px' }}></i>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* No Results */}
                {searchQuery && filteredUsers.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-neutral-600 rounded-xl shadow-xl p-4 z-[9999]">
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                      Nenhum colega encontrado
                    </div>
                  </div>
                )}
              </div>
              
                <button
                  onClick={() => navigate({ to: '/elogios/novo' })}
                  className="w-full flex items-center justify-center gap-2 text-gray-700 dark:text-gray-200 font-semibold text-sm hover:text-gray-900 dark:hover:text-white"
                >
                  Ou começar sem seleção
                  <i className="ph-bold ph-arrow-right" style={{ fontSize: '16px' }}></i>
                </button>
              </div>

              {/* Separador */}
              <div className="border-t border-gray-200 dark:border-neutral-700"></div>

              {/* Feed de Reconhecimentos */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <i className="ph-duotone ph-sparkle text-white" style={{ fontSize: '28px' }}></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Feed de Reconhecimentos
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Últimos elogios da empresa
                    </p>
                  </div>
                </div>

                <PublicComplimentsFeed />
              </div>

            </div>
          </div>
        </animated.div>

        </animated.div>
      </PageLayout>
    </>
  )
}