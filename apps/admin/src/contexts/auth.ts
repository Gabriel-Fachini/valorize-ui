import { createContext } from 'react'

// Mock types for admin app - these should be replaced with actual types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  companyId?: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  checkAuth: () => Promise<boolean>
}

export interface ProviderProps {
  children: React.ReactNode
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
