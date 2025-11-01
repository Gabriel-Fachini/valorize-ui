/**
 * Users List Hook
 * Hook for fetching and managing the list of users with pagination and filters
 */

import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { usersService } from '@/services/users'
import type { UsersQueryParams } from '@/types/users'

export const useUsers = (params?: UsersQueryParams) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['users', params],
    queryFn: async () => await usersService.list(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    // Keep previous data while fetching new page
    placeholderData: keepPreviousData,
  })

  const invalidateUsers = () => {
    queryClient.invalidateQueries({
      queryKey: ['users'],
      exact: false,
    })
  }

  return {
    users: query.data?.data ?? [],
    totalCount: query.data?.totalCount ?? 0,
    pageCount: query.data?.pageCount ?? 0,
    currentPage: query.data?.currentPage ?? 1,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    invalidateUsers,
    refetch: query.refetch,
  }
}

export type UseUsersReturn = ReturnType<typeof useUsers>
