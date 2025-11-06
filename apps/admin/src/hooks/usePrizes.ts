/**
 * Prizes List Hook
 * Hook for fetching and managing the list of prizes
 */

import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { prizesService } from '@/services/prizes'
import type { PrizeFilters } from '@/types/prizes'

export const usePrizes = (params?: PrizeFilters) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['prizes', params],
    queryFn: async () => await prizesService.list(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    // Keep previous data while fetching new page
    placeholderData: keepPreviousData,
  })

  const invalidatePrizes = () => {
    queryClient.invalidateQueries({
      queryKey: ['prizes'],
      exact: false,
    })
  }

  return {
    prizes: query.data?.prizes ?? [],
    totalCount: query.data?.total ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    invalidatePrizes,
    refetch: query.refetch,
  }
}

export type UsePrizesReturn = ReturnType<typeof usePrizes>
