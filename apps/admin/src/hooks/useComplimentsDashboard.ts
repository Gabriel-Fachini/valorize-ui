/**
 * Compliments Dashboard Hook
 * Hook for fetching and managing compliments dashboard analytics
 */

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { complimentsService } from '@/services/compliments'
import type { ComplimentsDashboardFilters } from '@/types/compliments'

export const useComplimentsDashboard = (filters?: ComplimentsDashboardFilters) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['compliments-dashboard', filters],
    queryFn: async () => await complimentsService.getDashboard(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  })

  const invalidateDashboard = () => {
    queryClient.invalidateQueries({
      queryKey: ['compliments-dashboard'],
      exact: false,
    })
  }

  return {
    // Dashboard data sections
    overview: query.data?.overview,
    valuesDistribution: query.data?.valuesDistribution ?? [],
    topUsers: query.data?.topUsers,
    departmentAnalytics: query.data?.departmentAnalytics,
    temporalPatterns: query.data?.temporalPatterns,
    recentActivity: query.data?.recentActivity ?? [],
    insights: query.data?.insights ?? [],
    engagementMetrics: query.data?.engagementMetrics,
    period: query.data?.period,

    // Query states
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,

    // Actions
    invalidateDashboard,
    refetch: query.refetch,
  }
}

export type UseComplimentsDashboardReturn = ReturnType<typeof useComplimentsDashboard>
