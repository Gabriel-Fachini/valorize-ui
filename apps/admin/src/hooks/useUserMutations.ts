import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usersService } from '@/services/users'
import type { UserFormData, UserUpdateData } from '@/types/users'

export const useUserMutations = () => {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: async (data: UserFormData) => await usersService.create(data),
    onSuccess: () => {
      // Invalidate users list to refresh after creation
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: UserUpdateData }) =>
      await usersService.update(userId, data),
    onSuccess: (_, variables) => {
      // Invalidate both the specific user and the users list
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => await usersService.delete(userId),
    onSuccess: (_, userId) => {
      // Invalidate both the specific user and the users list
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: async (userId: string) => await usersService.resetPassword(userId),
  })

  const sendWelcomeEmailMutation = useMutation({
    mutationFn: async ({ userId, requestedBy }: { userId: string; requestedBy: string }) =>
      await usersService.sendWelcomeEmail(userId, requestedBy),
    onSuccess: (_, variables) => {
      // Invalidate both the specific user and the users list to reflect updated email count
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const bulkSendWelcomeEmailsMutation = useMutation({
    mutationFn: async ({ userIds, requestedBy }: { userIds: string[]; requestedBy: string }) =>
      await usersService.bulkSendWelcomeEmails({ userIds, requestedBy }),
    onSuccess: () => {
      // Invalidate users list to refresh all affected users
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  return {
    // Create
    createUser: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    // Update
    updateUser: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    // Delete
    deleteUser: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,

    // Reset Password
    resetPassword: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error,

    // Send Welcome Email
    sendWelcomeEmail: sendWelcomeEmailMutation.mutateAsync,
    isSendingWelcomeEmail: sendWelcomeEmailMutation.isPending,
    sendWelcomeEmailError: sendWelcomeEmailMutation.error,

    // Bulk Send Welcome Emails
    bulkSendWelcomeEmails: bulkSendWelcomeEmailsMutation.mutateAsync,
    isBulkSendingWelcomeEmails: bulkSendWelcomeEmailsMutation.isPending,
    bulkSendWelcomeEmailsError: bulkSendWelcomeEmailsMutation.error,

    // General states
    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      resetPasswordMutation.isPending ||
      sendWelcomeEmailMutation.isPending ||
      bulkSendWelcomeEmailsMutation.isPending,
  }
}

export type UseUserMutationsReturn = ReturnType<typeof useUserMutations>
