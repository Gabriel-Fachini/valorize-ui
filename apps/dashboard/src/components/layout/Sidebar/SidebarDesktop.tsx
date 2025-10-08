import { useAuth } from '@/hooks/useAuth'
import { useSidebar } from '@/hooks/useSidebar'
import { useNavigation } from './hooks/useNavigation'
import { useSidebarActions } from './hooks/useSidebarActions'
import { Logo } from './components/Logo'
import { UserProfile } from './components/UserProfile'
import { Navigation } from './components/Navigation'
import { BottomActions } from './components/BottomActions'

export const SidebarDesktop = () => {
  const { user } = useAuth()
  const { desktopSidebarCollapsed, toggleDesktopSidebar } = useSidebar()
  const { currentPath, handleNavigation } = useNavigation()
  const { handleLogout } = useSidebarActions()

  return (
    <aside 
      data-tour="sidebar"
      className={`hidden lg:flex fixed left-0 top-0 z-40 h-screen flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl backdrop-saturate-150 border-r border-white/20 dark:border-gray-700/30 overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/30 transition-all duration-300 ${
        desktopSidebarCollapsed ? 'w-20' : 'w-72'
      }`}
      role="complementary"
      aria-label="Barra lateral de navegação"
    >
      {/* Logo with toggle button */}
      <div className="flex h-16 items-center justify-center border-b border-white/10 dark:border-gray-700/30 backdrop-blur-sm bg-gradient-to-r from-white/10 to-white/5 dark:from-gray-800/20 dark:to-gray-800/10 px-3">
        <Logo 
          collapsed={desktopSidebarCollapsed} 
          onToggle={toggleDesktopSidebar} 
          showToggle={true}
        />
      </div>

      {/* User Profile Section */}
      <UserProfile 
        collapsed={desktopSidebarCollapsed}
        userName={user?.name}
        userEmail={user?.email}
        avatarUrl={user?.avatar}
      />

      {/* Navigation */}
      <Navigation 
        collapsed={desktopSidebarCollapsed}
        currentPath={currentPath}
        onNavigate={handleNavigation}
      />

      {/* Bottom Actions */}
      <BottomActions 
        collapsed={desktopSidebarCollapsed}
        onLogout={handleLogout}
      />
    </aside>
  )
}

