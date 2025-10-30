import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './auth'
import { TokenManager, checkAndRefreshToken, loginWithEmailPassword, verifyToken } from '@/services/auth'
import type { User, ProviderProps, VerifyMinimalData } from '@/types'

export const AuthProvider = ({ children }: ProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Initialize from localStorage and verify session
  useEffect(() => {
    const init = async () => {
      try {
        // Primeiro, verificar se há tokens salvos
        const accessToken = TokenManager.getAccessToken()
        const refreshToken = TokenManager.getRefreshToken()
        const stored = TokenManager.getUserInfo()

        // Se não há tokens, limpar tudo
        if (!accessToken && !refreshToken) {
          TokenManager.clearTokens()
          TokenManager.clearUserInfo()
          setUser(null)
          setIsLoading(false)
          return
        }

        // Se há informações do usuário salvas, definir temporariamente
        if (stored) {
          setUser({ 
            id: stored.sub, 
            email: stored.email,
            avatar: stored.avatar,
            name: stored.name ?? '',
            companyId: stored.companyId,
            department: stored.department,
            role: stored.role,
          })
        }

        // Verificar se os tokens são válidos
        const valid = await checkAndRefreshToken()
        if (!valid) {
          TokenManager.clearTokens()
          TokenManager.clearUserInfo()
          setUser(null)
        }
      } catch (error) {
        // Log error for debugging but don't throw
        if (error instanceof Error) {
          console.warn('Auth initialization failed:', error.message)
        }
        TokenManager.clearTokens()
        TokenManager.clearUserInfo()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    void init()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const res = await loginWithEmailPassword(email, password)
      if (res.success) {
        TokenManager.setTokens(res.data.access_token, res.data.refresh_token)
        TokenManager.setUserInfo(res.data.user_info)
        setUser({ 
          id: res.data.user_info.sub,
          avatar: res.data.user_info.avatar,
          email: res.data.user_info.email, 
          name: res.data.user_info.name ?? '',
          companyId: res.data.user_info.companyId,
          department: res.data.user_info.department,
          role: res.data.user_info.role,
        })
        return { success: true as const }
      }
      return { success: false as const, message: res.message }
    } catch (error) {
      // Propagate the specific error if it's an instance of Error
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login'
      return { success: false as const, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    TokenManager.clearTokens()
    TokenManager.clearUserInfo()
    setUser(null)
  }, [])

  const checkAuth = useCallback(async () => {
    const res = await verifyToken(true)
    if (!res.success) return false
    const data = res.data as VerifyMinimalData
    return data.isValid === true
  }, [])

  const value = useMemo(() => ({ user, isLoading, login, logout, checkAuth }), [user, isLoading, login, logout, checkAuth])

  return (
    <AuthContext value={value}>
      {children}
    </AuthContext>
  )
}
