export type PrizeType = 'voucher' | 'product'

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
  type: PrizeType
  brand: string
  coinPrice: number
  images: string[]
  stock: number
  specifications: Record<string, string>
  variants?: PrizeVariant[]
  createdAt: string
  updatedAt: string
}

export interface PrizeFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'popular' | 'most_redeemed' | 'price_asc' | 'price_desc' | 'newest'
  priceRange?: { min: number; max: number }
  search?: string
}

export interface PrizeRedemption {
  prizeId: string
  variantId?: string
  addressId: string
}