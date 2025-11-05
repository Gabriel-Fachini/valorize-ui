import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import rolesService from '@/services/roles'
import userRolesService from '@/services/userRoles'
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

  const bulkAssignRoleMutation = useMutation({
    mutationFn: async ({ roleId, userIds }: { roleId: string; userIds: string[] }) => {
      return await userRolesService.assignRoleToUsers(roleId, userIds)
    },
    onSuccess: (data, variables) => {
      // Invalidate both the role and available users queries
      queryClient.invalidateQueries({ queryKey: ['role', variables.roleId] })
      queryClient.invalidateQueries({ queryKey: ['available-users'] })
      
      // Show success with detailed info
      const { successCount, failedCount, failedAssignments } = data.data
      const message = successCount > 0 
        ? `${successCount} usuário${successCount !== 1 ? 's' : ''} adicionado${successCount !== 1 ? 's' : ''} ao cargo com sucesso!`
        : 'Nenhum usuário foi adicionado'
      
      toast.success(message)
      
      // Show warning if there were failures
      if (failedCount > 0 && failedAssignments && failedAssignments.length > 0) {
        const failureMessage = failedAssignments
          .map(f => `${f.userId}: ${f.reason}`)
          .join('\n')
        toast.info(`⚠️ ${failedCount} falha${failedCount !== 1 ? 's' : ''}:\n${failureMessage}`)
      }
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

  const bulkAssignRole = useCallback(
    async (roleId: string, userIds: string[]) => {
      return bulkAssignRoleMutation.mutateAsync({ roleId, userIds })
    },
    [bulkAssignRoleMutation],
  )

  return {
    createRole,
    updateRole,
    deleteRole,
    bulkAssignRole,
    isCreating: createRoleMutation.isPending,
    isUpdating: updateRoleMutation.isPending,
    isDeleting: deleteRoleMutation.isPending,
    isBulkAssigning: bulkAssignRoleMutation.isPending,
    createError: createRoleMutation.error,
    updateError: updateRoleMutation.error,
    deleteError: deleteRoleMutation.error,
    bulkAssignError: bulkAssignRoleMutation.error,
  }
}

export type UseRoleMutationsReturn = ReturnType<typeof useRoleMutations>
