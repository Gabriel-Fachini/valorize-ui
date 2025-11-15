export type RedemptionStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'SENT'
  | 'FAILED'

export const VOUCHER_STATUS = {
  SENT: 'SENT',
  FAILED: 'FAILED',
} as const

export const PRODUCT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const

export interface Redemption {
  id: string
  userId: string
  prizeId: string
  variantId?: string
  companyId: string
  addressId?: string
  coinsSpent: number
  status: string // API returns lowercase: "pending", "processing", etc.
  trackingCode?: string | null
  redeemedAt: string
  prize: {
    id: string
    name: string
    images: string[]
    category: string
    type: 'voucher' | 'product'
    description?: string
  }
  variant?: {
    id: string
    name: string
    value: string
  }
  tracking?: Array<{
    id: string
    status: string
    notes: string
    createdAt: string
  }>
}

export interface RedemptionDetails {
  id: string
  userId: string
  prizeId: string
  variantId?: string
  companyId: string
  addressId?: string
  coinsSpent: number
  status: string
  trackingCode?: string | null
  redeemedAt: string
  prize: {
    id: string
    name: string
    images: string[]
    category: string
    type: 'voucher' | 'product'
    description?: string
  }
  variant?: {
    id: string
    name: string
    value: string
  }
  tracking?: Array<{
    id: string
    status: string
    notes: string
    createdAt: string
  }>
}

export interface RedemptionsQuery {
  limit?: number
  offset?: number
  status?: string | 'ALL'
  fromDate?: string
  toDate?: string
  search?: string
}

export interface RedemptionsResponse {
  redemptions: Redemption[]
  meta: {
    limit: number
    offset: number
    count: number
  }
}
