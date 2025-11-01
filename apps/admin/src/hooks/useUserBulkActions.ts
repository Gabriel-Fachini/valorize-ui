/**
 * User Bulk Actions Hook
 * Hook for performing bulk operations on multiple users
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usersService } from '@/services/users'
import type { BulkActionsPayload } from '@/types/users'

export const useUserBulkActions = () => {
  const queryClient = useQueryClient()

  const bulkActionMutation = useMutation({
    mutationFn: async (payload: BulkActionsPayload) => await usersService.bulkActions(payload),
    onSuccess: () => {
      // Invalidate users list after bulk action
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const performBulkAction = async (payload: BulkActionsPayload) => {
    const result = await bulkActionMutation.mutateAsync(payload)

    // If action is 'export', trigger download
    if (payload.action === 'export' && result instanceof Blob) {
      const url = window.URL.createObjectURL(result)
      const link = document.createElement('a')
      link.href = url
      link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      return null
    }

    return result
  }

  return {
    performBulkAction,
    isPending: bulkActionMutation.isPending,
    error: bulkActionMutation.error,
    isError: bulkActionMutation.isError,
  }
}

export type UseUserBulkActionsReturn = ReturnType<typeof useUserBulkActions>
