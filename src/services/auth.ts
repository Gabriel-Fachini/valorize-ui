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

const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? ''

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
    } catch {
      return null
    }
  },
  clearUserInfo() {
    localStorage.removeItem('user_info')
  },
}

export async function loginWithEmailPassword(email: string, password: string): Promise<ApiResponse<LoginData>> {
  const response = await fetch(`${baseUrl}/session/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const json = (await response.json()) as ApiResponse<LoginData>
  return json
}

export async function refreshToken(refreshToken: string): Promise<ApiResponse<RefreshData>> {
  const response = await fetch(`${baseUrl}/session/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
  const json = (await response.json()) as ApiResponse<RefreshData>
  return json
}

export async function verifyToken(minimal = true, accessToken?: string): Promise<ApiResponse<VerifyMinimalData | VerifyFullData>> {
  const token = accessToken ?? TokenManager.getAccessToken()
  const response = await fetch(`${baseUrl}/session/verify${minimal ? '?minimal=true' : ''}`, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  const json = (await response.json()) as ApiResponse<VerifyMinimalData | VerifyFullData>
  return json
}

export async function checkAndRefreshToken(): Promise<boolean> {
  const access = TokenManager.getAccessToken()
  if (!access) return false
  try {
    const verifyRes = await fetch(`${baseUrl}/session/verify?minimal=true`, {
      headers: { Authorization: `Bearer ${access}` },
    })
    if (verifyRes.status !== 401) {
      return verifyRes.ok
    }

    const rt = TokenManager.getRefreshToken()
    if (!rt) return false

    const refreshRes = await refreshToken(rt)
    if (refreshRes.success) {
      TokenManager.setTokens(refreshRes.data.access_token, refreshRes.data.refresh_token)
      return true
    }
    return false
  } catch {
    return false
  }
}


