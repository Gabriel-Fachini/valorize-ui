import { api } from './api'
import type {
  User,
  UsersListResponse,
  UsersQueryParams,
  UserFormData,
  UserUpdateData,
  BulkActionsPayload,
  BulkActionsResponse,
  CSVPreviewResponse,
  CSVImportPayload,
  CSVImportResponse,
  CreateUserResponse,
  PasswordResetResponse,
  AllowedDomain,
} from '@/types/users'

const usersService = {
  /**
   * List users with pagination, search, and filters
   *
   * Endpoint: GET /admin/users
   */
  list: async (params?: UsersQueryParams): Promise<UsersListResponse> => {
    const { data } = await api.get('/admin/users', { params })
    return data
  },

  /**
   * Get detailed information about a specific user
   *
   * Endpoint: GET /admin/users/{userId}
   */
  get: async (userId: string): Promise<User> => {
    const { data } = await api.get(`/admin/users/${userId}`)
    return data
  },

  /**
   * Create a new user
   *
   * Endpoint: POST /admin/users
   */
  create: async (user: UserFormData) => {
    const { data } = await api.post('/admin/users', user)
    return data as CreateUserResponse
  },

  /**
   * Update an existing user
   *
   * Endpoint: PATCH /admin/users/{userId}
   */
  update: async (userId: string, user: UserUpdateData): Promise<User> => {
    const { data } = await api.patch(`/admin/users/${userId}`, user)
    return data
  },

  /**
   * Delete a user (soft delete - marks as inactive)
   *
   * Endpoint: DELETE /admin/users/{userId}
   */
  delete: async (userId: string): Promise<void> => {
    await api.delete(`/admin/users/${userId}`)
  },

  /**
   * Perform bulk actions on multiple users
   *
   * Endpoint: POST /admin/users/bulk/actions
   *
   * Actions: 'activate', 'deactivate', 'export'
   */
  bulkActions: async (payload: BulkActionsPayload): Promise<BulkActionsResponse | Blob> => {
    const { data } = await api.post('/admin/users/bulk/actions', payload, {
      // If action is 'export', expect a CSV file response
      responseType: payload.action === 'export' ? 'blob' : 'json',
    })
    return data
  },

  /**
   * Download CSV template for bulk user import
   *
   * Endpoint: GET /admin/users/csv/template
   */
  downloadCSVTemplate: async (): Promise<Blob> => {
    const { data } = await api.get('/admin/users/csv/template', {
      responseType: 'blob',
    })
    return data
  },

  /**
   * Preview and validate CSV file before importing
   *
   * Endpoint: POST /admin/users/csv/preview
   */
  previewCSV: async (fileContent: string): Promise<CSVPreviewResponse> => {
    const { data } = await api.post('/admin/users/csv/preview', {
      fileContent,
    })
    return data
  },

  /**
   * Confirm and process CSV import
   *
   * Endpoint: POST /admin/users/csv/import
   */
  importCSV: async (payload: CSVImportPayload): Promise<CSVImportResponse> => {
    const { data } = await api.post('/admin/users/csv/import', payload)
    return data
  },

  /**
   * Reset password for a user
   *
   * Endpoint: PUT /admin/users/{userId}/reset-password
   */
  resetPassword: async (userId: string) => {
    const { data } = await api.put(`/admin/users/${userId}/reset-password`)
    return data as PasswordResetResponse
  },

  /**
   * Get allowed domains for the company
   *
   * Endpoint: GET /admin/company/domains
   */
  getAllowedDomains: async () => {
    const { data } = await api.get('/admin/company/domains')
    return data as AllowedDomain[]
  },
}

export { usersService }
