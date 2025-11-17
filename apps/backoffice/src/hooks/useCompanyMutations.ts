/**
 * React Query Mutation Hooks for Companies
 * Hooks for creating, updating, and managing companies
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import type {
  CreateCompanyInput,
  UpdateCompanyInput,
  AddWalletCreditsInput,
  RemoveWalletCreditsInput,
  UpdateCompanyPlanInput,
  AddCompanyContactInput,
  UpdateCompanyContactInput,
  AddAllowedDomainInput,
} from '@/types/company'
import * as companyService from '@/services/company.service'
import { companyKeys } from './useCompanies'

/**
 * Hook to create a new company
 */
export function useCreateCompany() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: CreateCompanyInput) => companyService.createCompany(input),
    onSuccess: (response) => {
      // Invalidate companies list
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() })

      // Navigate to company details
      if (response.data?.id) {
        navigate({ to: `/clients/${response.data.id}` })
      }
    },
  })
}

/**
 * Hook to update company information
 */
export function useUpdateCompany(companyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateCompanyInput) => companyService.updateCompany(companyId, input),
    onSuccess: () => {
      // Invalidate company details and list
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(companyId) })
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() })
    },
  })
}

/**
 * Hook to activate company
 */
export function useActivateCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (companyId: string) => companyService.activateCompany(companyId),
    onSuccess: (_, companyId) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(companyId) })
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() })
    },
  })
}

/**
 * Hook to deactivate company
 */
export function useDeactivateCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (companyId: string) => companyService.deactivateCompany(companyId),
    onSuccess: (_, companyId) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(companyId) })
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() })
      queryClient.invalidateQueries({ queryKey: companyKeys.wallet(companyId) })
    },
  })
}

/**
 * Hook to add wallet credits
 */
export function useAddWalletCredits(companyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: AddWalletCreditsInput) =>
      companyService.addWalletCredits(companyId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.wallet(companyId) })
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(companyId) })
    },
  })
}

/**
 * Hook to remove wallet credits
 */
export function useRemoveWalletCredits(companyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: RemoveWalletCreditsInput) =>
      companyService.removeWalletCredits(companyId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.wallet(companyId) })
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(companyId) })
    },
  })
}

/**
 * Hook to freeze wallet
 */
export function useFreezeWallet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (companyId: string) => companyService.freezeWallet(companyId),
    onSuccess: (_, companyId) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.wallet(companyId) })
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(companyId) })
    },
  })
}

/**
 * Hook to unfreeze wallet
 */
export function useUnfreezeWallet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (companyId: string) => companyService.unfreezeWallet(companyId),
    onSuccess: (_, companyId) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.wallet(companyId) })
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(companyId) })
    },
  })
}

/**
 * Hook to update company plan
 */
export function useUpdateCompanyPlan(companyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateCompanyPlanInput) =>
      companyService.updateCompanyPlan(companyId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(companyId) })
      queryClient.invalidateQueries({ queryKey: companyKeys.plan(companyId) })
      queryClient.invalidateQueries({ queryKey: companyKeys.billing(companyId) })
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() })
    },
  })
}

/**
 * Hook to add contact
 */
export function useAddContact(companyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: AddCompanyContactInput) => companyService.addContact(companyId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(companyId) })
    },
  })
}

/**
 * Hook to update contact
 */
export function useUpdateContact(companyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ contactId, input }: { contactId: string; input: UpdateCompanyContactInput }) =>
      companyService.updateContact(companyId, contactId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(companyId) })
    },
  })
}

/**
 * Hook to delete contact
 */
export function useDeleteContact(companyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (contactId: string) => companyService.deleteContact(companyId, contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(companyId) })
    },
  })
}

/**
 * Hook to add allowed domain
 */
export function useAddAllowedDomain(companyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: AddAllowedDomainInput) =>
      companyService.addAllowedDomain(companyId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(companyId) })
    },
  })
}

/**
 * Hook to delete allowed domain
 */
export function useDeleteAllowedDomain(companyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (domainId: string) => companyService.deleteAllowedDomain(companyId, domainId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(companyId) })
    },
  })
}
