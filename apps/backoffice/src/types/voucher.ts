/**
 * Voucher Types
 * Types for voucher products catalog management
 */

/**
 * Voucher Product entity
 * Represents a digital voucher product in the catalog
 */
export interface VoucherProduct {
  id: string
  provider: string // Ex: "tremendous"
  externalId: string // ID from the provider
  name: string
  description?: string | null
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
  prizeId?: string | null // Associated prize ID
}

/**
 * Response for listing voucher products
 */
export interface VouchersListResponse {
  success: boolean
  items: VoucherProduct[]
  total: number
  limit?: number
  offset?: number
}

/**
 * Response for getting a single voucher product
 */
export interface VoucherDetailResponse {
  success: boolean
  product: VoucherProduct
}

/**
 * Response for catalog sync operation
 */
export interface SyncCatalogResponse {
  success: boolean
  message: string
  syncedProducts: number
  createdPrizes: number
  reactivatedPrizes: number
  deactivatedProducts: number
  deactivatedPrizes: number
}

/**
 * Query parameters for listing vouchers
 */
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

/**
 * Filters for client-side filtering
 */
export interface VoucherFilters extends Record<string, unknown> {
  search: string
  status?: 'all' | 'active' | 'inactive'
  category?: string
  currency?: string
}

/**
 * Aggregated statistics for vouchers
 */
export interface VoucherStats {
  total: number
  active: number
  inactive: number
  lastSyncAt: string | null
}

/**
 * Input for updating a voucher product
 */
export interface UpdateVoucherInput {
  name?: string
  description?: string | null
  category?: string
  brand?: string | null
  minValue?: number
  maxValue?: number
  isActive?: boolean
  images?: string[]
}

/**
 * Response for voucher update/toggle operations
 */
export interface VoucherActionResponse {
  success: boolean
  message: string
  product?: VoucherProduct
}

/**
 * Response for voucher image upload
 */
export interface ImageUploadResponse {
  success: boolean
  message: string
  images: string[]
}
