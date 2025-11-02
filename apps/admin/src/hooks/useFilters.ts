import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboard'
import type { DepartmentOption, JobTitleOption } from '@/services/dashboard'

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
 * Hook to fetch job titles for filter dropdown
 */
export const useJobTitles = () => {
  return useQuery<JobTitleOption[]>({
    queryKey: ['jobTitles'],
    queryFn: async () => await dashboardService.getJobTitles(),
    staleTime: 10 * 60 * 1000, // 10 minutes - job titles don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes cache
  })
}

/**
 * Hook to fetch job titles filtered by department
 * Use this when creating/editing a user and a department has been selected
 */
export const useJobTitlesByDepartment = (departmentId?: string) => {
  return useQuery<JobTitleOption[]>({
    queryKey: ['jobTitles', 'byDepartment', departmentId],
    queryFn: async () => {
      if (!departmentId) return []
      return await dashboardService.getJobTitlesByDepartment(departmentId)
    },
    enabled: !!departmentId, // Only fetch if departmentId is provided
    staleTime: 10 * 60 * 1000, // 10 minutes - job titles don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes cache
  })
}
