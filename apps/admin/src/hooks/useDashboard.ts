import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboard'
import type { DashboardFilters } from '@/types/dashboard'

/**
 * React Query hook for fetching all dashboard data
 * Recommended: Use this single hook for better performance
 *
 * TODO: Uncomment API call when backend is ready
 */
export const useDashboardData = (filters?: DashboardFilters) => {
  // Use individual filter fields in the key to keep it stable and serializable
  const queryKey = [
    'dashboard',
    filters?.startDate ?? null,
    filters?.endDate ?? null,
    filters?.departmentId ?? null,
    filters?.jobTitleId ?? null,
  ]

  return useQuery({
    queryKey,
    queryFn: async () => await dashboardService.getDashboardData(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes - data refreshes frequently for executive view
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}