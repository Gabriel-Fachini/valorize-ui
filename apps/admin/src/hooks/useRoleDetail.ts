import { useQuery } from '@tanstack/react-query'
import rolesService from '@/services/roles'

export const useRoleDetail = (roleId: string) => {
  const query = useQuery({
    queryKey: ['roles', roleId],
    queryFn: async () => await rolesService.get(roleId),
    enabled: !!roleId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  })

  return {
    role: query.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
  }
}

export type UseRoleDetailReturn = ReturnType<typeof useRoleDetail>
