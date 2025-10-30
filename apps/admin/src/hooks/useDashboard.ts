import { useQuery } from '@tanstack/react-query'
// import { dashboardService } from '../services/dashboard'
import type { DashboardData } from '../types/dashboard'

// Mock data for development - Remove when API is ready
const mockDashboardData: DashboardData = {
  metrics: {
    totalCompliments: 1247,
    coinsMovement: 18560,
    activeUsers: {
      count: 342,
      percentage: 68.4,
    },
    prizesRedeemed: 89,
    platformEngagement: 73.2,
  },
  complimentsByWeek: [
    { week: '2025-09-01', count: 120 },
    { week: '2025-09-08', count: 145 },
    { week: '2025-09-15', count: 132 },
    { week: '2025-09-22', count: 168 },
    { week: '2025-09-29', count: 189 },
    { week: '2025-10-06', count: 203 },
    { week: '2025-10-13', count: 195 },
    { week: '2025-10-20', count: 218 },
  ],
  topValues: [
    {
      valueId: '1',
      valueName: 'Colaboração',
      count: 425,
      percentage: 34.1,
    },
    {
      valueId: '2',
      valueName: 'Inovação',
      count: 312,
      percentage: 25.0,
    },
    {
      valueId: '3',
      valueName: 'Respeito',
      count: 248,
      percentage: 19.9,
    },
    {
      valueId: '4',
      valueName: 'Transparência',
      count: 156,
      percentage: 12.5,
    },
    {
      valueId: '5',
      valueName: 'Excelência',
      count: 106,
      percentage: 8.5,
    },
  ],
}

/**
 * React Query hook for fetching all dashboard data
 * Recommended: Use this single hook for better performance
 *
 * TODO: Uncomment API call when backend is ready
 */
export const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboard', 'all'],
    // TODO: Replace mock with real API call
    // queryFn: () => dashboardService.getDashboardData(),
    queryFn: async (): Promise<DashboardData> => {
      // Simulate API delay to visualize loading states
      await new Promise(resolve => setTimeout(resolve, 2000))
      return mockDashboardData
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - data refreshes frequently for executive view
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

/**
 * Individual metric hooks (use only if needed separately)
 * TODO: Uncomment when API is ready and you need granular endpoints
 */

/*
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: () => dashboardService.getMetrics(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export const useComplimentsByWeek = () => {
  return useQuery({
    queryKey: ['dashboard', 'compliments-by-week'],
    queryFn: () => dashboardService.getComplimentsByWeek(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export const useTopValues = () => {
  return useQuery({
    queryKey: ['dashboard', 'top-values'],
    queryFn: () => dashboardService.getTopValues(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}
*/
