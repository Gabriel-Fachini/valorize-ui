import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useSidebar } from '@/hooks/useSidebar'
import { useNavigation } from './hooks/useNavigation'
import { useSidebarActions } from './hooks/useSidebarActions'
import { UserProfile } from './components/UserProfile'
import { Navigation } from './components/Navigation'
import { BottomActions } from './components/BottomActions'

export const SidebarMobile = () => {
  const { user } = useAuth()
  const { mobileSidebarOpen, setMobileSidebarOpen } = useSidebar()
  const { currentPath, handleNavigation } = useNavigation()
  const { handleLogout } = useSidebarActions()

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
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl backdrop-saturate-150 shadow-2xl shadow-black/20 dark:shadow-black/40 lg:hidden border-r border-white/20 dark:border-gray-700/30 transition-all duration-300 ${
          mobileSidebarOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : '-translate-x-full opacity-0 pointer-events-none'
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
            onClick={() => setMobileSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-white/20 dark:hover:bg-gray-800/40 transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/20 dark:hover:border-gray-600/30"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile User Profile Section */}
        <UserProfile 
          userName={user?.name}
          userEmail={user?.email}
        />

        {/* Mobile Navigation */}
        <Navigation 
          currentPath={currentPath}
          onNavigate={handleNavigation}
        />

        {/* Mobile Bottom Actions */}
        <BottomActions onLogout={handleLogout} />
      </div>

      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-30"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
    </>
  )
}

