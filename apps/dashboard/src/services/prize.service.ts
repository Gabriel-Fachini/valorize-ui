import { Prize, PrizeFilters } from '@/types/prize.types'
import { api } from './api'

interface GetPrizesResponse {
  prizes: Prize[]
  total: number
  page: number
  pageSize: number
}

interface GetPrizeResponse {
  prize: Prize
}

interface GetCategoriesResponse {
  categories: string[]
}

export const prizeService = {
  async getPrizes(filters?: PrizeFilters, page = 1, pageSize = 12): Promise<GetPrizesResponse> {
    const params: Record<string, string | number> = {}
    
    if (filters?.category) {
      params.category = filters.category
    }
    if (filters?.minPrice !== undefined) {
      params.minPrice = filters.minPrice
    }
    if (filters?.maxPrice !== undefined) {
      params.maxPrice = filters.maxPrice
    }

    const response = await api.get<GetPrizesResponse>('/prizes/catalog', { params })
    
    return {
      prizes: response.data.prizes || [],
      total: response.data.prizes?.length || 0,
      page,
      pageSize,
    }
  },

  async getPrizeById(id: string): Promise<Prize | null> {
    try {
      const response = await api.get<GetPrizeResponse>(`/prizes/catalog/${id}`)
      return response.data.prize
    } catch {
      return null
    }
  },

  async getCategories(): Promise<string[]> {
    const response = await api.get<GetCategoriesResponse>('/prizes/categories')
    return response.data.categories
  },
}