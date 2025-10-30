import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboard'
import type { DepartmentOption, RoleOption } from '@/services/dashboard'

/**
 * Hook to fetch departments for filter dropdown
 */
export const useDepartments = () => {
  return useQuery<DepartmentOption[]>({
    queryKey: ['departments'],
    queryFn: async () => await dashboardService.getDepartments(),
    staleTime: 10 * 60 * 1000, // 10 minutes - departments don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes cache
  })
}

/**
 * Hook to fetch roles for filter dropdown
 */
export const useRoles = () => {
  return useQuery<RoleOption[]>({
    queryKey: ['roles'],
    queryFn: async () => await dashboardService.getRoles(),
    staleTime: 10 * 60 * 1000, // 10 minutes - roles don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes cache
  })
}
