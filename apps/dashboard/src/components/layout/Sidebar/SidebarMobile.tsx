import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useSidebar } from '@/hooks/useSidebar'
import { useMobileSidebarScrollLock } from '@/hooks/useMobileSidebarScrollLock'
import { useNavigation } from './hooks/useNavigation'
import { useSidebarActions } from './hooks/useSidebarActions'
import { UserProfile } from './components/UserProfile'
import { Navigation } from './components/Navigation'
import { BottomActions } from './components/BottomActions'
import { MobileContentBlur } from './MobileContentBlur'

export const SidebarMobile = () => {
  const { user, isLoading } = useAuth()
  const { mobileSidebarOpen, setMobileSidebarOpen } = useSidebar()
  const { currentPath, handleNavigation } = useNavigation()
  const { handleLogout } = useSidebarActions()

  // Aplicar lock de scroll quando sidebar mobile estiver aberta
  useMobileSidebarScrollLock()

  useEffect(() => {
    const handleCloseMobileSidebar = () => {
      setMobileSidebarOpen(false)
    }
    
    window.addEventListener('onboarding:close-mobile-sidebar', handleCloseMobileSidebar)
    
    return () => {
      window.removeEventListener('onboarding:close-mobile-sidebar', handleCloseMobileSidebar)
    }
  }, [setMobileSidebarOpen])

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        id="mobile-sidebar"
        data-tour="sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-[#1a1a1a] shadow-2xl shadow-black/10 dark:shadow-black/40 lg:hidden border-r border-gray-200 dark:border-gray-900/50 transition-all duration-300 flex flex-col ${
          mobileSidebarOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : '-translate-x-full opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-label="Menu de navegação móvel"
        aria-modal="true"
      >
        {/* Mobile Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 bg-gray-50 dark:bg-black/20">
          <div className="flex items-center gap-3">
            <img 
              src="/logo2.svg" 
              alt="Valorize Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Valorize
            </span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300"
          >
            <i className="ph ph-x" style={{ fontSize: '1.25rem' }} aria-hidden="true" />
          </button>
        </div>

        {/* Mobile User Profile Section */}
        <UserProfile 
          userName={user?.name}
          userEmail={user?.email}
          avatarUrl={user?.avatar}
          isLoading={isLoading}
        />

        {/* Mobile Navigation */}
        <Navigation 
          currentPath={currentPath}
          onNavigate={handleNavigation}
        />

        {/* Mobile Bottom Actions - Fixed at bottom */}
        <div className="mt-auto">
          <BottomActions 
            currentPath={currentPath}
            onNavigate={handleNavigation}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-30"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Content Blur */}
      <MobileContentBlur />
    </>
  )
}

