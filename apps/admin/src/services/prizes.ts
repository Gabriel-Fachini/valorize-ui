import { api } from './api'
import type {
  PrizesListResponse,
  PrizeDetailResponse,
  PrizeCreateResponse,
  PrizeUpdateResponse,
  PrizeDeleteResponse,
  PrizeFilters,
  CreatePrizePayload,
  UpdatePrizePayload,
} from '@/types/prizes'

/**
 * Prize Service
 * Handles all API calls related to prize management
 */
export const prizesService = {
  /**
   * List prizes with optional filters
   * GET /admin/prizes
   */
  list: async (params?: PrizeFilters): Promise<PrizesListResponse> => {
    const { data } = await api.get<PrizesListResponse>('/admin/prizes', { params })
    return data
  },

  /**
   * Get a single prize by ID
   * GET /admin/prizes/:id
   */
  get: async (id: string): Promise<PrizeDetailResponse> => {
    const { data } = await api.get<PrizeDetailResponse>(`/admin/prizes/${id}`)
    return data
  },

  /**
   * Create a new prize
   * POST /prizes
   */
  create: async (payload: CreatePrizePayload): Promise<PrizeCreateResponse> => {
    const { data } = await api.post<PrizeCreateResponse>('/prizes', payload)
    return data
  },

  /**
   * Update an existing prize
   * PATCH /admin/prizes/:id
   */
  update: async (id: string, payload: UpdatePrizePayload): Promise<PrizeUpdateResponse> => {
    const { data } = await api.patch<PrizeUpdateResponse>(`/admin/prizes/${id}`, payload)
    return data
  },

  /**
   * Delete a prize
   * DELETE /admin/prizes/:id
   */
  delete: async (id: string): Promise<PrizeDeleteResponse> => {
    const { data } = await api.delete<PrizeDeleteResponse>(`/admin/prizes/${id}`)
    return data
  },

  /**
   * Toggle prize active status
   * PATCH /admin/prizes/:id
   */
  toggleActive: async (id: string, isActive: boolean): Promise<PrizeUpdateResponse> => {
    const { data } = await api.patch<PrizeUpdateResponse>(`/admin/prizes/${id}`, { isActive })
    return data
  },
}
