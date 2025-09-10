import { api } from './api'

export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: string
  message: string
  statusCode: number
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export interface UserInfo {
  sub: string
  email: string
  email_verified?: boolean
  name?: string
  picture?: string
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

export const TokenManager = {
  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
  },
  getAccessToken(): string | null {
    return localStorage.getItem('access_token')
  },
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token')
  },
  clearTokens() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },
  setUserInfo(user: UserInfo) {
    localStorage.setItem('user_info', JSON.stringify(user))
  },
  getUserInfo(): UserInfo | null {
    try {
      const raw = localStorage.getItem('user_info')
      return raw ? (JSON.parse(raw) as UserInfo) : null
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to parse user_info from localStorage:', error)
      return null
    }
  },
  clearUserInfo() {
    localStorage.removeItem('user_info')
  },
}

export async function loginWithEmailPassword(email: string, password: string): Promise<ApiResponse<LoginData>> {
  try {
    const response = await api.post<ApiResponse<LoginData>>('/auth/login', { email, password })
    return response.data
  } catch (error) {
    return {
      success: false,
      error: 'Login Error',
      message: error instanceof Error ? error.message : 'Failed to login',
      statusCode: 0,
    }
  }
}

export async function refreshToken(refreshToken: string): Promise<ApiResponse<RefreshData>> {
  try {
    const response = await api.post<ApiResponse<RefreshData>>('/session/refresh', { refresh_token: refreshToken })
    return response.data
  } catch (error) {
    return {
      success: false,
      error: 'Refresh Error',
      message: error instanceof Error ? error.message : 'Failed to refresh token',
      statusCode: 0,
    }
  }
}

export async function verifyToken(minimal = true, accessToken?: string): Promise<ApiResponse<VerifyMinimalData | VerifyFullData>> {
  try {
    const token = accessToken ?? TokenManager.getAccessToken()
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    const response = await api.get<ApiResponse<VerifyMinimalData | VerifyFullData>>(
      `/session/verify${minimal ? '?minimal=true' : ''}`,
      { headers },
    )
    return response.data
  } catch (error) {
    return {
      success: false,
      error: 'Verify Error',
      message: error instanceof Error ? error.message : 'Failed to verify token',
      statusCode: 0,
    }
  }
}

export async function checkAndRefreshToken(): Promise<boolean> {
  const access = TokenManager.getAccessToken()
  if (!access) return false

  try {
    // First, try to verify the current token
    const verifyRes = await verifyToken(true, access)
    
    // If verification is successful and token is valid, return true
    if (verifyRes.success) {
      const data = verifyRes.data as VerifyMinimalData
      return data.isValid
    }

    // If token is invalid or expired, try to refresh
    const rt = TokenManager.getRefreshToken()
    if (!rt) return false

    const refreshRes = await refreshToken(rt)
    if (refreshRes.success) {
      TokenManager.setTokens(refreshRes.data.access_token, refreshRes.data.refresh_token)
      return true
    }
    
    return false
  } catch (error) {
    // Log error for debugging but don't throw
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.warn('Token check/refresh failed:', error.message)
    }
    return false
  }
}


