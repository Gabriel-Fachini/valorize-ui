import { useEffect, useMemo, type ReactNode } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { User, AuthContext } from './auth'

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isAuthenticated, isLoading, user: auth0User, loginWithRedirect, logout: auth0Logout, getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    // Opcional: prefetch token para APIs protegidas, remove se não precisar
    if (isAuthenticated) {
      void getAccessTokenSilently().catch(() => {})
    }
  }, [isAuthenticated, getAccessTokenSilently])

  const mappedUser: User | null = useMemo(() => {
    if (!auth0User) return null
    return {
      id: (auth0User.sub as string) ?? 'unknown',
      email: (auth0User.email as string) ?? '',
      name: (auth0User.name as string) ?? (auth0User.nickname as string) ?? '',
    }
  }, [auth0User])

  const login = async (): Promise<void> => {
    await loginWithRedirect()
  }

  const logout = async (): Promise<void> => {
    await auth0Logout({ logoutParams: { returnTo: window.location.origin } })
  }

  return (
    <AuthContext.Provider value={{ user: mappedUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}