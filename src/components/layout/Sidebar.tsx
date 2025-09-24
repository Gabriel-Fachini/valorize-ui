import React from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { useUserBalance } from '@/hooks/useUser'
import { useSidebar } from '@/hooks/useSidebar'
import { SkeletonCard, SkeletonText } from '@/components/ui'


// Componente skeleton para os cards de saldo (layout horizontal)
const BalanceCardsSkeleton: React.FC = React.memo(() => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <SkeletonCard gradient="purple">
        <div className="flex flex-col items-center text-center">
          <span className="text-2xl mb-2">✨</span>
          <SkeletonText width="md" height="lg" />
        </div>
      </SkeletonCard>

      <SkeletonCard gradient="emerald">
        <div className="flex flex-col items-center text-center">
          <span className="text-2xl mb-2">🎁</span>
          <SkeletonText width="md" height="lg" />
        </div>
      </SkeletonCard>
    </div>
  )
})

// Componente memoizado para os cards de saldo (layout horizontal)
const BalanceCards: React.FC<{ complimentBalance: number; redeemableBalance: number }> = React.memo(({ complimentBalance, redeemableBalance }) => {
  const formatBalance = React.useCallback((balance: number) => {
    return new Intl.NumberFormat('pt-BR').format(balance)
  }, [])

  return (
    <div className="grid grid-cols-2 gap-3">
      <div 
        className="w-auto h-16 rounded-xl bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-purple-900/30 dark:to-indigo-900/30 p-3 backdrop-blur-md border border-white/20 dark:border-purple-500/20 shadow-lg shadow-purple-500/10 dark:shadow-purple-500/20 hover:shadow-purple-500/20 dark:hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 relative group"
        title="Moedas para Elogiar"
      >
        <div className="w-auto h-auto flex gap-2 justify-center items-center text-center">
          <span className="text-2xl mb-2">✨</span>
          <p className="text-lg font-bold text-purple-700 dark:text-purple-300 drop-shadow-sm">
            {formatBalance(complimentBalance)}
          </p>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
          Moedas para Elogiar
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
        </div>
      </div>

      <div 
        className="w-auto h-16 rounded-xl bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/30 dark:to-teal-900/30 p-3 backdrop-blur-md border border-white/20 dark:border-emerald-500/20 shadow-lg shadow-emerald-500/10 dark:shadow-emerald-500/20 hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105 relative group"
        title="Moedas Resgatáveis"
      >
        <div className="flex gap-2 justify-center align-center items-center text-center">
          <span className="text-2xl mb-2">🎁</span>
          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 drop-shadow-sm">
            {formatBalance(redeemableBalance)}
          </p>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
          Moedas Resgatáveis
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
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



// Types para o reducer
interface SidebarState {
  mobileOpen: boolean
  indicatorPosition: number
  isInitialized: boolean
}

type SidebarAction = 
  | { type: 'TOGGLE_MOBILE' }
  | { type: 'SET_MOBILE_OPEN'; payload: boolean }
  | { type: 'SET_INDICATOR_POSITION'; payload: number }
  | { type: 'SET_INITIALIZED'; payload: boolean }

// Reducer para gerenciar estado da sidebar
const sidebarReducer = (state: SidebarState, action: SidebarAction): SidebarState => {
  switch (action.type) {
    case 'TOGGLE_MOBILE':
      return { ...state, mobileOpen: !state.mobileOpen }
    case 'SET_MOBILE_OPEN':
      return { ...state, mobileOpen: action.payload }
    case 'SET_INDICATOR_POSITION':
      return { ...state, indicatorPosition: action.payload }
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload }
    default:
      return state
  }
}

export const Sidebar: React.FC = React.memo(() => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { desktopSidebarCollapsed, toggleDesktopSidebar } = useSidebar()
  
  // Estado unificado com reducer
  const [sidebarState, dispatch] = React.useReducer(sidebarReducer, {
    mobileOpen: false,
    indicatorPosition: 0,
    isInitialized: false,
  })

  // Refs para os botões de navegação (para calcular posições)
  const navButtonRefs = React.useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const navContainerRef = React.useRef<HTMLDivElement>(null)



  // Memoizar os links de navegação
  const navLinks = React.useMemo(() => [
    { path: '/home', label: 'Início', icon: '🏠' },
    { path: '/elogios', label: 'Elogios', icon: '✨' },
    { path: '/prizes', label: 'Prêmios', icon: '🎁' },
    { path: '/resgates', label: 'Resgates', icon: '📦' },
    { path: '/settings', label: 'Configurações', icon: '⚙️' },
  ], [])

  const isActive = React.useCallback((path: string) => location.pathname === path, [location.pathname])



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
          
          if (!sidebarState.isInitialized) {
            dispatch({ type: 'SET_INITIALIZED', payload: true })
          }
          
          dispatch({ type: 'SET_INDICATOR_POSITION', payload: relativeTop })
        }
      }
    }
  }, [navLinks, sidebarState.isInitialized])

  const handleNavigation = React.useCallback((path: string) => {
    // Feedback tátil
    if (navigator.vibrate) navigator.vibrate(50)
    
    // Atualizar a posição do indicador antes de navegar
    updateIndicatorPosition(path)
    navigate({ to: path })
    dispatch({ type: 'SET_MOBILE_OPEN', payload: false })
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
      {/* Skip Link para acessibilidade */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Pular para o conteúdo principal
      </a>

      {/* Mobile Header */}
      <header 
        className="sticky top-0 z-50 flex h-16 items-center justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl backdrop-saturate-150 border-b border-white/20 dark:border-gray-700/30 px-4 lg:hidden shadow-lg shadow-black/5 dark:shadow-black/20"
        role="banner"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch({ type: 'SET_MOBILE_OPEN', payload: true })}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 dark:bg-gray-800/40 backdrop-blur-md text-gray-700 dark:text-gray-200 hover:bg-white/30 dark:hover:bg-gray-700/50 transition-all duration-300 border border-white/20 dark:border-gray-600/30 shadow-lg shadow-black/5 dark:shadow-black/20 hover:scale-105 active:scale-95"
            aria-label="Abrir menu de navegação"
            aria-expanded={sidebarState.mobileOpen}
            aria-controls="mobile-sidebar"
            type="button"
            onMouseDown={() => {
              // Feedback tátil no mobile
              if (navigator.vibrate) navigator.vibrate(50)
            }}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center gap-2" role="img" aria-label="Logo do Valorize">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl shadow-purple-500/25 backdrop-blur-sm border border-white/20">
              <span className="text-sm font-bold text-white" aria-hidden="true">V</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
              Valorize
            </span>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 dark:bg-gray-800/40 backdrop-blur-md text-gray-700 dark:text-gray-200 hover:bg-white/30 dark:hover:bg-gray-700/50 transition-all duration-300 border border-white/20 dark:border-gray-600/30 shadow-lg shadow-black/5 dark:shadow-black/20 hover:scale-105 active:scale-95"
          aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
          type="button"
          onMouseDown={() => {
            // Feedback tátil no mobile
            if (navigator.vibrate) navigator.vibrate(50)
          }}
        >
          {isDark ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:flex fixed left-0 top-0 z-40 h-screen flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl backdrop-saturate-150 border-r border-white/20 dark:border-gray-700/30 overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/30 transition-all duration-300 ${desktopSidebarCollapsed ? 'w-20' : 'w-72'}`}
        role="complementary"
        aria-label="Barra lateral de navegação"
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
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl shadow-purple-500/30 backdrop-blur-sm border-2 border-white/20 hover:scale-105 transition-all duration-300">
              <span className="text-lg font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl shadow-purple-500/30 backdrop-blur-sm border-2 border-white/20 hover:scale-105 transition-all duration-300">
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
        <nav 
          className={desktopSidebarCollapsed ? 'flex-1 px-3 py-6' : 'flex-1 px-6 py-6'}
          role="navigation"
          aria-label="Navegação principal"
        >
          <div ref={navContainerRef} className="relative space-y-2">
            {/* Indicador posicional */}
            <div
              style={{ transform: `translateY(${sidebarState.indicatorPosition}px)` }}
              className={`absolute ${desktopSidebarCollapsed ? 'left-0 right-0 mx-auto w-12 h-12' : 'left-0 right-0 h-12'} bg-gradient-to-r from-purple-50/90 to-indigo-50/90 dark:from-purple-500/20 dark:to-indigo-500/20 rounded-xl shadow-lg shadow-purple-500/20 dark:shadow-purple-500/30 pointer-events-none border border-white/30 dark:border-purple-500/30 backdrop-blur-lg transition-transform duration-300`}
              aria-hidden="true"
            />
            
            {navLinks.map((link) => (
              <button
                key={link.path}
                ref={el => { navButtonRefs.current[link.path] = el }}
                onClick={() => handleNavigation(link.path)}
                className={`relative z-10 flex w-full items-center ${desktopSidebarCollapsed ? 'justify-center h-12 w-12 mx-auto' : 'gap-4 px-4'} py-3 rounded-xl text-left transition-all duration-300 hover:scale-105 active:scale-95 ${
                  isActive(link.path)
                    ? 'text-purple-600 dark:text-purple-400 font-medium drop-shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20'
                }`}
                aria-current={isActive(link.path) ? 'page' : undefined}
                aria-label={desktopSidebarCollapsed ? `Ir para ${link.label}` : undefined}
                title={desktopSidebarCollapsed ? link.label : undefined}
                type="button"
              >
                <span className="text-xl drop-shadow-sm" aria-hidden="true">{link.icon}</span>
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
              className={`flex w-full items-center ${desktopSidebarCollapsed ? 'justify-center h-12 w-12 mx-auto' : 'gap-4 px-4'} py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all duration-300 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 border border-transparent hover:border-white/20 dark:hover:border-gray-600/30 hover:scale-105 active:scale-95`}
              title={desktopSidebarCollapsed ? (isDark ? 'Modo Claro' : 'Modo Escuro') : undefined}
              aria-label={desktopSidebarCollapsed ? (isDark ? 'Ativar modo claro' : 'Ativar modo escuro') : undefined}
              type="button"
              onMouseDown={() => {
                if (navigator.vibrate) navigator.vibrate(50)
              }}
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
              className={`flex w-full items-center ${desktopSidebarCollapsed ? 'justify-center h-12 w-12 mx-auto' : 'gap-4 px-4'} py-3 rounded-xl bg-gradient-to-r from-red-50/80 to-pink-50/80 dark:from-red-900/30 dark:to-pink-900/30 text-red-600 dark:text-red-400 hover:from-red-100/80 hover:to-pink-100/80 dark:hover:from-red-800/40 dark:hover:to-pink-800/40 transition-all duration-300 backdrop-blur-md border border-white/20 dark:border-red-500/20 shadow-lg shadow-red-500/10 dark:shadow-red-500/20 hover:scale-105 active:scale-95`}
              title={desktopSidebarCollapsed ? 'Sair' : undefined}
              aria-label={desktopSidebarCollapsed ? 'Sair da conta' : undefined}
              type="button"
              onMouseDown={() => {
                if (navigator.vibrate) navigator.vibrate(100)
              }}
            >
              <svg className="h-5 w-5 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {!desktopSidebarCollapsed && <span className="font-medium drop-shadow-sm">Sair</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div
        id="mobile-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl backdrop-saturate-150 shadow-2xl shadow-black/20 dark:shadow-black/40 lg:hidden border-r border-white/20 dark:border-gray-700/30 transition-all duration-300 ${
          sidebarState.mobileOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : '-translate-x-full opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-label="Menu de navegação móvel"
        aria-modal="true"
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
            onClick={() => dispatch({ type: 'SET_MOBILE_OPEN', payload: false })}
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
        <nav 
          className="flex-1 px-6 py-6"
          role="navigation"
          aria-label="Navegação principal móvel"
        >
          <div className="relative space-y-2">
            {/* Indicador posicional para mobile */}
            <div
              style={{ transform: `translateY(${sidebarState.indicatorPosition}px)` }}
              className="absolute left-0 right-0 h-12 bg-gradient-to-r from-purple-50/90 to-indigo-50/90 dark:from-purple-500/20 dark:to-indigo-500/20 rounded-xl shadow-lg shadow-purple-500/20 dark:shadow-purple-500/30 pointer-events-none border border-white/30 dark:border-purple-500/30 backdrop-blur-lg transition-transform duration-300"
              aria-hidden="true"
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
                aria-current={isActive(link.path) ? 'page' : undefined}
                type="button"
              >
                <span className="text-xl drop-shadow-sm" aria-hidden="true">{link.icon}</span>
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
              className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all duration-300 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 border border-transparent hover:border-white/20 dark:hover:border-gray-600/30 hover:scale-105 active:scale-95"
              type="button"
              onMouseDown={() => {
                if (navigator.vibrate) navigator.vibrate(50)
              }}
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
              className="flex w-full items-center gap-4 rounded-xl bg-gradient-to-r from-red-50/80 to-pink-50/80 dark:from-red-900/30 dark:to-pink-900/30 px-4 py-3 text-red-600 dark:text-red-400 hover:from-red-100/80 hover:to-pink-100/80 dark:hover:from-red-800/40 dark:hover:to-pink-800/40 transition-all duration-300 backdrop-blur-md border border-white/20 dark:border-red-500/20 shadow-lg shadow-red-500/10 dark:shadow-red-500/20 hover:scale-105 active:scale-95"
              type="button"
              onMouseDown={() => {
                if (navigator.vibrate) navigator.vibrate(100)
              }}
            >
              <svg className="h-5 w-5 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium drop-shadow-sm">Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {sidebarState.mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-40"
          onClick={() => dispatch({ type: 'SET_MOBILE_OPEN', payload: false })}
        />
      )}
    </>
  )
})