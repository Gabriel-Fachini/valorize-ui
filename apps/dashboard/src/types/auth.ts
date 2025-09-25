/**
 * Authentication Types
 * Types related to user authentication and authorization
 */

export interface User {
  id: string
  email: string
  name: string
  companyId?: string
}

export interface UserInfo {
  sub: string
  email: string
  email_verified?: boolean
  name?: string
  picture?: string
  companyId?: string
  isActive?: boolean
}

export interface LoginData {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
  user_info: UserInfo
}

export interface RefreshData {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
}

export interface VerifyMinimalData {
  isValid: boolean
  timeRemaining: number
  message: string
}

export interface VerifyFullData extends VerifyMinimalData {
  expiresAt: string
  timeRemainingFormatted: string
  needsRefresh: boolean
  user: UserInfo
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  checkAuth: () => Promise<boolean>
}
