/**
 * Voucher Mutations Hook
 * React Query mutation hooks for voucher operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { syncCatalog, updateVoucher, toggleVoucherStatus, uploadVoucherImages } from '@/services/voucher.service'
import { voucherKeys } from './useVouchers'
import { useToast } from './useToast'
import type { SyncCatalogResponse, UpdateVoucherInput } from '@/types/voucher'

/**
 * Hook to sync voucher catalog with Tremendous API
 *
 * This mutation will:
 * - Call the sync endpoint
 * - Invalidate voucher queries on success
 * - Show success/error toasts
 *
 * @returns Mutation object with mutate, isLoading, etc.
 */
export function useSyncCatalog() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: syncCatalog,

    onSuccess: (data: SyncCatalogResponse) => {
      // Invalidate all voucher queries to refetch fresh data
      queryClient.invalidateQueries({
        queryKey: voucherKeys.lists(),
        exact: false,
      })

      // Show success toast with summary
      const summary = [
        `${data.syncedProducts} produtos sincronizados`,
        data.createdPrizes > 0 ? `${data.createdPrizes} prêmios criados` : null,
        data.reactivatedPrizes > 0 ? `${data.reactivatedPrizes} prêmios reativados` : null,
        data.deactivatedProducts > 0 ? `${data.deactivatedProducts} produtos desativados` : null,
        data.deactivatedPrizes > 0 ? `${data.deactivatedPrizes} prêmios desativados` : null,
      ].filter(Boolean).join(', ')

      toast({
        title: 'Catálogo sincronizado com sucesso!',
        description: summary,
        variant: 'default',
      })
    },

    onError: (error: any) => {
      console.error('Error syncing catalog:', error)

      const errorMessage = error.response?.data?.error
        || error.response?.data?.message
        || error.message
        || 'Erro ao sincronizar catálogo'

      toast({
        title: 'Erro ao sincronizar catálogo',
        description: errorMessage,
        variant: 'destructive',
      })
    },
  })
}

/**
 * Hook to update a voucher product
 *
 * @returns Mutation object with mutate, isLoading, etc.
 */
export function useUpdateVoucher() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateVoucherInput }) =>
      updateVoucher(id, input),

    onSuccess: (data, variables) => {
      // Invalidate both the list and the specific voucher detail
      queryClient.invalidateQueries({
        queryKey: voucherKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: voucherKeys.detail(variables.id),
      })

      toast({
        title: 'Voucher atualizado com sucesso!',
        description: data.message || 'As informações do voucher foram atualizadas.',
        variant: 'default',
      })
    },

    onError: (error: any) => {
      console.error('Error updating voucher:', error)

      const errorMessage = error.response?.data?.error
        || error.response?.data?.message
        || error.message
        || 'Erro ao atualizar voucher'

      toast({
        title: 'Erro ao atualizar voucher',
        description: errorMessage,
        variant: 'destructive',
      })
    },
  })
}

/**
 * Hook to toggle voucher product active status
 *
 * @returns Mutation object with mutate, isLoading, etc.
 */
export function useToggleVoucherStatus() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleVoucherStatus(id, isActive),

    onSuccess: (data, variables) => {
      // Invalidate both the list and the specific voucher detail
      queryClient.invalidateQueries({
        queryKey: voucherKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: voucherKeys.detail(variables.id),
      })

      const newStatus = data.product?.isActive ? 'ativado' : 'desativado'

      toast({
        title: `Voucher ${newStatus} com sucesso!`,
        description: data.message || `O voucher foi ${newStatus}.`,
        variant: 'default',
      })
    },

    onError: (error: any) => {
      console.error('Error toggling voucher status:', error)

      const errorMessage = error.response?.data?.error
        || error.response?.data?.message
        || error.message
        || 'Erro ao alterar status do voucher'

      toast({
        title: 'Erro ao alterar status',
        description: errorMessage,
        variant: 'destructive',
      })
    },
  })
}

/**
 * Hook to upload images for a voucher product
 *
 * Accepts up to 4 image files at once (JPEG, PNG, WebP, max 5MB each)
 * Images are added to the existing array (not replaced)
 *
 * @returns Mutation object with mutate, isLoading, etc.
 */
export function useUploadVoucherImages() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, files }: { id: string; files: File[] }) =>
      uploadVoucherImages(id, files),

    onSuccess: (data, variables) => {
      // Invalidate both the list and the specific voucher detail
      queryClient.invalidateQueries({
        queryKey: voucherKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: voucherKeys.detail(variables.id),
      })

      toast({
        title: 'Imagens enviadas com sucesso!',
        description: data.message || `${data.images.length} imagem(ns) atualizada(s).`,
        variant: 'default',
      })
    },

    onError: (error: any) => {
      console.error('Error uploading voucher images:', error)

      const errorMessage = error.response?.data?.error
        || error.response?.data?.message
        || error.message
        || 'Erro ao enviar imagens'

      toast({
        title: 'Erro ao enviar imagens',
        description: errorMessage,
        variant: 'destructive',
      })
    },
  })
}

/**
 * Export all mutation hooks
 */
export const voucherMutations = {
  useSyncCatalog,
  useUpdateVoucher,
  useToggleVoucherStatus,
  useUploadVoucherImages,
}
