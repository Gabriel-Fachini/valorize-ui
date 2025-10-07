import { useSidebar } from '@/hooks/useSidebar'

export const MobileHeader = () => {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useSidebar()

  const handleMenuClick = () => {
    if (navigator.vibrate) navigator.vibrate(50)
    setMobileSidebarOpen(true)
  }

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
            onClick={handleMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 dark:bg-gray-800/40 backdrop-blur-md text-gray-700 dark:text-gray-200 hover:bg-white/30 dark:hover:bg-gray-700/50 transition-all duration-300 border border-white/20 dark:border-gray-600/30 shadow-lg shadow-black/5 dark:shadow-black/20 hover:scale-105 active:scale-95"
            aria-label="Abrir menu de navegação"
            aria-expanded={mobileSidebarOpen}
            aria-controls="mobile-sidebar"
            type="button"
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
      </header>
    </>
  )
}

