/**
 * Economy Hooks
 * React Query hooks for economy dashboard data
 */

import { useQuery } from '@tanstack/react-query'
import { economyService } from '@/services/economy'

/**
 * Hook to fetch economy dashboard data
 *
 * Features:
 * - Automatic refetch every 60 seconds
 * - Refetch on window focus
 * - 60 second stale time
 * - 5 minute garbage collection
 *
 * @returns {UseQueryResult<EconomyDashboardData>} Query result with data, isLoading, error, etc
 */
export const useEconomyDashboard = () => {
  return useQuery({
    queryKey: ['economy-dashboard'],
    queryFn: () => economyService.getEconomyDashboard(),
    staleTime: 60 * 1000, // 60 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000, // Refetch every 60 seconds
  })
}

/**
 * Hook to fetch paginated wallet history
 *
 * Features:
 * - No automatic refetch (user controls pagination)
 * - 5 minute stale time
 * - 10 minute garbage collection
 * - Stable query key based on limit
 *
 * @param {number} limit - Number of deposits to fetch (default: 20)
 * @returns {UseQueryResult<DepositHistory>} Query result with data, isLoading, error, etc
 */
export const useWalletHistory = (limit: number = 20) => {
  return useQuery({
    queryKey: ['wallet-history', limit],
    queryFn: () => economyService.getWalletHistory(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false, // No refetch on focus
  })
}
