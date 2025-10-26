import { useSidebar } from '@/hooks/useSidebar'
import { useSpring, animated, config } from '@react-spring/web'
import { Sidebar } from '@/components/layout/Sidebar'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { desktopSidebarCollapsed } = useSidebar()

  // Animation for main content
  const mainContentAnimation = useSpring({
    marginLeft: desktopSidebarCollapsed ? '80px' : '285px',
    config: config.gentle,
  })

  return (
    <>
      <Sidebar />
      <animated.div style={mainContentAnimation} className="lg:block hidden">
        <main className="min-h-screen bg-white dark:bg-[#1a1a1a]">
          {children}
        </main>
      </animated.div>
      {/* Mobile version (no margin) */}
      <div className="lg:hidden">
        <main className="min-h-screen bg-white dark:bg-[#1a1a1a]">
          {children}
        </main>
      </div>
    </>
  )
}
