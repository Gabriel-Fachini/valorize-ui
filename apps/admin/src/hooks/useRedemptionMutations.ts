/**
 * Redemption Mutations Hook
 * Hook for handling redemption mutations (status, tracking, notes, cancel)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { redemptionsService } from '@/services/redemptions'
import type { UpdateStatusPayload, AddTrackingPayload, AddNotePayload, CancelRedemptionPayload } from '@/types/redemptions'

export const useRedemptionMutations = () => {
  const queryClient = useQueryClient()

  const updateStatus = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateStatusPayload }) =>
      redemptionsService.updateStatus(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['redemption', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['redemptions'] })
      toast.success('Status atualizado com sucesso!', {
        description: `Status: ${data.redemption.status}`,
      })
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar status', {
        description: error?.response?.data?.message || error.message || 'Erro desconhecido',
      })
    },
  })

  const addTracking = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AddTrackingPayload }) =>
      redemptionsService.addTracking(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['redemption', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['redemptions'] })
      toast.success('Código de rastreamento adicionado!', {
        description: data.trackingCode,
      })
    },
    onError: (error: any) => {
      toast.error('Erro ao adicionar rastreamento', {
        description: error?.response?.data?.message || error.message || 'Erro desconhecido',
      })
    },
  })

  const addNote = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AddNotePayload }) =>
      redemptionsService.addNote(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['redemption', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['redemptions'] })
      toast.success('Nota adicionada com sucesso!')
    },
    onError: (error: any) => {
      toast.error('Erro ao adicionar nota', {
        description: error?.response?.data?.message || error.message || 'Erro desconhecido',
      })
    },
  })

  const cancel = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: CancelRedemptionPayload }) =>
      redemptionsService.cancel(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['redemption', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['redemptions'] })
      toast.success('Resgate cancelado com sucesso!', {
        description: `Moedas reembolsadas: ${data.refundedCoins}`,
      })
    },
    onError: (error: any) => {
      toast.error('Erro ao cancelar resgate', {
        description: error?.response?.data?.message || error.message || 'Erro desconhecido',
      })
    },
  })

  return {
    updateStatus: {
      mutate: updateStatus.mutate,
      mutateAsync: updateStatus.mutateAsync,
      isPending: updateStatus.isPending,
      isError: updateStatus.isError,
      isSuccess: updateStatus.isSuccess,
      error: updateStatus.error,
    },
    addTracking: {
      mutate: addTracking.mutate,
      mutateAsync: addTracking.mutateAsync,
      isPending: addTracking.isPending,
      isError: addTracking.isError,
      isSuccess: addTracking.isSuccess,
      error: addTracking.error,
    },
    addNote: {
      mutate: addNote.mutate,
      mutateAsync: addNote.mutateAsync,
      isPending: addNote.isPending,
      isError: addNote.isError,
      isSuccess: addNote.isSuccess,
      error: addNote.error,
    },
    cancel: {
      mutate: cancel.mutate,
      mutateAsync: cancel.mutateAsync,
      isPending: cancel.isPending,
      isError: cancel.isError,
      isSuccess: cancel.isSuccess,
      error: cancel.error,
    },
  }
}

export type UseRedemptionMutationsReturn = ReturnType<typeof useRedemptionMutations>
