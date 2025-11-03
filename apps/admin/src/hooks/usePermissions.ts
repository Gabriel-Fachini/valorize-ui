import { useQuery } from '@tanstack/react-query'
import permissionsService from '@/services/permissions'

export const usePermissions = () => {
  const query = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => await permissionsService.listAll(),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: false,
    retry: 2,
  })

  return {
    permissions: query.data?.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}

export const usePermissionCategories = () => {
  const query = useQuery({
    queryKey: ['permissions', 'categories'],
    queryFn: async () => await permissionsService.listCategories(),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: false,
    retry: 2,
  })

  return {
    categories: query.data?.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}

export type UsePermissionsReturn = ReturnType<typeof usePermissions>
export type UsePermissionCategoriesReturn = ReturnType<typeof usePermissionCategories>
