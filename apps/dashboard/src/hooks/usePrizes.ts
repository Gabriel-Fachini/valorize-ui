import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { prizeService } from '@/services/prize.service'
import { redemptionsService } from '@/services/redemptions.service'
import { PrizeFilters } from '@/types/prize.types'

export const usePrizes = (filters?: PrizeFilters, page = 1, pageSize = 12) => {
  return useQuery({
    queryKey: ['prizes', filters, page, pageSize],
    queryFn: () => prizeService.getPrizes(filters, page, pageSize),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const usePrizeById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['prize', id],
    queryFn: () => prizeService.getPrizeById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const useRedeemPrize = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ prizeId, variantId, addressId }: { prizeId: string; variantId?: string; addressId?: string }) =>
      redemptionsService.redeemPrize({ prizeId, variantId, addressId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prizes'] })
      queryClient.invalidateQueries({ queryKey: ['redemptions'] })
      queryClient.invalidateQueries({ queryKey: ['user-balance'] })
    },
  })
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['prize-categories'],
    queryFn: () => prizeService.getCategories(),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })
}