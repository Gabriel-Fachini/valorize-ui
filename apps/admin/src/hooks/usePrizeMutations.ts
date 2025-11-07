/**
 * Prize Mutations Hook
 * Hook for handling prize mutations (create, update, delete, toggle active)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { prizesService } from '@/services/prizes'
import type { CreatePrizePayload, UpdatePrizePayload } from '@/types/prizes'

export const usePrizeMutations = () => {
  const queryClient = useQueryClient()

  const createPrize = useMutation({
    mutationFn: (payload: CreatePrizePayload) => prizesService.create(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['prizes'] })
      toast.success('Prêmio criado com sucesso!', {
        description: data.prize.name,
      })
    },
    onError: (error: any) => {
      toast.error('Erro ao criar prêmio', {
        description: error?.response?.data?.message || error.message || 'Erro desconhecido',
      })
    },
  })

  const updatePrize = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePrizePayload }) =>
      prizesService.update(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['prize', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['prizes'] })
      toast.success('Prêmio atualizado com sucesso!', {
        description: data.prize.name,
      })
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar prêmio', {
        description: error?.response?.data?.message || error.message || 'Erro desconhecido',
      })
    },
  })

  const deletePrize = useMutation({
    mutationFn: (id: string) => prizesService.delete(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['prizes'] })
      toast.success('Prêmio excluído com sucesso!', {
        description: data.message,
      })
    },
    onError: (error: any) => {
      toast.error('Erro ao excluir prêmio', {
        description: error?.response?.data?.message || error.message || 'Erro desconhecido',
      })
    },
  })

  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      prizesService.toggleActive(id, isActive),
    onMutate: async ({ id, isActive }) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ['prizes'] })
      await queryClient.cancelQueries({ queryKey: ['prize', id] })

      // Snapshot the previous values
      const previousPrizesQueries = queryClient.getQueriesData<any>({ queryKey: ['prizes'] })
      const previousPrizeQuery = queryClient.getQueryData(['prize', id])

      // Optimistically update ALL prizes list queries (with different params)
      previousPrizesQueries.forEach(([queryKey]) => {
        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old?.prizes) return old
          return {
            ...old,
            prizes: old.prizes.map((prize: any) =>
              prize.id === id ? { ...prize, isActive } : prize
            ),
          }
        })
      })

      // Also update the single prize query if it exists
      queryClient.setQueryData(['prize', id], (old: any) => {
        if (!old?.prize) return old
        return {
          ...old,
          prize: { ...old.prize, isActive },
        }
      })

      return { previousPrizesQueries, previousPrizeQuery }
    },
    onError: (error: any, variables, context) => {
      // Revert to previous data on error
      if (context?.previousPrizesQueries) {
        context.previousPrizesQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      if (context?.previousPrizeQuery) {
        queryClient.setQueryData(['prize', variables.id], context.previousPrizeQuery)
      }
      toast.error('Erro ao alterar status do prêmio', {
        description: error?.response?.data?.message || error.message || 'Erro desconhecido',
      })
    },
    onSuccess: (data, variables) => {
      // Show success toast
      toast.success(`Prêmio ${variables.isActive ? 'ativado' : 'desativado'} com sucesso`)
    },
    onSettled: (data, error, variables) => {
      // Invalidate to ensure sync with server (only if mutation succeeded)
      if (!error) {
        queryClient.invalidateQueries({ queryKey: ['prize', variables.id] })
        queryClient.invalidateQueries({ queryKey: ['prizes'] })
      }
    },
  })

  return {
    createPrize: {
      mutate: createPrize.mutate,
      mutateAsync: createPrize.mutateAsync,
      isPending: createPrize.isPending,
      isError: createPrize.isError,
      isSuccess: createPrize.isSuccess,
      error: createPrize.error,
    },
    updatePrize: {
      mutate: updatePrize.mutate,
      mutateAsync: updatePrize.mutateAsync,
      isPending: updatePrize.isPending,
      isError: updatePrize.isError,
      isSuccess: updatePrize.isSuccess,
      error: updatePrize.error,
    },
    deletePrize: {
      mutate: deletePrize.mutate,
      mutateAsync: deletePrize.mutateAsync,
      isPending: deletePrize.isPending,
      isError: deletePrize.isError,
      isSuccess: deletePrize.isSuccess,
      error: deletePrize.error,
    },
    toggleActive: {
      mutate: toggleActive.mutate,
      mutateAsync: toggleActive.mutateAsync,
      isPending: toggleActive.isPending,
      isError: toggleActive.isError,
      isSuccess: toggleActive.isSuccess,
      error: toggleActive.error,
    },
  }
}

export type UsePrizeMutationsReturn = ReturnType<typeof usePrizeMutations>
