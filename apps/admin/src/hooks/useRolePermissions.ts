import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import permissionsService from '@/services/permissions'
import { toast } from '@/lib/toast'

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    const apiError = error as { response?: { data?: { message?: string } } }
    return apiError?.response?.data?.message || error.message || 'Erro desconhecido'
  }
  return 'Erro desconhecido'
}

export const useRolePermissions = (roleId: string) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['roles', roleId, 'permissions'],
    queryFn: async () => await permissionsService.getRolePermissions(roleId),
    enabled: !!roleId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  })

  const setPermissionsMutation = useMutation({
    mutationFn: async (permissionNames: string[]) => {
      return await permissionsService.setRolePermissions(roleId, permissionNames)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles', roleId, 'permissions'] })
      queryClient.invalidateQueries({ queryKey: ['roles', roleId] })
      toast.success('Permissões atualizadas com sucesso!')
    },
    onError: (error: Error) => {
      const message = getErrorMessage(error)
      toast.error(message)
    },
  })

  const addPermissionsMutation = useMutation({
    mutationFn: async (permissionNames: string[]) => {
      return await permissionsService.addRolePermissions(roleId, permissionNames)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles', roleId, 'permissions'] })
      queryClient.invalidateQueries({ queryKey: ['roles', roleId] })
      toast.success('Permissões adicionadas com sucesso!')
    },
    onError: (error: Error) => {
      const message = getErrorMessage(error)
      toast.error(message)
    },
  })

  const removePermissionsMutation = useMutation({
    mutationFn: async (permissionNames: string[]) => {
      return await permissionsService.removeRolePermissions(roleId, permissionNames)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles', roleId, 'permissions'] })
      queryClient.invalidateQueries({ queryKey: ['roles', roleId] })
      toast.success('Permissões removidas com sucesso!')
    },
    onError: (error: Error) => {
      const message = getErrorMessage(error)
      toast.error(message)
    },
  })

  const setPermissions = useCallback(
    async (permissionNames: string[]) => {
      return setPermissionsMutation.mutateAsync(permissionNames)
    },
    [setPermissionsMutation],
  )

  const addPermissions = useCallback(
    async (permissionNames: string[]) => {
      return addPermissionsMutation.mutateAsync(permissionNames)
    },
    [addPermissionsMutation],
  )

  const removePermissions = useCallback(
    async (permissionNames: string[]) => {
      return removePermissionsMutation.mutateAsync(permissionNames)
    },
    [removePermissionsMutation],
  )

  return {
    permissions: query.data?.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    setPermissions,
    addPermissions,
    removePermissions,
    isSettingPermissions: setPermissionsMutation.isPending,
    isAddingPermissions: addPermissionsMutation.isPending,
    isRemovingPermissions: removePermissionsMutation.isPending,
  }
}

export type UseRolePermissionsReturn = ReturnType<typeof useRolePermissions>
