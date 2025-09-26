import { TokenManager } from '@/lib'
import type { UserProfile, UpdateUserProfileDto } from '@/types/user.types'

const STORAGE_KEY = 'valorize_user_profile_mock'

function getDefaultProfile(): UserProfile | null {
  const userInfo = TokenManager.getUserInfo()
  if (!userInfo) return null
  return {
    id: userInfo.sub,
    email: userInfo.email,
    name: userInfo.name ?? 'Usuário',
    companyId: userInfo.companyId,
    picture: userInfo.picture,
  }
}

export const userService = {
  async getProfile(): Promise<UserProfile> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw) as UserProfile
    } catch {
      // ignore parse errors
    }
    const fallback = getDefaultProfile() ?? {
      id: 'mock-user-1',
      email: 'user@example.com',
      name: 'Usuário',
      companyId: 'company-1',
      picture: undefined,
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback))
    } catch {
      // ignore storage errors
    }
    return fallback
  },

  async updateProfile(dto: UpdateUserProfileDto): Promise<UserProfile> {
    const current = await this.getProfile()
    const updated: UserProfile = { 
      ...current, 
      name: dto.name.trim(), 
      picture: (dto.picture?.trim() ?? undefined),
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // ignore storage errors
    }
    // sync TokenManager user_info
    const userInfo = TokenManager.getUserInfo()
    if (userInfo) {
      TokenManager.setUserInfo({ ...userInfo, name: updated.name, picture: updated.picture })
    }
    return updated
  },
}
