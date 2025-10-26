import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './auth'
import type { User, ProviderProps } from './auth'

export const AuthProvider = ({ children }: ProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Initialize from localStorage and verify session
  useEffect(() => {
    const init = async () => {
      try {
        // Mock implementation for admin app
        // In a real implementation, this would check tokens and verify session
        const mockUser: User = {
          id: '1',
          email: 'admin@valorize.com',
          name: 'Admin User',
          avatar: undefined,
          companyId: '1'
        }
        
        setUser(mockUser)
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    void init()
  }, [])

  const login = useCallback(async (email: string, _password: string) => {
    try {
      setIsLoading(true)
      // Mock implementation for admin app
      // In a real implementation, this would call the auth service
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      const mockUser: User = {
        id: '1',
        email,
        name: 'Admin User',
        avatar: undefined,
        companyId: '1'
      }
      
      setUser(mockUser)
      return { success: true as const }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login'
      return { success: false as const, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const checkAuth = useCallback(async () => {
    // Mock implementation for admin app
    return user !== null
  }, [user])

  const value = useMemo(() => ({ user, isLoading, login, logout, checkAuth }), [user, isLoading, login, logout, checkAuth])

  return (
    <AuthContext value={value}>
      {children}
    </AuthContext>
  )
}
