import { api } from './api'
import type {
  ApiResponse,
  LoginData,
  RefreshData,
  VerifyMinimalData,
  VerifyFullData,
  RegisterFormData,
} from '@types'
import { TokenManager } from '@/lib'

// Re-export TokenManager for convenience
export { TokenManager }

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

export async function registerUser(userData: RegisterFormData): Promise<ApiResponse<{ message: string }>> {
  try {
    const response = await api.post<ApiResponse<{ message: string }>>('/auth/signup', {
      name: userData.name,
      email: userData.email,
    })
    return response.data
  } catch (error) {
    return {
      success: false,
      error: 'Register Error',
      message: error instanceof Error ? error.message : 'Failed to register user',
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
    // Log error for debugging but don't throw - only in dev
    if (import.meta.env.DEV && error instanceof Error) {
      // eslint-disable-next-line no-console
      console.warn('Token verification failed:', error.message)
    }
    return false
  }
}