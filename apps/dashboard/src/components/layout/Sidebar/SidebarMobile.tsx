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
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#1a1a1a] shadow-2xl shadow-black/40 lg:hidden border-r border-gray-800 transition-all duration-300 ${
          mobileSidebarOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : '-translate-x-full opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-label="Menu de navegação móvel"
        aria-modal="true"
      >
        {/* Mobile Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-800 px-6 bg-black/20">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-xl shadow-primary/25 backdrop-blur-sm border border-white/20 p-1.5">
              <img 
                src="/logo4.svg" 
                alt="Valorize Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-lg font-bold text-white">
              Valorize
            </span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-white/10 transition-all duration-300"
          >
            <i className="ph ph-x" style={{ fontSize: '1.25rem' }} aria-hidden="true" />
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
        <BottomActions 
          currentPath={currentPath}
          onNavigate={handleNavigation}
          onLogout={handleLogout}
        />
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

