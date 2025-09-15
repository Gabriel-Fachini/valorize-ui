import axios from 'axios'
import type { ApiResponse, RefreshData } from '@types'
import { router } from '@/router'

const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined

if (!baseUrl) {
  throw new Error('Api base url environment variable is required')
}

// Uma única instância simples do Axios
export const api = axios.create({
  baseURL: baseUrl.replace(/\/$/, ''),
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token manager functions (moved here to avoid circular dependency)
const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token')
}

const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token')
}

const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('access_token', accessToken)
  localStorage.setItem('refresh_token', refreshToken)
}

const clearTokens = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user_info')
}

// Request interceptor para incluir automaticamente o token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
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

      const refreshToken = getRefreshToken()
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
            setTokens(response.data.data.access_token, response.data.data.refresh_token)
            originalRequest.headers.Authorization = `Bearer ${response.data.data.access_token}`
            return api(originalRequest)
          }
        } catch (refreshError) {
          // Se o refresh falhar, limpar tokens e redirecionar para login apenas se não estiver já na tela de login
          clearTokens()
          if (!router.state.location.pathname.includes('/login')) {
            router.navigate({ to: '/login' })
          }
          return Promise.reject(refreshError)
        }
      }

      // Se não tem refresh token, limpar tudo e redirecionar apenas se não estiver já na tela de login
      clearTokens()
      if (!router.state.location.pathname.includes('/login')) {
        router.navigate({ to: '/login' })
      }
    }

    return Promise.reject(error)
  },
)
