export interface UserProfile {
  id: string
  email: string
  name: string
  companyId?: string
  picture?: string
}

export interface UpdateUserProfileDto {
  name: string
  picture?: string
}
