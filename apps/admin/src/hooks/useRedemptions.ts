/**
 * Redemptions List Hook
 * Hook for fetching and managing the list of redemptions
 */

import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { redemptionsService } from '@/services/redemptions'
import type { RedemptionFilters } from '@/types/redemptions'

export const useRedemptions = (params?: RedemptionFilters) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['redemptions', params],
    queryFn: async () => await redemptionsService.list(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    // Keep previous data while fetching new page
    placeholderData: keepPreviousData,
  })


  const invalidateRedemptions = () => {
    queryClient.invalidateQueries({
      queryKey: ['redemptions'],
      exact: false,
    })
  }

  return {
    // Extract from the API response structure: { data: [...], pagination: {...} }
    redemptions: query.data?.data ?? [],
    totalCount: query.data?.pagination?.total ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    invalidateRedemptions,
    refetch: query.refetch,
  }
}

export type UseRedemptionsReturn = ReturnType<typeof useRedemptions>
