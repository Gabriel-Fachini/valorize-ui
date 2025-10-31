import { api } from './api'
import type { CompanyValue } from '@/types/companyValues'

const companyValuesService = {
  /**
   * Get all company values
   *
   * Endpoint: GET /admin/company/values
   */
  list: async (): Promise<CompanyValue[]> => {
    const { data } = await api.get('/admin/company/values')
    return data
  },

  /**
   * Get a specific company value
   *
   * Endpoint: GET /admin/company/values/{id}
   */
  get: async (id: number): Promise<CompanyValue> => {
    const { data } = await api.get(`/admin/company/values/${id}`)
    return data
  },

  /**
   * Create a new company value
   *
   * Endpoint: POST /admin/company/values
   *
   * Max 8 active values per company
   */
  create: async (value: Partial<CompanyValue>): Promise<CompanyValue> => {
    const { data } = await api.post('/admin/company/values', value)
    return data
  },

  /**
   * Update an existing company value
   *
   * Endpoint: PATCH /admin/company/values/{id}
   */
  update: async (id: number, value: Partial<CompanyValue>): Promise<CompanyValue> => {
    const { data } = await api.patch(`/admin/company/values/${id}`, value)
    return data
  },

  /**
   * Delete a company value (soft delete)
   *
   * Endpoint: DELETE /admin/company/values/{id}
   *
   * Marks is_active = false instead of permanent deletion
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/company/values/${id}`)
  },

  /**
   * Reorder company values
   *
   * Endpoint: PATCH /admin/company/values/reorder
   */
  reorder: async (ids: number[]): Promise<{ message: string; values: CompanyValue[] }> => {
    const { data } = await api.patch('/admin/company/values/reorder', { ordered_ids: ids })
    return data
  },

  // ==================== Legacy Methods (Deprecated) ====================

  /**
   * @deprecated Use delete() instead - real soft delete implementation
   */
  deactivate: async (id: number): Promise<void> => {
    console.warn('[DEPRECATED] Use companyValuesService.delete() instead')
    await api.delete(`/admin/company/values/${id}`)
  },
}

export { companyValuesService }