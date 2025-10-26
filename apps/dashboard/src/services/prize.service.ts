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
    const params: Record<string, string | number> = {
      page,
      pageSize,
    }
    
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
    
    // Se a API não retornar dados paginados, implementar paginação no frontend
    const apiData = response.data
    const allPrizes = apiData.prizes || []
    
    // Verificar se a API suporta paginação real
    const hasRealPagination = apiData.total !== undefined && apiData.page !== undefined && apiData.pageSize !== undefined
    
    if (hasRealPagination) {
      // API suporta paginação real
      return {
        prizes: allPrizes,
        total: apiData.total,
        page: apiData.page,
        pageSize: apiData.pageSize,
      }
    } else {
      // API não suporta paginação, implementar no frontend
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedPrizes = allPrizes.slice(startIndex, endIndex)
      
      return {
        prizes: paginatedPrizes,
        total: allPrizes.length,
        page,
        pageSize,
      }
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