import { useEffect } from 'react'
import { useAuth } from '@hooks/useAuth'
import { useNavigate } from '@tanstack/react-router'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: '/login' })
    }
  }, [user, isLoading, navigate])

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-3xl">V</span>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-200 font-medium">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Se não há usuário, não renderiza nada (o useEffect já redirecionou)
  if (!user) {
    return null
  }

  // Se há usuário, renderiza o conteúdo
  return <>{children}</>
}
