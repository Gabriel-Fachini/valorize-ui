export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  companyId?: string
  department?: string
  role?: string
}

export interface UserInfo {
  sub: string
  email: string
  name?: string
  avatar?: string
  companyId?: string
  department?: string
  role?: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user_info: UserInfo
}

export type LoginData = LoginResponse

export interface RefreshData {
  access_token: string
  refresh_token: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message: string
  error?: string
  statusCode?: number
}

export interface VerifyMinimalData {
  isValid: boolean
}

export interface VerifyFullData extends VerifyMinimalData {
  user: UserInfo
}

export interface ProviderProps {
  children: React.ReactNode
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  checkAuth: () => Promise<boolean>
}

export interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export interface SidebarContextType {
  isCollapsed: boolean
  toggleSidebar: () => void
}
