import { useQuery } from '@tanstack/react-query'
import permissionsService from '@/services/permissions'
import type { PermissionInfoByCategory } from '@/types/roles'

interface PermissionsInfoResponse {
  categories?: PermissionInfoByCategory[]
}

export const usePermissionsInfo = () => {
  const query = useQuery({
    queryKey: ['permissions', 'info'],
    queryFn: async () => await permissionsService.listPermissionsInfo(),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: false,
    retry: 2,
  })

  const permissionsData = query.data?.data ?? []
  
  // Handle both response formats:
  // Expected: Array (as documented in FRONTEND_IMPLEMENTATION_GUIDE)
  // Actual: May come as object with categories field
  let permissionsArray: PermissionInfoByCategory[] = []
  
  if (Array.isArray(permissionsData)) {
    permissionsArray = permissionsData
  } else if (permissionsData && typeof permissionsData === 'object') {
    const response = permissionsData as PermissionsInfoResponse
    permissionsArray = response.categories ?? []
  }

  return {
    permissionsInfo: permissionsArray,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

export type UsePermissionsInfoReturn = ReturnType<typeof usePermissionsInfo>
