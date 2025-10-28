import { useNavigate } from '@tanstack/react-router'
import { useSpring, animated, useTrail } from '@react-spring/web'
import { PageLayout } from '@/components/layout/PageLayout'
import {
  WelcomeHeader,
  SectionHeader,
  NewsCard,
  EventCard,
} from '@/components/dashboard'
import { OnboardingManager } from '@/components/onboarding/OnboardingManager'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useUser } from '@/hooks/useUser'
import { usePrizes } from '@/hooks/usePrizes'
import { usePraisesData } from '@/hooks/usePraisesData'
import { useState, useMemo } from 'react'

export const HomePage = () => {
  const navigate = useNavigate()
  const { news, events, hasAnyError } = useDashboardData()
  const { balance } = useUser()
  const { data: prizesData } = usePrizes({ sortBy: 'newest' }, 1, 5)
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

  // Mock data for courses/training
  const courses = [
    {
      id: 1,
      title: 'Fundamentos de Liderança',
      type: 'Curso',
      duration: '4h 30min',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
      progress: 65,
      category: 'Liderança',
    },
    {
      id: 2,
      title: 'Comunicação Efetiva no Trabalho',
      type: 'Vídeo',
      duration: '45min',
      thumbnail: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=250&fit=crop',
      progress: 0,
      category: 'Soft Skills',
    },
    {
      id: 3,
      title: 'Gestão de Tempo e Produtividade',
      type: 'Treinamento',
      duration: '2h 15min',
      thumbnail: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=250&fit=crop',
      progress: 100,
      category: 'Produtividade',
    },
    {
      id: 4,
      title: 'Trabalho em Equipe e Colaboração',
      type: 'Curso',
      duration: '3h 20min',
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop',
      progress: 30,
      category: 'Colaboração',
    },
  ]

  // Animação principal da página
  const pageAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { tension: 180, friction: 25 },
  })

  // Animação para seções com stagger
  const sectionsTrail = useTrail(5, {
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

        {/* Ações Rápidas */}
        <animated.div style={sectionsTrail[1]} className="relative z-30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Enviar Elogio - Com Saldo e Busca */}
            <div className="bg-white/70 dark:bg-[#2a2a2a]/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-neutral-700/50 hover:border-gray-300 dark:hover:border-neutral-600 shadow-lg hover:shadow-xl transition-all duration-200 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gray-100 dark:bg-[#3a3a3a] rounded-xl flex items-center justify-center shadow-lg">
                    <i className="ph-duotone ph-paper-plane-tilt text-gray-700 dark:text-green-600" style={{ fontSize: '28px' }}></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Enviar Elogio
                  </h3>
                </div>
                
                {/* Saldo Display */}
                <div className="text-right">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Seu saldo</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-1">
                    {balance.complimentBalance}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-sm">
                Reconheça o trabalho incrível de um colega e fortaleça a cultura da empresa
              </p>
              
              {/* Search Field */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Buscar colega para elogiar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-neutral-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
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
                            search: { userId: user.id },
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
                className="w-full flex items-center justify-center gap-2 text-gray-700 dark:text-gray-200 font-semibold text-sm hover:text-gray-900 dark:hover:text-white "
              >
                Ou começar sem seleção
                <i className="ph-bold ph-arrow-right" style={{ fontSize: '16px' }}></i>
              </button>
            </div>

            {/* Explorar Prêmios - Com Thumbnails */}
            <div className="bg-white/70 dark:bg-[#2a2a2a]/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-neutral-700/50 hover:border-gray-300 dark:hover:border-neutral-600 shadow-lg hover:shadow-xl transition-all duration-200 relative z-0">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gray-100 dark:bg-[#3a3a3a] rounded-xl flex items-center justify-center shadow-lg">
                  <i className="ph-duotone ph-gift text-gray-700 dark:text-red-400" style={{ fontSize: '28px' }}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Explorar Prêmios
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                Novidades na loja! Confira os prêmios adicionados recentemente
              </p>
              
              {/* Prize Thumbnails */}
              {prizesData && prizesData.prizes.length > 0 ? (
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {prizesData.prizes.slice(0, 5).map((prize) => (
                    <div
                      key={prize.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate({ to: `/prizes/${prize.id}` })
                      }}
                      className="aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700 hover:border-gray-400 dark:hover:border-neutral-500 cursor-pointer  hover:scale-105 group/prize"
                    >
                      {prize.images && prize.images.length > 0 ? (
                        <img
                          src={prize.images[0]}
                          alt={prize.name}
                          className="w-full h-full object-cover"
                          title={prize.name}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 dark:bg-[#3a3a3a] flex items-center justify-center">
                          <i className="ph-duotone ph-gift text-gray-400 dark:text-gray-600" style={{ fontSize: '20px' }}></i>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-20 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                  Carregando prêmios...
                </div>
              )}
              
              <button
                onClick={() => navigate({ to: '/prizes' })}
                className="w-full flex items-center justify-center gap-2 text-gray-700 dark:text-gray-200 font-semibold text-sm hover:text-gray-900 dark:hover:text-white "
              >
                Ver todos os prêmios
                <i className="ph-bold ph-arrow-right" style={{ fontSize: '16px' }}></i>
              </button>
            </div>
          </div>
        </animated.div>

        {/* Notícias da Empresa */}
        {news.length > 0 && (
          <animated.div style={sectionsTrail[2]}>
            <SectionHeader
              title="Notícias da Empresa"
              icon={<i className="ph-duotone ph-newspaper" style={{ fontSize: '24px' }}></i>}
              onViewAll={() => navigate({ to: '/noticias' })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {news.slice(0, 4).map((item) => (
                <div key={item.id} onClick={() => navigate({ to: '/noticias' })}>
                  <NewsCard news={item} />
                </div>
              ))}
            </div>
          </animated.div>
        )}

        {/* Eventos Próximos */}
        {events.length > 0 && (
          <animated.div style={sectionsTrail[3]}>
            <SectionHeader
              title="Próximos Eventos"
              icon={<i className="ph-duotone ph-calendar-blank" style={{ fontSize: '24px' }}></i>}
              onViewAll={() => navigate({ to: '/eventos' })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {events.slice(0, 3).map((item) => (
                <div key={item.id} onClick={() => navigate({ to: '/eventos' })}>
                  <EventCard event={item} />
                </div>
              ))}
            </div>
          </animated.div>
        )}

        {/* Cursos e Treinamentos */}
        <animated.div style={sectionsTrail[4]}>
          <SectionHeader
            title="Cursos e Treinamentos"
            icon={<i className="ph-duotone ph-graduation-cap" style={{ fontSize: '24px' }}></i>}
            onViewAll={() => navigate({ to: '/treinamentos' })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => navigate({ to: '/treinamentos' })}
                className="group bg-white/70 dark:bg-[#2a2a2a]/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200/50 dark:border-neutral-700/50 hover:border-gray-300 dark:hover:border-neutral-600 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-gray-900/80 dark:bg-gray-100/90 backdrop-blur-sm text-white dark:text-gray-900 text-xs font-semibold rounded-full">
                      {course.type}
                    </span>
                  </div>
                  {course.progress > 0 && (
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                        {course.progress}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-[#3a3a3a] text-gray-700 dark:text-gray-300 text-xs font-medium rounded">
                      {course.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <i className="ph-bold ph-clock" style={{ fontSize: '14px' }}></i>
                      {course.duration}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-200 ">
                    {course.title}
                  </h3>

                  {/* Progress Bar */}
                  {course.progress > 0 && (
                    <div className="space-y-1">
                      <div className="w-full bg-gray-200 dark:bg-[#3a3a3a] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {course.progress === 100 ? 'Concluído' : 'Em progresso'}
                      </p>
                    </div>
                  )}

                  {course.progress === 0 && (
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-[#3a3a3a] text-gray-700 dark:text-gray-200 font-semibold text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-[#4a4a4a] ">
                      Começar agora
                      <i className="ph-bold ph-arrow-right" style={{ fontSize: '16px' }}></i>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </animated.div>

        </animated.div>
      </PageLayout>
    </>
  )
}