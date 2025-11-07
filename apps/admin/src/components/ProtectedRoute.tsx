import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from '@tanstack/react-router'
import { useSidebar } from '@/hooks/useSidebar'
import { useSpring, animated, config } from '@react-spring/web'
import { Sidebar } from '@/components/layout/Sidebar'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const { desktopSidebarCollapsed } = useSidebar()

  // Animation for main content - always call hooks at the top level
  const mainContentAnimation = useSpring({
    marginLeft: desktopSidebarCollapsed ? '80px' : '285px',
    config: config.gentle,
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: '/login' })
    }
  }, [user, isLoading, navigate])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen relative bg-white dark:bg-[#1a1a1a]">
        <LoadingOverlay />
      </div>
    )
  }

  // Don't render protected content if not authenticated
  if (!user) {
    return null
  }

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
