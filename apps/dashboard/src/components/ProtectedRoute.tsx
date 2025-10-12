import { useEffect } from 'react'
import { useAuth } from '@hooks/useAuth'
import { useNavigate } from '@tanstack/react-router'
import { Sidebar } from '@/components/layout/Sidebar'
import { useSidebar } from '@/hooks/useSidebar'
import { useSpring, animated, config } from '@react-spring/web'

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
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            {/* Círculo animado com gradiente verde */}
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
            {/* Logo V centralizado */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-4xl drop-shadow-lg">V</span>
            </div>
            {/* Anel externo animado */}
            <div className="absolute inset-0 rounded-full border-4 border-green-400/30 animate-ping"></div>
          </div>
          <p className="text-gray-300 font-medium text-lg">Verificando autenticação...</p>
        </div>
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
        <main className="min-h-screen bg-[#1a1a1a]">
          {children}
        </main>
      </animated.div>
      {/* Mobile version (no margin) */}
      <div className="lg:hidden">
        <main className="min-h-screen bg-[#1a1a1a]">
          {children}
        </main>
      </div>
    </>
  )
}
