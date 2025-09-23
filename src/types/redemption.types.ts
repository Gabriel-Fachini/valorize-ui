export type RedemptionStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'

export interface Redemption {
  id: string
  prizeId: string
  prizeTitle: string
  prizeImage?: string | null
  category: 'eletronicos' | 'casa' | 'esporte' | 'livros' | 'vale-compras' | 'experiencias'
  amount: number // moedas debitadas (exibir como débito)
  quantity: number
  status: RedemptionStatus
  createdAt: string // ISO date
  cancellableUntil?: string // ISO date
}

export interface RedemptionsQuery {
  limit?: number
  offset?: number
  fromDate?: string
  toDate?: string
  status?: RedemptionStatus | 'ALL'
  search?: string
}

export interface RedemptionsResponse {
  redemptions: Redemption[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}
