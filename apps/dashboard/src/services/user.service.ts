import { api } from './api'
import type { UserProfile, UpdateUserProfileDto } from '@/types/user.types'

interface GetProfileResponse {
  success: boolean
  data: {
    id: string
    auth0Id: string
    email: string
    name: string
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
}

interface UpdateProfileResponse {
  success: boolean
  data: {
    id: string
    auth0Id: string
    email: string
    name: string
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
}

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<GetProfileResponse>('/users/profile')
    const userData = response.data.data
    
    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      companyId: userData.id, // Use user id as company id for now
      picture: undefined, // API doesn't return picture yet
    }
  },

  async updateProfile(dto: UpdateUserProfileDto): Promise<UserProfile> {
    const response = await api.put<UpdateProfileResponse>('/users/profile', {
      name: dto.name,
      // See docs/API_ROUTES_DOCUMENTATION.md for field mapping
      // The API expects 'avatar' for profile picture (confirmed)
      avatar: dto.picture,
    })
    const userData = response.data.data
    
    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      companyId: userData.id,
      picture: dto.picture, // Keep picture from input since API doesn't handle it yet
    }
  },
}
