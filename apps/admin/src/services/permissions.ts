import { api } from './api'
import type {
  PermissionsListResponse,
  PermissionCategoriesResponse,
  PermissionCategory,
  PermissionInfoByCategory,
  ApiResponse,
} from '@/types/roles'

const permissionsService = {
  /**
   * List all permissions available in the system
   *
   * Endpoint: GET /admin/roles/system/permissions/categories
   */
  listAll: async (): Promise<PermissionsListResponse> => {
    const { data } = await api.get('/admin/roles/system/permissions')
    return data
  },

  /**
   * Get permission categories
   * Retorna as permissões agrupadas por categoria
   *
   * Endpoint: GET /admin/roles/system/permissions/categories
   */
  listCategories: async (): Promise<PermissionCategoriesResponse> => {
    const { data } = await api.get('/admin/roles/system/permissions/categories')
    return data
  },

  /**
   * Get permissions info grouped by category with detailed information
   * Retorna as permissões com informações detalhadas agrupadas por categoria
   *
   * Endpoint: GET /admin/roles/system/permissions-info
   */
  listPermissionsInfo: async (): Promise<ApiResponse<PermissionInfoByCategory[]>> => {
    const { data } = await api.get('/admin/roles/system/permissions-info')
    return data
  },

  /**
   * Get permissions of a specific role, grouped by category
   *
   * Endpoint: GET /admin/roles/{roleId}/permissions
   */
  getRolePermissions: async (roleId: string): Promise<ApiResponse<PermissionCategory[]>> => {
    const { data } = await api.get(`/admin/roles/${roleId}/permissions`)
    return data
  },

  /**
   * Set (replace) all permissions of a role
   *
   * Endpoint: PUT /admin/roles/{roleId}/permissions
   */
  setRolePermissions: async (roleId: string, permissionNames: string[]): Promise<ApiResponse<string[]>> => {
    const { data } = await api.put(`/admin/roles/${roleId}/permissions`, {
      permissionNames,
    })
    return data
  },

  /**
   * Add permissions to a role (incremental)
   *
   * Endpoint: POST /admin/roles/{roleId}/permissions
   */
  addRolePermissions: async (roleId: string, permissionNames: string[]): Promise<ApiResponse<string[]>> => {
    const { data } = await api.post(`/admin/roles/${roleId}/permissions`, {
      permissionNames,
    })
    return data
  },

  /**
   * Remove permissions from a role
   *
   * Endpoint: DELETE /admin/roles/{roleId}/permissions
   */
  removeRolePermissions: async (roleId: string, permissionNames: string[]): Promise<ApiResponse<string[]>> => {
    const { data } = await api.delete(`/admin/roles/${roleId}/permissions`, {
      data: { permissionNames },
    })
    return data
  },
}

export default permissionsService
