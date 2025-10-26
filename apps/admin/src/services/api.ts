import axios from 'axios'
import { TokenManager } from '@/lib'
import type { ApiResponse, RefreshData } from '@/types'

// Base URL for API requests
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Create axios instance
export const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor para incluir automaticamente o token
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

// Response interceptor para lidar com refresh automático
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Se recebeu 401 e não é uma tentativa de refresh/login
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Não tentar refresh se for uma requisição de login
      if (originalRequest.url?.includes('/auth/login')) {
        return Promise.reject(error)
      }

      originalRequest._retry = true

      const refreshToken = TokenManager.getRefreshToken()
      if (refreshToken) {
        try {
          const response = await axios.post<ApiResponse<RefreshData>>(
            `${baseUrl.replace(/\/$/, '')}/auth/refresh`,
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
          // Se o refresh falhar, limpar tokens e redirecionar para login apenas se não estiver já na tela de login
          TokenManager.clearTokens()
          TokenManager.clearUserInfo()
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login'
          }
          return Promise.reject(refreshError)
        }
      }

      // Se não tem refresh token, limpar tudo e redirecionar apenas se não estiver já na tela de login
      TokenManager.clearTokens()
      TokenManager.clearUserInfo()
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)
