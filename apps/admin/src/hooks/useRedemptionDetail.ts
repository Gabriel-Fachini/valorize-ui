/**
 * Redemption Detail Hook
 * Hook for fetching a single redemption details
 */

import { useQuery } from '@tanstack/react-query'
import { redemptionsService } from '@/services/redemptions'

export const useRedemptionDetail = (id: string | undefined) => {
  const query = useQuery({
    queryKey: ['redemption', id],
    queryFn: async () => {
      if (!id) throw new Error('Redemption ID is required')
      return await redemptionsService.get(id)
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  })

  return {
    redemption: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
  }
}

export type UseRedemptionDetailReturn = ReturnType<typeof useRedemptionDetail>
