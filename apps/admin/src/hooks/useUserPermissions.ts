import { useQuery } from '@tanstack/react-query'
import userPermissionsService from '@/services/userPermissions'

export const useUserPermissions = () => {
  const query = useQuery({
    queryKey: ['userPermissions'],
    queryFn: async () => await userPermissionsService.getUserPermissions(),
    staleTime: 60 * 60 * 1000, // 1 hour - permissões raramente mudam
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    retry: 2,
  })

  // Garantir que permissions é sempre um array
  const permissions = Array.isArray(query.data?.data)
    ? query.data.data
    : Array.isArray(query.data)
      ? query.data
      : []

  return {
    permissions,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

export type UseUserPermissionsReturn = ReturnType<typeof useUserPermissions>
