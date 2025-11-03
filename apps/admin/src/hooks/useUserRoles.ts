import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import userRolesService from '@/services/userRoles'
import { toast } from '@/lib/toast'

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    const apiError = error as { response?: { data?: { message?: string } } }
    return apiError?.response?.data?.message || error.message || 'Erro desconhecido'
  }
  return 'Erro desconhecido'
}

export const useUserRoles = (userId: string) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['users', userId, 'roles'],
    queryFn: async () => await userRolesService.getUserRoles(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  })

  const assignRoleMutation = useMutation({
    mutationFn: async (roleId: string) => {
      return await userRolesService.assignRoleToUser(userId, roleId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', userId, 'roles'] })
      toast.success('Role atribuído com sucesso!')
    },
    onError: (error: Error) => {
      const message = getErrorMessage(error)
      toast.error(message)
    },
  })

  const removeRoleMutation = useMutation({
    mutationFn: async (roleId: string) => {
      return await userRolesService.removeRoleFromUser(userId, roleId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', userId, 'roles'] })
      toast.success('Role removido com sucesso!')
    },
    onError: (error: Error) => {
      const message = getErrorMessage(error)
      toast.error(message)
    },
  })

  const assignRole = useCallback(
    async (roleId: string) => {
      return assignRoleMutation.mutateAsync(roleId)
    },
    [assignRoleMutation],
  )

  const removeRole = useCallback(
    async (roleId: string) => {
      return removeRoleMutation.mutateAsync(roleId)
    },
    [removeRoleMutation],
  )

  return {
    userRoles: query.data?.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    assignRole,
    removeRole,
    isAssigningRole: assignRoleMutation.isPending,
    isRemovingRole: removeRoleMutation.isPending,
  }
}

export type UseUserRolesReturn = ReturnType<typeof useUserRoles>
