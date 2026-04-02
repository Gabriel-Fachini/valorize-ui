import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './auth'
import { TokenManager, checkAndRefreshToken, loginWithEmailPassword, verifyToken } from '@/services/auth'
import type { User, VerifyFullData, VerifyMinimalData, UserInfo, ProviderProps, LoginData } from '@types'

export const AuthProvider = ({ children }: ProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const applyLoginData = useCallback((loginData: LoginData) => {
    TokenManager.setTokens(loginData.access_token, loginData.refresh_token)
    TokenManager.setUserInfo(loginData.user_info)
    setUser({
      id: loginData.user_info.sub,
      avatar: loginData.user_info.avatar,
      email: loginData.user_info.email,
      name: loginData.user_info.name ?? '',
      companyId: loginData.user_info.companyId,
    })
  }, [])

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
          })
        }

        // Verificar se os tokens são válidos
        const valid = await checkAndRefreshToken()
        if (!valid) {
          TokenManager.clearTokens()
          TokenManager.clearUserInfo()
          setUser(null)
        } else {
          // Se tokens são válidos, obter informações atualizadas do usuário
          try {
            const verify = await verifyToken(false)
            if (verify.success) {
              const data = verify.data as VerifyFullData
              const u: UserInfo | null = data.user ?? stored
              if (u) {
                TokenManager.setUserInfo(u)
                setUser({ 
                  id: u.sub, 
                  email: u.email,
                  avatar: u.avatar,
                  name: u.name ?? '',
                  companyId: u.companyId,
                })
              }
            }
          } catch {
            // Se falhar ao verificar informações completas, manter as informações básicas
          }
        }
      } catch {
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
        applyLoginData(res.data)
        return { success: true as const }
      } else {
        if ('message' in res) {
          return { success: false as const, message: res.message }
        }
        return { success: false as const, message: 'An unknown error occurred' }
      }
    } catch (error) {
      // Propagate the specific error if it's an instance of Error
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login'
      return { success: false as const, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [applyLoginData])

  const finishLogin = useCallback((loginData: LoginData) => {
    applyLoginData(loginData)
  }, [applyLoginData])

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

  const value = useMemo(
    () => ({ user, isLoading, login, finishLogin, logout, checkAuth }),
    [user, isLoading, login, finishLogin, logout, checkAuth],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
