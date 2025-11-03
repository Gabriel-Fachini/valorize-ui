import { api } from './api'
import type { UserRolesResponse, RoleUsersResponse, ApiResponse } from '@/types/roles'

const userRolesService = {
  /**
   * Get all roles assigned to a user
   *
   * Endpoint: GET /admin/roles/users/{userId}/roles
   */
  getUserRoles: async (userId: string): Promise<UserRolesResponse> => {
    const { data } = await api.get(`/admin/roles/users/${userId}/roles`)
    return data
  },

  /**
   * Assign a role to a user
   *
   * Endpoint: POST /admin/roles/users/{userId}/roles
   */
  assignRoleToUser: async (userId: string, roleId: string): Promise<ApiResponse<string>> => {
    const { data } = await api.post(`/admin/roles/users/${userId}/roles`, {
      roleId,
    })
    return data
  },

  /**
   * Remove a role from a user
   *
   * Endpoint: DELETE /admin/roles/users/{userId}/roles/{roleId}
   */
  removeRoleFromUser: async (userId: string, roleId: string): Promise<void> => {
    await api.delete(`/admin/roles/users/${userId}/roles/${roleId}`)
  },

  /**
   * Get users with a specific role
   *
   * Endpoint: GET /admin/roles/{roleId}/users
   */
  getRoleUsers: async (roleId: string, page = 1, limit = 20): Promise<RoleUsersResponse> => {
    const { data } = await api.get(`/admin/roles/${roleId}/users`, {
      params: { page, limit },
    })
    return data
  },
}

export default userRolesService
