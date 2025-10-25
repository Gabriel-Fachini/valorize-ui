import { useEffect } from 'react'
import { useAuth } from '@hooks/useAuth'
import { useNavigate } from '@tanstack/react-router'
import { Sidebar } from '@/components/layout/Sidebar'
import { useSidebar } from '@/hooks/useSidebar'
import { useSpring, animated, config } from '@react-spring/web'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth()
  const { desktopSidebarCollapsed } = useSidebar()
  const navigate = useNavigate()

  // Animação para o conteúdo principal
  const mainContentAnimation = useSpring({
    marginLeft: desktopSidebarCollapsed ? '80px' : '285px',
    config: config.gentle,
  })

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: '/login' })
    }
  }, [user, isLoading, navigate])

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen relative bg-white dark:bg-[#1a1a1a]">
        <LoadingOverlay />
      </div>
    )
  }

  // Se não há usuário, não renderiza nada (o useEffect já redirecionou)
  if (!user) {
    return null
  }

  // Se há usuário, renderiza o conteúdo com a Sidebar
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
