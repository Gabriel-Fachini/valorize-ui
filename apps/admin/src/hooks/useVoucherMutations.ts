/**
 * Voucher Mutations Hook
 * Hook for handling voucher mutations (sync, bulk assign)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { vouchersService } from '@/services/vouchers'
import type { BulkAssignPayload } from '@/types/vouchers'

export const useVoucherMutations = () => {
  const queryClient = useQueryClient()

  const syncVouchers = useMutation({
    mutationFn: vouchersService.sync,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] })
      toast.success('Catálogo sincronizado com sucesso!', {
        description: `${data.result.synced} produtos sincronizados, ${data.result.deactivated} desativados`,
      })
    },
    onError: (error: any) => {
      toast.error('Erro ao sincronizar catálogo', {
        description: error?.response?.data?.message || error.message || 'Erro desconhecido',
      })
    },
  })

  const bulkAssignVouchers = useMutation({
    mutationFn: (payload: BulkAssignPayload) => vouchersService.bulkAssign(payload),
    onError: (error: any) => {
      toast.error('Erro ao enviar vouchers', {
        description: error?.response?.data?.message || error.message || 'Erro desconhecido',
      })
    },
  })

  return {
    syncVouchers: {
      mutate: syncVouchers.mutate,
      mutateAsync: syncVouchers.mutateAsync,
      isPending: syncVouchers.isPending,
      isError: syncVouchers.isError,
      error: syncVouchers.error,
    },
    bulkAssignVouchers: {
      mutate: bulkAssignVouchers.mutate,
      mutateAsync: bulkAssignVouchers.mutateAsync,
      isPending: bulkAssignVouchers.isPending,
      isError: bulkAssignVouchers.isError,
      isSuccess: bulkAssignVouchers.isSuccess,
      data: bulkAssignVouchers.data,
      error: bulkAssignVouchers.error,
    },
  }
}

export type UseVoucherMutationsReturn = ReturnType<typeof useVoucherMutations>
