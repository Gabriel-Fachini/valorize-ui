import type { UserInfo } from '@/types'

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
      console.warn('Failed to parse user_info from localStorage:', error)
      return null
    }
  },
  clearUserInfo() {
    localStorage.removeItem('user_info')
  },
}
