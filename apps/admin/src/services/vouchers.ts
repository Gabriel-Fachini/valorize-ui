import { api } from './api'
import type {
  VouchersListResponse,
  VoucherDetailResponse,
  VoucherSyncResponse,
  VouchersQueryParams,
  BulkAssignPayload,
  BulkAssignResponse,
  SendToUserPayload,
  SendToUserResponse,
} from '@/types/vouchers'

/**
 * Voucher Service
 * Handles all API calls related to voucher products and redemptions
 */
export const vouchersService = {
  /**
   * List voucher products with optional filters
   * GET /admin/voucher-products
   */
  list: async (params?: VouchersQueryParams): Promise<VouchersListResponse> => {
    const { data } = await api.get<VouchersListResponse>('/admin/voucher-products', { params })
    return data
  },

  /**
   * Get a single voucher product by ID
   * GET /admin/voucher-products/:id
   */
  get: async (id: string): Promise<VoucherDetailResponse> => {
    const { data } = await api.get<VoucherDetailResponse>(`/admin/voucher-products/${id}`)
    return data
  },

  /**
   * Sync voucher products catalog with Tremendous API
   * POST /admin/voucher-products/sync
   */
  sync: async (): Promise<VoucherSyncResponse> => {
    const { data } = await api.post<VoucherSyncResponse>('/admin/voucher-products/sync')
    return data
  },

  /**
   * Bulk assign vouchers to multiple users (ADMIN ONLY)
   * POST /api/redemptions/bulk-redeem
   */
  bulkAssign: async (payload: BulkAssignPayload): Promise<BulkAssignResponse> => {
    const { data} = await api.post<BulkAssignResponse>('/api/redemptions/bulk-redeem', payload)
    return data
  },

  /**
   * Send voucher to a single user (ADMIN ONLY)
   * POST /redemptions/send-to-user
   */
  sendToUser: async (payload: SendToUserPayload): Promise<SendToUserResponse> => {
    const { data } = await api.post<SendToUserResponse>('/redemptions/send-to-user', payload)
    return data
  },
}
