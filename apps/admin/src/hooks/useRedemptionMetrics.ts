/**
 * Redemption Metrics Hook
 * Hook for fetching redemption metrics and analytics
 */

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { redemptionsService } from '@/services/redemptions'

export const useRedemptionMetrics = () => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['redemption-metrics'],
    queryFn: async () => await redemptionsService.getMetrics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  })

  const invalidateMetrics = () => {
    queryClient.invalidateQueries({
      queryKey: ['redemption-metrics'],
    })
  }

  return {
    metrics: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    invalidateMetrics,
    refetch: query.refetch,
  }
}

export type UseRedemptionMetricsReturn = ReturnType<typeof useRedemptionMetrics>
