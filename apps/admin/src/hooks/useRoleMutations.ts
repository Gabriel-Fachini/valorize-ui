import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import rolesService from '@/services/roles'
import type { RoleFormData, RoleUpdateData } from '@/types/roles'
import { toast } from '@/lib/toast'

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    const apiError = error as { response?: { data?: { message?: string } } }
    return apiError?.response?.data?.message || error.message || 'Erro desconhecido'
  }
  return 'Erro desconhecido'
}

export const useRoleMutations = () => {
  const queryClient = useQueryClient()

  const createRoleMutation = useMutation({
    mutationFn: async (roleData: RoleFormData) => {
      return await rolesService.create(roleData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Role criado com sucesso!')
    },
    onError: (error: Error) => {
      const message = getErrorMessage(error)
      toast.error(message)
    },
  })

  const updateRoleMutation = useMutation({
    mutationFn: async ({ roleId, data }: { roleId: string; data: RoleUpdateData }) => {
      return await rolesService.update(roleId, data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      queryClient.setQueryData(['roles', data.data.id], data)
      toast.success('Role atualizado com sucesso!')
    },
    onError: (error: Error) => {
      const message = getErrorMessage(error)
      toast.error(message)
    },
  })

  const deleteRoleMutation = useMutation({
    mutationFn: async (roleId: string) => {
      return await rolesService.delete(roleId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Role deletado com sucesso!')
    },
    onError: (error: Error) => {
      const message = getErrorMessage(error)
      toast.error(message)
    },
  })

  const createRole = useCallback(
    async (roleData: RoleFormData) => {
      return createRoleMutation.mutateAsync(roleData)
    },
    [createRoleMutation],
  )

  const updateRole = useCallback(
    async (roleId: string, data: RoleUpdateData) => {
      return updateRoleMutation.mutateAsync({ roleId, data })
    },
    [updateRoleMutation],
  )

  const deleteRole = useCallback(
    async (roleId: string) => {
      return deleteRoleMutation.mutateAsync(roleId)
    },
    [deleteRoleMutation],
  )

  return {
    createRole,
    updateRole,
    deleteRole,
    isCreating: createRoleMutation.isPending,
    isUpdating: updateRoleMutation.isPending,
    isDeleting: deleteRoleMutation.isPending,
    createError: createRoleMutation.error,
    updateError: updateRoleMutation.error,
    deleteError: deleteRoleMutation.error,
  }
}

export type UseRoleMutationsReturn = ReturnType<typeof useRoleMutations>
