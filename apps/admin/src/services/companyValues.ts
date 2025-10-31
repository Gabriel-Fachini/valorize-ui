import { api } from './api'
import type { CompanyValue } from '@/types/companyValues'

const companyValuesService = {
  list: async (): Promise<CompanyValue[]> => {
    const { data } = await api.get('/admin/company/values')
    return data
  },

  get: async (id: string): Promise<CompanyValue> => {
    const { data } = await api.get(`/admin/company/values/${id}`)
    return data
  },

  create: async (value: Partial<CompanyValue>): Promise<CompanyValue> => {
    const { data } = await api.post('/admin/company/values', value)
    return data
  },

  update: async (id: string, value: Partial<CompanyValue>): Promise<CompanyValue> => {
    const { data } = await api.patch(`/admin/company/values/${id}`, value)
    return data
  },

  reorder: async (ids: string[]): Promise<void> => {
    await api.patch('/admin/company/values/reorder', { ordered_ids: ids })
  },

  deactivate: async (id: string): Promise<void> => {
    // Mock implementation - API was implemented incorrectly
    console.log('[MOCK] Deactivating value:', id)
    // In real implementation, this should be:
    // await api.patch(`/admin/company/values/${id}/deactivate`)
    await new Promise(resolve => setTimeout(resolve, 300))
  },
}

export { companyValuesService }