import type { Redemption, RedemptionsQuery, RedemptionsResponse, RedemptionDetails } from '@/types/redemption.types'
import { api } from './api'

interface RedeemPrizeRequest {
  prizeId: string
  variantId?: string
  addressId: string
}

interface RedeemPrizeResponse {
  message: string
  redemption: Redemption
}

interface CancelRedemptionRequest {
  reason: string
}

interface CancelRedemptionResponse {
  message: string
  coinsRefunded: number
  newBalance: number
}

interface GetRedemptionDetailsResponse {
  redemption: RedemptionDetails
}

export const redemptionsService = {
  async redeemPrize(data: RedeemPrizeRequest): Promise<Redemption> {
    const response = await api.post<RedeemPrizeResponse>('/redemptions/redeem', data)
    return response.data.redemption
  },

  async getRedemptions(params: RedemptionsQuery = {}): Promise<RedemptionsResponse> {
    const { limit = 20, offset = 0, status, fromDate, toDate, search } = params
    
    const queryParams: Record<string, string | number> = { limit, offset }
    
    if (status && status !== 'ALL') {
      queryParams.status = status
    }
    if (fromDate) {
      queryParams.fromDate = fromDate
    }
    if (toDate) {
      queryParams.toDate = toDate
    }
    if (search) {
      queryParams.search = search
    }
    
    const response = await api.get<RedemptionsResponse>('/redemptions/my-redemptions', {
      params: queryParams,
    })
    
    return response.data
  },

  async getRedemptionById(id: string): Promise<RedemptionDetails | null> {
    try {
      const response = await api.get<GetRedemptionDetailsResponse>(`/redemptions/my-redemptions/${id}`)
      return response.data.redemption
    } catch {
      return null
    }
  },

  async cancelRedemption(id: string, reason: string): Promise<CancelRedemptionResponse> {
    const response = await api.post<CancelRedemptionResponse>(
      `/redemptions/my-redemptions/${id}/cancel`,
      { reason } as CancelRedemptionRequest,
    )
    return response.data
  },
}
