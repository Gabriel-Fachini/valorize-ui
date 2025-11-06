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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['prize', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['prizes'] })
      toast.success(
        variables.isActive ? 'Prêmio ativado!' : 'Prêmio desativado!',
        {
          description: data.prize.name,
        }
      )
    },
    onError: (error: any) => {
      toast.error('Erro ao alterar status do prêmio', {
        description: error?.response?.data?.message || error.message || 'Erro desconhecido',
      })
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
