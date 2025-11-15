import { api } from './api'
import type {
  ApiResponse,
  LoginData,
  RefreshData,
  VerifyMinimalData,
  VerifyFullData,
} from '@types'
import { TokenManager } from '@/lib/tokenManager'

// Re-export TokenManager for convenience
export { TokenManager }

export async function loginWithEmailPassword(email: string, password: string): Promise<ApiResponse<LoginData>> {
  try {
    const response = await api.post<ApiResponse<LoginData>>('/auth/login', { email, password })
    return response.data
  } catch (error) {
    return {
      success: false,
      data: {} as LoginData,
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
      data: {} as RefreshData,
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
      data: {} as VerifyMinimalData,
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
    // Simply verify token - interceptor will handle refresh if needed
    const verifyRes = await verifyToken(true)

    if (verifyRes.success) {
      const data = verifyRes.data as VerifyMinimalData
      return data.isValid
    }

    return false
  } catch (error) {
    // Log error for debugging but don't throw
    if (error instanceof Error) {
      console.warn('Token verification failed:', error.message)
    }
    return false
  }
}
