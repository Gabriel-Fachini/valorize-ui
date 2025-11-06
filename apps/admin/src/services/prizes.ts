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
   * POST /admin/prizes
   */
  create: async (payload: CreatePrizePayload): Promise<PrizeCreateResponse> => {
    const { data } = await api.post<PrizeCreateResponse>('/admin/prizes', payload)
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

  /**
   * Upload images for a prize
   * POST /admin/prizes/:id/images
   */
  uploadImages: async (id: string, images: File[]): Promise<{ success: boolean; images: string[] }> => {
    const formData = new FormData()
    images.forEach((image) => {
      formData.append('images', image)
    })
    const { data } = await api.post<{ success: boolean; images: string[] }>(`/admin/prizes/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  },

  /**
   * Delete a specific image from a prize
   * DELETE /admin/prizes/:id/images/:imageIndex
   */
  deleteImage: async (id: string, imageIndex: number): Promise<{ success: boolean; message: string }> => {
    const { data } = await api.delete<{ success: boolean; message: string }>(`/admin/prizes/${id}/images/${imageIndex}`)
    return data
  },
}
