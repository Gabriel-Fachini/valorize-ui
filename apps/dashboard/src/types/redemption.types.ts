export type RedemptionStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED'

export interface Redemption {
  id: string
  userId: string
  prizeId: string
  prizeName?: string
  variantId?: string
  variantValue?: string
  addressId: string
  coinPrice: number
  status: RedemptionStatus
  trackingInfo?: string | null
  createdAt: string
  updatedAt: string
}

export interface RedemptionDetails {
  id: string
  userId: string
  prize: {
    id: string
    name: string
    description: string
    images: string[]
  }
  variant?: {
    id: string
    name: string
    value: string
  }
  address: {
    id: string
    name: string
    street: string
    number: string
    city: string
    state: string
    zipCode: string
  }
  coinPrice: number
  status: RedemptionStatus
  trackingInfo?: string | null
  createdAt: string
  updatedAt: string
}

export interface RedemptionsQuery {
  limit?: number
  offset?: number
}

export interface RedemptionsResponse {
  redemptions: Redemption[]
  meta: {
    limit: number
    offset: number
    count: number
  }
}
