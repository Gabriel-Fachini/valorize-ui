/**
 * Compliments Network Hook
 * Hook for fetching and managing compliments network graph data
 */

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { complimentsService } from '@/services/compliments'
import type { NetworkFilters } from '@/types/compliments'

export const useComplimentsNetwork = (filters?: NetworkFilters) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['compliments-network', filters],
    queryFn: async () => await complimentsService.getNetwork(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes (network data changes less frequently)
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  })

  const invalidateNetwork = () => {
    queryClient.invalidateQueries({
      queryKey: ['compliments-network'],
      exact: false,
    })
  }

  return {
    // Network data
    nodes: query.data?.nodes ?? [],
    links: query.data?.links ?? [],

    // Query states
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,

    // Actions
    invalidateNetwork,
    refetch: query.refetch,
  }
}

export type UseComplimentsNetworkReturn = ReturnType<typeof useComplimentsNetwork>
