import { api } from './api'
import type {
  RedemptionFilters,
  RedemptionsListResponse,
  RedemptionDetailResponse,
  UpdateStatusPayload,
  StatusUpdateResponse,
  AddTrackingPayload,
  TrackingUpdateResponse,
  AddNotePayload,
  AddNoteResponse,
  CancelRedemptionPayload,
  CancelRedemptionResponse,
  RedemptionMetrics,
} from '@/types/redemptions'

/**
 * Redemption Service
 * Handles all API calls related to redemption management
 */
export const redemptionsService = {
  /**
   * List redemptions with optional filters
   * GET /admin/redemptions
   */
  list: async (params?: RedemptionFilters): Promise<RedemptionsListResponse> => {
    const { data } = await api.get<RedemptionsListResponse>('/admin/redemptions', { params })
    return data
  },

  /**
   * Get a single redemption by ID
   * GET /admin/redemptions/:id
   */
  get: async (id: string): Promise<RedemptionDetailResponse> => {
    const { data } = await api.get<RedemptionDetailResponse>(`/admin/redemptions/${id}`)
    return data
  },

  /**
   * Update redemption status
   * PATCH /admin/redemptions/:id/status
   */
  updateStatus: async (id: string, payload: UpdateStatusPayload): Promise<StatusUpdateResponse> => {
    const { data } = await api.patch<StatusUpdateResponse>(`/admin/redemptions/${id}/status`, payload)
    return data
  },

  /**
   * Add tracking information to a redemption
   * PATCH /admin/redemptions/:id/tracking
   */
  addTracking: async (id: string, payload: AddTrackingPayload): Promise<TrackingUpdateResponse> => {
    const { data } = await api.patch<TrackingUpdateResponse>(`/admin/redemptions/${id}/tracking`, payload)
    return data
  },

  /**
   * Add admin note to redemption
   * POST /admin/redemptions/:id/notes
   */
  addNote: async (id: string, payload: AddNotePayload): Promise<AddNoteResponse> => {
    const { data } = await api.post<AddNoteResponse>(`/admin/redemptions/${id}/notes`, payload)
    return data
  },

  /**
   * Cancel a redemption and automatically refund coins and budget
   * DELETE /admin/redemptions/:id/cancel
   */
  cancel: async (id: string, payload?: CancelRedemptionPayload): Promise<CancelRedemptionResponse> => {
    const { data } = await api.delete<CancelRedemptionResponse>(`/admin/redemptions/${id}/cancel`, {
      data: payload,
    })
    return data
  },

  /**
   * Get redemption metrics and analytics
   * GET /admin/redemptions/metrics
   */
  getMetrics: async (): Promise<RedemptionMetrics> => {
    const { data } = await api.get<RedemptionMetrics>('/admin/redemptions/metrics')
    return data
  },
}
