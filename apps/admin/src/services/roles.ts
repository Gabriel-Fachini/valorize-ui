import { api } from './api'
import type {
  RolesListResponse,
  RoleDetailResponse,
  RoleFormData,
  RoleUpdateData,
  RolesQueryParams,
} from '@/types/roles'

const rolesService = {
  /**
   * List roles with pagination, search, and filters
   *
   * Endpoint: GET /admin/roles
   */
  list: async (params?: RolesQueryParams): Promise<RolesListResponse> => {
    const { data } = await api.get('/admin/roles', { params })
    return data
  },

  /**
   * Get detailed information about a specific role
   *
   * Endpoint: GET /admin/roles/{roleId}
   */
  get: async (roleId: string): Promise<RoleDetailResponse> => {
    const { data } = await api.get(`/admin/roles/${roleId}`)
    return data
  },

  /**
   * Create a new role
   *
   * Endpoint: POST /admin/roles
   */
  create: async (roleData: RoleFormData) => {
    const { data } = await api.post('/admin/roles', roleData)
    return data as RoleDetailResponse
  },

  /**
   * Update an existing role
   *
   * Endpoint: PATCH /admin/roles/{roleId}
   */
  update: async (roleId: string, roleData: RoleUpdateData): Promise<RoleDetailResponse> => {
    const { data } = await api.patch(`/admin/roles/${roleId}`, roleData)
    return data
  },

  /**
   * Delete a role
   *
   * Endpoint: DELETE /admin/roles/{roleId}
   */
  delete: async (roleId: string): Promise<void> => {
    await api.delete(`/admin/roles/${roleId}`)
  },
}

export default rolesService
