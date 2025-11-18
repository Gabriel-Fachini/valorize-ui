/**
 * React Query Hooks for Financial Management
 * Query hooks for fetching charges data
 */

import { useQuery } from '@tanstack/react-query'
import type { ChargesFilters, ChargesPagination, ChargesSorting } from '@/types/financial'
import * as financialService from '@/services/financial.service'

// Query keys factory
export const chargeKeys = {
  all: ['charges'] as const,
  lists: () => [...chargeKeys.all, 'list'] as const,
  list: (filters?: ChargesFilters, pagination?: ChargesPagination, sorting?: ChargesSorting) =>
    [...chargeKeys.lists(), { filters, pagination, sorting }] as const,
  details: () => [...chargeKeys.all, 'detail'] as const,
  detail: (id: string) => [...chargeKeys.details(), id] as const,
}

/**
 * Hook to fetch list of charges
 */
export function useCharges(
  filters?: ChargesFilters,
  pagination?: ChargesPagination,
  sorting?: ChargesSorting
) {
  return useQuery({
    queryKey: chargeKeys.list(filters, pagination, sorting),
    queryFn: async () => {
      const response = await financialService.listCharges(filters, pagination, sorting)
      if (!response.success) {
        throw new Error(response.error || 'Erro ao buscar cobranças')
      }
      // Transform response to expected format
      return {
        data: response.data,
        pagination: response.pagination,
        aggregations: response.aggregations,
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch charge details
 */
export function useCharge(chargeId: string | undefined) {
  return useQuery({
    queryKey: chargeKeys.detail(chargeId!),
    queryFn: async () => {
      const response = await financialService.getChargeDetails(chargeId!)
      if (!response.success) {
        throw new Error(response.error || 'Erro ao buscar detalhes da cobrança')
      }
      return response.data
    },
    enabled: !!chargeId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}
