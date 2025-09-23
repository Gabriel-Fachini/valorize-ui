import React from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { useUserBalance } from '@/hooks/useUser'
import { useSidebar } from '@/hooks/useSidebar'
import { SkeletonCard, SkeletonText } from '@/components/ui'
import { useSpring, animated, config } from '@react-spring/web'

// Componente skeleton para os cards de saldo
const BalanceCardsSkeleton: React.FC = React.memo(() => {
  return (
    <div className="space-y-3">
      <SkeletonCard gradient="purple">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <SkeletonText width="sm" height="sm" className="mb-2" />
            <SkeletonText width="md" height="lg" />
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100/80 dark:bg-purple-800/60 backdrop-blur-sm border border-white/30 dark:border-purple-600/30 shadow-lg">
            <span className="text-lg">✨</span>
          </div>
        </div>
      </SkeletonCard>

      <SkeletonCard gradient="emerald">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <SkeletonText width="md" height="sm" className="mb-2" />
            <SkeletonText width="md" height="lg" />
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100/80 dark:bg-emerald-800/60 backdrop-blur-sm border border-white/30 dark:border-emerald-600/30 shadow-lg">
            <span className="text-lg">🎁</span>
          </div>
        </div>
      </SkeletonCard>
    </div>
  )
})

// Componente memoizado para os cards de saldo
const BalanceCards: React.FC<{ complimentBalance: number; redeemableBalance: number }> = React.memo(({ complimentBalance, redeemableBalance }) => {
  const formatBalance = React.useCallback((balance: number) => {
    return new Intl.NumberFormat('pt-BR').format(balance)
  }, [])

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-purple-900/30 dark:to-indigo-900/30 p-4 backdrop-blur-md border border-white/20 dark:border-purple-500/20 shadow-lg shadow-purple-500/10 dark:shadow-purple-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-600 dark:text-purple-400 drop-shadow-sm">
              Moedas para Elogiar
            </p>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 drop-shadow-sm">
              {formatBalance(complimentBalance)}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100/80 dark:bg-purple-800/60 backdrop-blur-sm border border-white/30 dark:border-purple-600/30 shadow-lg">
            <span className="text-lg">✨</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/30 dark:to-teal-900/30 p-4 backdrop-blur-md border border-white/20 dark:border-emerald-500/20 shadow-lg shadow-emerald-500/10 dark:shadow-emerald-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 drop-shadow-sm">
              Moedas Resgatáveis
            </p>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 drop-shadow-sm">
              {formatBalance(redeemableBalance)}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100/80 dark:bg-emerald-800/60 backdrop-blur-sm border border-white/30 dark:border-emerald-600/30 shadow-lg">
            <span className="text-lg">🎁</span>
          </div>
        </div>
      </div>
    </div>
  )
})

// Componente wrapper que gerencia loading state
const BalanceSection: React.FC = React.memo(() => {
  const { balance, isLoading } = useUserBalance()

  if (isLoading) {
    return <BalanceCardsSkeleton />
  }

  return (
    <BalanceCards 
      complimentBalance={balance.complimentBalance} 
      redeemableBalance={balance.redeemableBalance} 
    />
  )
})

export const Sidebar: React.FC = React.memo(() => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { desktopSidebarCollapsed, toggleDesktopSidebar } = useSidebar()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  // Refs para os botões de navegação (para calcular posições)
  const navButtonRefs = React.useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const navContainerRef = React.useRef<HTMLDivElement>(null)

  const mobileSidebarAnimation = useSpring({
    transform: sidebarOpen ? 'translateX(0%)' : 'translateX(-100%)',
    opacity: sidebarOpen ? 1 : 0,
    config: { tension: 280, friction: 30 },
  })

  const desktopSidebarAnimation = useSpring({
    width: desktopSidebarCollapsed ? '80px' : '320px',
    // config: { tension: 280, friction: 30 },
    config: config.gentle,
  })

  // Memoizar os links de navegação
  const navLinks = React.useMemo(() => [
    { path: '/home', label: 'Início', icon: '🏠' },
    { path: '/elogios', label: 'Elogios', icon: '✨' },
    { path: '/prizes', label: 'Prêmios', icon: '🎁' },
  ], [])

  const isActive = React.useCallback((path: string) => location.pathname === path, [location.pathname])

  // Estado para a posição do indicador animado
  const [indicatorPosition, setIndicatorPosition] = React.useState(0)
  const [isInitialized, setIsInitialized] = React.useState(false)

  // Spring para animar o indicador roxo
  const [indicatorSpring, api] = useSpring(() => ({
    transform: 'translateY(0px)',
    opacity: 1,
    config: config.gentle,
  }))

  // Função para calcular e atualizar a posição do indicador
  const updateIndicatorPosition = React.useCallback((targetPath: string) => {
    if (navContainerRef.current) {
      const buttons = navContainerRef.current.querySelectorAll('button')
      const targetIndex = navLinks.findIndex(link => link.path === targetPath)
      
      if (buttons && targetIndex >= 0 && targetIndex < buttons.length) {
        const targetButton = buttons[targetIndex] as HTMLElement
        const containerRect = navContainerRef.current.getBoundingClientRect()
        const buttonRect = targetButton.getBoundingClientRect()
        
        if (containerRect && buttonRect.height > 0) {
          const relativeTop = buttonRect.top - containerRect.top
          
          if (isInitialized) {
            // Animar da posição atual para a nova posição
            api.start({
              from: { transform: `translateY(${indicatorPosition}px)` },
              to: { transform: `translateY(${relativeTop}px)` },
            })
          } else {
            // Primeira vez, apenas definir a posição sem animação
            api.start({
              transform: `translateY(${relativeTop}px)`,
              immediate: true,
            })
            setIsInitialized(true)
          }
          
          setIndicatorPosition(relativeTop)
        }
      }
    }
  }, [navLinks, api, indicatorPosition, isInitialized])

  const handleNavigation = React.useCallback((path: string) => {
    // Atualizar a posição do indicador antes de navegar
    updateIndicatorPosition(path)
    navigate({ to: path })
    setSidebarOpen(false)
  }, [navigate, updateIndicatorPosition])

  // Inicializar a posição do indicador na primeira renderização
  React.useEffect(() => {
    const currentPath = location.pathname
    const timeoutId = setTimeout(() => updateIndicatorPosition(currentPath), 100)
    return () => clearTimeout(timeoutId)
  }, [location.pathname, updateIndicatorPosition, desktopSidebarCollapsed])

  const handleLogout = React.useCallback(() => {
    logout()
    navigate({ to: '/login' })
  }, [logout, navigate])

  return (
    <>
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 flex h-16 items-center justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl backdrop-saturate-150 border-b border-white/20 dark:border-gray-700/30 px-4 lg:hidden shadow-lg shadow-black/5 dark:shadow-black/20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 dark:bg-gray-800/40 backdrop-blur-md text-gray-700 dark:text-gray-200 hover:bg-white/30 dark:hover:bg-gray-700/50 transition-all duration-300 border border-white/20 dark:border-gray-600/30 shadow-lg shadow-black/5 dark:shadow-black/20"
            aria-label="Abrir menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl shadow-purple-500/25 backdrop-blur-sm border border-white/20">
              <span className="text-sm font-bold text-white">V</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
              Valorize
            </span>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 dark:bg-gray-800/40 backdrop-blur-md text-gray-700 dark:text-gray-200 hover:bg-white/30 dark:hover:bg-gray-700/50 transition-all duration-300 border border-white/20 dark:border-gray-600/30 shadow-lg shadow-black/5 dark:shadow-black/20"
          aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
        >
          {isDark ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <animated.aside 
        style={desktopSidebarAnimation}
        className="hidden lg:flex fixed left-0 top-0 z-40 h-screen flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl backdrop-saturate-150 border-r border-white/20 dark:border-gray-700/30 overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/30"
      >
        {/* Logo with toggle button */}
        <div className="flex h-16 items-center justify-center border-b border-white/10 dark:border-gray-700/30 backdrop-blur-sm bg-gradient-to-r from-white/10 to-white/5 dark:from-gray-800/20 dark:to-gray-800/10 px-3">
          {desktopSidebarCollapsed ? (
            <button
              onClick={toggleDesktopSidebar}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 dark:bg-gray-800/40 backdrop-blur-md text-gray-700 dark:text-gray-200 hover:bg-white/30 dark:hover:bg-gray-700/50 transition-all duration-300 border border-white/20 dark:border-gray-600/30 shadow-lg shadow-black/5 dark:shadow-black/20"
              aria-label="Expandir sidebar"
            >
              <svg 
                className="h-4 w-4 transition-transform duration-300 rotate-180" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center justify-between w-full px-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl shadow-purple-500/25 backdrop-blur-sm border border-white/20">
                  <span className="text-xl font-bold text-white">V</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
                  Valorize
                </span>
              </div>
              <button
                onClick={toggleDesktopSidebar}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 dark:bg-gray-800/40 backdrop-blur-md text-gray-700 dark:text-gray-200 hover:bg-white/30 dark:hover:bg-gray-700/50 transition-all duration-300 border border-white/20 dark:border-gray-600/30 shadow-lg shadow-black/5 dark:shadow-black/20"
                aria-label="Colapsar sidebar"
              >
                <svg 
                  className="h-4 w-4 transition-transform duration-300" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* User Profile Section */}
        <div className={desktopSidebarCollapsed ? 'flex justify-center py-4 border-b border-white/10 dark:border-gray-700/30 bg-gradient-to-b from-white/5 to-transparent dark:from-gray-800/10' : 'p-6 border-b border-white/10 dark:border-gray-700/30 bg-gradient-to-b from-white/5 to-transparent dark:from-gray-800/10'}>
          {desktopSidebarCollapsed ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl shadow-purple-500/30 backdrop-blur-sm border-2 border-white/20">
              <span className="text-lg font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl shadow-purple-500/30 backdrop-blur-sm border-2 border-white/20">
                  <span className="text-xl font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate drop-shadow-sm">
                    {user?.name ?? 'Usuário'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {user?.email ?? 'email@exemplo.com'}
                  </p>
                </div>
              </div>

              {/* Balance Cards */}
              <BalanceSection />
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className={desktopSidebarCollapsed ? 'flex-1 px-3 py-6' : 'flex-1 px-6 py-6'}>
          <div ref={navContainerRef} className="relative space-y-2">
            {/* Indicador animado */}
            <animated.div
              style={indicatorSpring}
              className={`absolute ${desktopSidebarCollapsed ? 'left-0 right-0 mx-auto w-12 h-12' : 'left-0 right-0 h-12'} bg-gradient-to-r from-purple-50/90 to-indigo-50/90 dark:from-purple-500/20 dark:to-indigo-500/20 rounded-xl shadow-lg shadow-purple-500/20 dark:shadow-purple-500/30 pointer-events-none border border-white/30 dark:border-purple-500/30 backdrop-blur-lg`}
            />
            
            {navLinks.map((link) => (
              <button
                key={link.path}
                ref={el => { navButtonRefs.current[link.path] = el }}
                onClick={() => handleNavigation(link.path)}
                className={`relative z-10 flex w-full items-center ${desktopSidebarCollapsed ? 'justify-center h-12 w-12 mx-auto' : 'gap-4 px-4'} py-3 rounded-xl text-left transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-purple-600 dark:text-purple-400 font-medium drop-shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20'
                }`}
                title={desktopSidebarCollapsed ? link.label : undefined}
              >
                <span className="text-xl drop-shadow-sm">{link.icon}</span>
                {!desktopSidebarCollapsed && <span className="font-medium">{link.label}</span>}
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className={desktopSidebarCollapsed ? 'border-t border-white/10 dark:border-gray-700/30 p-3 bg-gradient-to-t from-white/5 to-transparent dark:from-gray-800/10' : 'border-t border-white/10 dark:border-gray-700/30 p-6 bg-gradient-to-t from-white/5 to-transparent dark:from-gray-800/10'}>
          <div className="space-y-3">
            <button
              onClick={toggleTheme}
              className={`flex w-full items-center ${desktopSidebarCollapsed ? 'justify-center h-12 w-12 mx-auto' : 'gap-4 px-4'} py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all duration-300 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 border border-transparent hover:border-white/20 dark:hover:border-gray-600/30`}
              title={desktopSidebarCollapsed ? (isDark ? 'Modo Claro' : 'Modo Escuro') : undefined}
            >
              <div className={`flex items-center justify-center ${desktopSidebarCollapsed ? '' : 'h-8 w-8'}`}>
                {isDark ? (
                  <svg className="h-5 w-5 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </div>
              {!desktopSidebarCollapsed && (
                <span className="font-medium">
                  {isDark ? 'Modo Claro' : 'Modo Escuro'}
                </span>
              )}
            </button>

            <button
              onClick={handleLogout}
              className={`flex w-full items-center ${desktopSidebarCollapsed ? 'justify-center h-12 w-12 mx-auto' : 'gap-4 px-4'} py-3 rounded-xl bg-gradient-to-r from-red-50/80 to-pink-50/80 dark:from-red-900/30 dark:to-pink-900/30 text-red-600 dark:text-red-400 hover:from-red-100/80 hover:to-pink-100/80 dark:hover:from-red-800/40 dark:hover:to-pink-800/40 transition-all duration-300 backdrop-blur-md border border-white/20 dark:border-red-500/20 shadow-lg shadow-red-500/10 dark:shadow-red-500/20`}
              title={desktopSidebarCollapsed ? 'Sair' : undefined}
            >
              <svg className="h-5 w-5 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {!desktopSidebarCollapsed && <span className="font-medium drop-shadow-sm">Sair</span>}
            </button>
          </div>
        </div>
      </animated.aside>

      {/* Mobile Sidebar */}
      <animated.div
        style={mobileSidebarAnimation}
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl backdrop-saturate-150 shadow-2xl shadow-black/20 dark:shadow-black/40 lg:hidden border-r border-white/20 dark:border-gray-700/30 ${
          sidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 dark:border-gray-700/30 px-6 bg-gradient-to-r from-white/10 to-white/5 dark:from-gray-800/20 dark:to-gray-800/10">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl shadow-purple-500/25 backdrop-blur-sm border border-white/20">
              <span className="text-sm font-bold text-white">V</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
              Valorize
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-white/20 dark:hover:bg-gray-800/40 transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/20 dark:hover:border-gray-600/30"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile User Profile Section */}
        <div className="p-6 border-b border-white/10 dark:border-gray-700/30 bg-gradient-to-b from-white/5 to-transparent dark:from-gray-800/10">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl shadow-purple-500/30 backdrop-blur-sm border-2 border-white/20">
              <span className="text-xl font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate drop-shadow-sm">
                {user?.name ?? 'Usuário'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {user?.email ?? 'email@exemplo.com'}
              </p>
            </div>
          </div>

          {/* Mobile Balance Cards */}
          <BalanceSection />
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 px-6 py-6">
          <div className="relative space-y-2">
            {/* Indicador animado para mobile */}
            <animated.div
              style={indicatorSpring}
              className="absolute left-0 right-0 h-12 bg-gradient-to-r from-purple-50/90 to-indigo-50/90 dark:from-purple-500/20 dark:to-indigo-500/20 rounded-xl shadow-lg shadow-purple-500/20 dark:shadow-purple-500/30 pointer-events-none border border-white/30 dark:border-purple-500/30 backdrop-blur-lg"
            />
            
            {navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                className={`relative z-10 flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-purple-600 dark:text-purple-400 font-medium drop-shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20'
                }`}
              >
                <span className="text-xl drop-shadow-sm">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Mobile Bottom Actions */}
        <div className="border-t border-white/10 dark:border-gray-700/30 p-6 bg-gradient-to-t from-white/5 to-transparent dark:from-gray-800/10">
          <div className="space-y-3">
            <button
              onClick={toggleTheme}
              className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all duration-300 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 border border-transparent hover:border-white/20 dark:hover:border-gray-600/30"
            >
              <div className="flex h-8 w-8 items-center justify-center">
                {isDark ? (
                  <svg className="h-5 w-5 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </div>
              <span className="font-medium">
                {isDark ? 'Modo Claro' : 'Modo Escuro'}
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-4 rounded-xl bg-gradient-to-r from-red-50/80 to-pink-50/80 dark:from-red-900/30 dark:to-pink-900/30 px-4 py-3 text-red-600 dark:text-red-400 hover:from-red-100/80 hover:to-pink-100/80 dark:hover:from-red-800/40 dark:hover:to-pink-800/40 transition-all duration-300 backdrop-blur-md border border-white/20 dark:border-red-500/20 shadow-lg shadow-red-500/10 dark:shadow-red-500/20"
            >
              <svg className="h-5 w-5 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium drop-shadow-sm">Sair</span>
            </button>
          </div>
        </div>
      </animated.div>

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  )
})