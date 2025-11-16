import axios from 'axios'
import { TokenManager } from '@/lib/tokenManager'
import type { ApiResponse } from '@types'

interface RefreshData {
  access_token: string
  refresh_token: string
}

// Base URL for API requests
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// Create axios instance
export const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to include token automatically
api.interceptors.request.use(
  (config) => {
    const token = TokenManager.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for automatic refresh
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If received 401 and not a retry attempt
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't try refresh if it's a login request
      if (originalRequest.url?.includes('/auth/login')) {
        return Promise.reject(error)
      }

      originalRequest._retry = true

      const refreshToken = TokenManager.getRefreshToken()
      if (refreshToken) {
        try {
          const response = await axios.post<ApiResponse<RefreshData>>(
            `${baseUrl.replace(/\/$/, '')}/backoffice/auth/refresh`,
            { refresh_token: refreshToken },
            {
              headers: { 'Content-Type': 'application/json' },
            },
          )

          if (response.data.success) {
            TokenManager.setTokens(response.data.data.access_token, response.data.data.refresh_token)
            originalRequest.headers.Authorization = `Bearer ${response.data.data.access_token}`
            return api(originalRequest)
          }
        } catch (refreshError) {
          // If refresh fails, clear tokens and redirect to login
          TokenManager.clearTokens()
          TokenManager.clearUserInfo()
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login'
          }
          return Promise.reject(refreshError)
        }
      }

      // If no refresh token, clear everything and redirect
      TokenManager.clearTokens()
      TokenManager.clearUserInfo()
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)
