import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { User, AuthContext } from './auth'
import { TokenManager, checkAndRefreshToken, loginWithEmailPassword, verifyToken, type VerifyFullData, type VerifyMinimalData, type UserInfo } from '@/services/auth'

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Initialize from localStorage and verify session
  useEffect(() => {
    const init = async () => {
      const stored = TokenManager.getUserInfo()
      if (stored) {
        setUser({ id: stored.sub, email: stored.email, name: stored.name ?? '' })
      }

      const valid = await checkAndRefreshToken()
      if (!valid) {
        TokenManager.clearTokens()
        TokenManager.clearUserInfo()
        setUser(null)
      } else {
        const verify = await verifyToken(false)
        if (verify.success) {
          const data = verify.data as VerifyFullData
          const u: UserInfo | null = data.user ?? stored
          if (u) {
            TokenManager.setUserInfo(u)
            setUser({ id: u.sub, email: u.email, name: u.name ?? '' })
          }
        }
      }
      setIsLoading(false)
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
        setUser({ id: res.data.user_info.sub, email: res.data.user_info.email, name: res.data.user_info.name ?? '' })
        return { success: true as const }
      }
      return { success: false as const, message: res.message }
    } catch (error) {
      // Propaga o erro específico se for uma instância de Error
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
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}