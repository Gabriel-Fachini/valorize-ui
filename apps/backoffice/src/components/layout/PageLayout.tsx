import { useSidebar } from '@/hooks/useSidebar'
import { Sidebar } from './Sidebar'
import { cn } from '@/lib/utils'

interface PageLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export const PageLayout = ({ children, title, subtitle }: PageLayoutProps) => {
  const { desktopSidebarCollapsed } = useSidebar()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <Sidebar />
      <main
        className={cn(
          'transition-all duration-300',
          desktopSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        )}
      >
        <div className="p-8">
          {(title || subtitle) && (
            <div className="mb-8">
              {title && (
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
              )}
              {subtitle && (
                <p className="mt-2 text-gray-600 dark:text-gray-400">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  )
}
