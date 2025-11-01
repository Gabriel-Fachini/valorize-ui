/**
 * User Detail Hook
 * Hook for fetching detailed information about a specific user
 */

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { usersService } from '@/services/users'

export const useUserDetail = (userId: string | undefined) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required')
      return await usersService.get(userId)
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  })

  const invalidateUser = () => {
    if (userId) {
      queryClient.invalidateQueries({
        queryKey: ['user', userId],
        exact: true,
      })
    }
  }

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    invalidateUser,
    refetch: query.refetch,
  }
}

export type UseUserDetailReturn = ReturnType<typeof useUserDetail>
