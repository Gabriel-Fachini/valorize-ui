/**
 * React Query Mutation Hooks for Financial Management
 * Hooks for creating, updating, and managing charges
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  CreateChargeInput,
  UpdateChargeInput,
  RegisterPaymentInput,
} from '@/types/financial'
import * as financialService from '@/services/financial.service'
import { chargeKeys } from './useCharges'

/**
 * Hook to create a new charge
 */
export function useCreateCharge() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateChargeInput) => financialService.createCharge(input),
    onSuccess: () => {
      // Invalidate charges list to refetch with new data
      queryClient.invalidateQueries({ queryKey: chargeKeys.lists() })
    },
  })
}

/**
 * Hook to update charge information
 */
export function useUpdateCharge(chargeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateChargeInput) => financialService.updateCharge(chargeId, input),
    onSuccess: () => {
      // Invalidate charge details and list
      queryClient.invalidateQueries({ queryKey: chargeKeys.detail(chargeId) })
      queryClient.invalidateQueries({ queryKey: chargeKeys.lists() })
    },
  })
}

/**
 * Hook to delete charge
 */
export function useDeleteCharge() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (chargeId: string) => financialService.deleteCharge(chargeId),
    onSuccess: () => {
      // Invalidate charges list
      queryClient.invalidateQueries({ queryKey: chargeKeys.lists() })
    },
  })
}

/**
 * Hook to cancel charge
 */
export function useCancelCharge() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (chargeId: string) => financialService.cancelCharge(chargeId),
    onSuccess: (_, chargeId) => {
      // Invalidate charge details and list
      queryClient.invalidateQueries({ queryKey: chargeKeys.detail(chargeId) })
      queryClient.invalidateQueries({ queryKey: chargeKeys.lists() })
    },
  })
}

/**
 * Hook to register payment
 */
export function useRegisterPayment(chargeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: RegisterPaymentInput) => financialService.registerPayment(chargeId, input),
    onSuccess: () => {
      // Invalidate charge details and list (payment affects status and balance)
      queryClient.invalidateQueries({ queryKey: chargeKeys.detail(chargeId) })
      queryClient.invalidateQueries({ queryKey: chargeKeys.lists() })
    },
  })
}

/**
 * Hook to upload attachment
 */
export function useUploadAttachment(chargeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => financialService.uploadAttachment(chargeId, file),
    onSuccess: () => {
      // Invalidate charge details to show new attachment
      queryClient.invalidateQueries({ queryKey: chargeKeys.detail(chargeId) })
    },
  })
}

/**
 * Hook to delete attachment
 */
export function useDeleteAttachment(chargeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (attachmentId: string) =>
      financialService.deleteAttachment(chargeId, attachmentId),
    onSuccess: () => {
      // Invalidate charge details to remove deleted attachment
      queryClient.invalidateQueries({ queryKey: chargeKeys.detail(chargeId) })
    },
  })
}
