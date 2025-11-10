/**
 * Voucher Types
 * Based on API documentation: VOUCHER_ENDPOINTS.md
 */

import type { Prize } from './prizes'

export interface VoucherProduct {
  id: string
  provider: string // Ex: "tremendous"
  externalId: string // ID no provider
  name: string
  description?: string
  category: string // Ex: "merchant_card", "gift-cards"
  brand?: string | null
  images: string[]
  minValue: number
  maxValue: number
  currency: string // Ex: "BRL", "USD"
  countries: string[] // Ex: ["BR"]
  isActive: boolean
  lastSyncAt: string
  createdAt: string
  updatedAt: string
  prize?: Prize | null
}

export interface VouchersListResponse {
  success: boolean
  items: VoucherProduct[]
  total: number
}

export interface VoucherDetailResponse {
  success: boolean
  product: VoucherProduct
}

export interface VoucherSyncResponse {
  success: boolean
  message: string
  result: {
    synced: number
    deactivated: number
    total: number
  }
}

export interface VouchersQueryParams {
  provider?: string
  category?: string
  currency?: string
  country?: string
  isActive?: boolean
  search?: string
  limit?: number
  offset?: number
}

export interface BulkAssignUser {
  userId: string
  email: string
}

export interface BulkAssignItem {
  userId: string
  prizeId: string
  customAmount: number
}

export interface BulkAssignPayload {
  prizeId: string
  customAmount: number
  campaignId?: string
  users: BulkAssignUser[]
  allUsersSelected?: boolean
}

export interface BulkAssignResultItem {
  userId: string
  email: string
  prizeId: string
  customAmount: number
  success: boolean
  redemptionId: string | null
  voucherLink: string | null
  voucherCode: string | null
  error: string | null
}

export interface BulkAssignResponse {
  message: string
  summary: {
    total: number
    successful: number
    failed: number
  }
  results: BulkAssignResultItem[]
}

export interface VoucherFilters extends Record<string, unknown> {
  search: string
}

export interface SendToUserPayload {
  userId: string
  email: string
  prizeId: string
  customAmount: number
  campaignId?: string
}

export interface SendToUserResponse {
  message: string
  redemptionId: string
  userId: string
  email: string
  prizeId: string
  status: string
  notes: string
}
