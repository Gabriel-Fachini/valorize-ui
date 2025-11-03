import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import rolesService from '@/services/roles'
import type { RolesQueryParams } from '@/types/roles'

export const useRoles = (params?: RolesQueryParams) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['roles', params],
    queryFn: async () => await rolesService.list(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    // Keep previous data while fetching new page
    placeholderData: keepPreviousData,
  })

  const invalidateRoles = () => {
    queryClient.invalidateQueries({
      queryKey: ['roles'],
      exact: false,
    })
  }

  return {
    roles: query.data?.data ?? [],
    totalCount: query.data?.totalCount ?? 0,
    pageCount: query.data?.pageCount ?? 0,
    currentPage: query.data?.currentPage ?? 1,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    invalidateRoles,
    refetch: query.refetch,
  }
}

export type UseRolesReturn = ReturnType<typeof useRoles>
