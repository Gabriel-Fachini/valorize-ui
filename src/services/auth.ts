import { api } from './api'
import type {
  ApiResponse,
  UserInfo,
  LoginData,
  RefreshData,
  VerifyMinimalData,
  VerifyFullData,
} from '@types'

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
    const response = await api.post<ApiResponse<RefreshData>>('/auth/refresh', { refresh_token: refreshToken })
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

export async function verifyToken(minimal = true): Promise<ApiResponse<VerifyMinimalData | VerifyFullData>> {
  try {
    const response = await api.get<ApiResponse<VerifyMinimalData | VerifyFullData>>(
      `/auth/verify${minimal ? '?minimal=true' : ''}`,
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
    // Simplesmente verificar o token - o interceptador cuidará do refresh se necessário
    const verifyRes = await verifyToken(true)
    
    if (verifyRes.success) {
      const data = verifyRes.data as VerifyMinimalData
      return data.isValid
    }
    
    return false
  } catch (error) {
    // Log error for debugging but don't throw
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.warn('Token verification failed:', error.message)
    }
    return false
  }
}