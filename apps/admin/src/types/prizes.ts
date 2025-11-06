/**
 * Prize Types
 * Tipos para gerenciamento de prêmios no admin
 */

export interface PrizeVariant {
  id: string
  prizeId: string
  name: string
  value: string
  stock: number
  createdAt: string
  updatedAt: string
}

export interface Prize {
  id: string
  companyId: string
  name: string
  description: string
  category: string
  brand: string
  coinPrice: number
  images: string[]
  stock: number
  isActive: boolean
  specifications: Record<string, string>
  variants?: PrizeVariant[]
  voucherProductId?: string | null // ID do VoucherProduct vinculado (se for voucher)
  createdAt: string
  updatedAt: string
}

export interface PrizeFilters {
  category?: string
  isActive?: boolean
  search?: string
  limit?: number
  offset?: number
}

export interface CreatePrizePayload {
  name: string
  description: string
  category: string
  brand?: string
  coinPrice: number
  images?: string[]
  stock?: number
  isActive?: boolean
  isGlobal?: boolean
  specifications?: Record<string, string>
  voucherProductId?: string // Para vincular com VoucherProduct
}

export interface UpdatePrizePayload {
  name?: string
  description?: string
  category?: string
  brand?: string
  coinPrice?: number
  images?: string[]
  stock?: number
  isActive?: boolean
  specifications?: Record<string, string>
}

export interface PrizesListResponse {
  success: boolean
  prizes: Prize[]
  total: number
}

export interface PrizeDetailResponse {
  success: boolean
  prize: Prize
}

export interface PrizeCreateResponse {
  success: boolean
  message: string
  prize: Prize
}

export interface PrizeUpdateResponse {
  success: boolean
  message: string
  prize: Prize
}

export interface PrizeDeleteResponse {
  success: boolean
  message: string
}
