import { api } from './api'
import type { UserRolesResponse, RoleUsersResponse, BulkAssignRoleResponse } from '@/types/roles'

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
   * Assign a role to one or multiple users
   *
   * Endpoint: POST /admin/roles/assign-role
   * Unified endpoint that accepts array of user IDs
   */
  assignRoleToUsers: async (roleId: string, userIds: string[]): Promise<BulkAssignRoleResponse> => {
    const { data } = await api.post(`/admin/roles/assign-role`, {
      roleId,
      userIds,
    })
    return data
  },

  /**
   * Assign a role to a single user (backwards compatibility)
   * Uses the unified endpoint with a single user ID
   *
   * Endpoint: POST /admin/roles/assign-role
   */
  assignRoleToUser: async (userId: string, roleId: string): Promise<BulkAssignRoleResponse> => {
    return userRolesService.assignRoleToUsers(roleId, [userId])
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

  /**
   * List available users to assign to a role
   *
   * Endpoint: GET /admin/roles/users/list
   */
  listAvailableUsers: async () => {
    const { data } = await api.get('/admin/roles/users/list')
    return data
  },
}

export default userRolesService
