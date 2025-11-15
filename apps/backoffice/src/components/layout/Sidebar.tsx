import { useNavigate, useLocation } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'
import { useSidebar } from '@/contexts/SidebarContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/home', icon: 'ph-house' },
  { name: 'Clientes', href: '/clients', icon: 'ph-users' },
  { name: 'Contratos', href: '/contracts', icon: 'ph-file-text' },
  { name: 'Vouchers', href: '/vouchers', icon: 'ph-package' },
  { name: 'Métricas', href: '/metrics', icon: 'ph-chart-bar' },
  { name: 'Configurações', href: '/settings', icon: 'ph-gear' },
]

export const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuth()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen flex-col bg-white dark:bg-[#1a1a1a] border-r border-gray-200 dark:border-[#242424] shadow-lg transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-72',
        'hidden lg:flex'
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-[#242424] px-4">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-primary">Valorize Backoffice</h1>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <i className={cn('ph-bold ph-list text-xl', isCollapsed && 'mx-auto')} />
        </Button>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="border-b border-gray-200 dark:border-[#242424] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <button
              key={item.name}
              onClick={() => navigate({ to: item.href })}
              className={cn(
                'w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <i className={cn(item.icon, 'ph-bold text-xl flex-shrink-0')} />
              {!isCollapsed && <span>{item.name}</span>}
            </button>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-gray-200 dark:border-[#242424] p-2 space-y-1">
        <Button
          variant="ghost"
          className={cn('w-full', isCollapsed && 'justify-center')}
          onClick={toggleTheme}
          title={isCollapsed ? 'Alternar tema' : undefined}
        >
          <i className={cn('ph-bold', theme === 'dark' ? 'ph-sun' : 'ph-moon', 'text-xl flex-shrink-0')} />
          {!isCollapsed && <span className="ml-2">Tema {theme === 'dark' ? 'Claro' : 'Escuro'}</span>}
        </Button>
        <Button
          variant="ghost"
          className={cn('w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20', isCollapsed && 'justify-center')}
          onClick={handleLogout}
          title={isCollapsed ? 'Sair' : undefined}
        >
          <i className="ph-bold ph-sign-out text-xl flex-shrink-0" />
          {!isCollapsed && <span className="ml-2">Sair</span>}
        </Button>
      </div>
    </aside>
  )
}
