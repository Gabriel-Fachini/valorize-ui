import { api } from './api'
import type { ApiResponse, UserRolesAndPermissionsResponse, Role } from '@/types/roles'

interface UserPermissionsResponse extends ApiResponse<string[]> {
  data: string[]
}

const userPermissionsService = {
  async getUserPermissions(): Promise<UserPermissionsResponse> {
    const response = await api.get<UserPermissionsResponse>('/admin/roles/me')
    return response.data
  },

  async getUserRoles(): Promise<Role[]> {
    const response = await api.get<UserRolesAndPermissionsResponse>('/admin/roles/me')
    return response.data.data.roles
  },

  async getUserRolesAndPermissions(): Promise<UserRolesAndPermissionsResponse> {
    const response = await api.get<UserRolesAndPermissionsResponse>('/admin/roles/me')
    return response.data
  },
}

export default userPermissionsService
