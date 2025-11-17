/**
 * React Query Hooks for Companies
 * Query hooks for fetching company data
 */

import { useQuery } from '@tanstack/react-query'
import type {
  CompanyFilters,
  PaginationParams,
  SortingParams,
  MetricsQueryParams,
} from '@/types/company'
import * as companyService from '@/services/company.service'

// Query keys factory
export const companyKeys = {
  all: ['companies'] as const,
  lists: () => [...companyKeys.all, 'list'] as const,
  list: (filters?: CompanyFilters, pagination?: PaginationParams, sorting?: SortingParams) =>
    [...companyKeys.lists(), { filters, pagination, sorting }] as const,
  details: () => [...companyKeys.all, 'detail'] as const,
  detail: (id: string) => [...companyKeys.details(), id] as const,
  wallet: (id: string) => [...companyKeys.all, 'wallet', id] as const,
  metrics: (id: string, params?: MetricsQueryParams) =>
    [...companyKeys.all, 'metrics', id, params] as const,
  billing: (id: string) => [...companyKeys.all, 'billing', id] as const,
}

/**
 * Hook to fetch list of companies
 */
export function useCompanies(
  filters?: CompanyFilters,
  pagination?: PaginationParams,
  sorting?: SortingParams
) {
  return useQuery({
    queryKey: companyKeys.list(filters, pagination, sorting),
    queryFn: async () => {
      const response = await companyService.listCompanies(filters, pagination, sorting)
      if (!response.success) {
        throw new Error(response.error || 'Erro ao buscar empresas')
      }
      // Transform PaginatedApiResponse to PaginatedResult
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
 * Hook to fetch company details
 */
export function useCompany(companyId: string | undefined) {
  return useQuery({
    queryKey: companyKeys.detail(companyId!),
    queryFn: async () => {
      const response = await companyService.getCompanyDetails(companyId!)
      if (!response.success) {
        throw new Error(response.error || 'Erro ao buscar detalhes da empresa')
      }
      return response.data
    },
    enabled: !!companyId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to fetch wallet status
 */
export function useCompanyWallet(companyId: string | undefined) {
  return useQuery({
    queryKey: companyKeys.wallet(companyId!),
    queryFn: async () => {
      const response = await companyService.getWalletStatus(companyId!)
      if (!response.success) {
        throw new Error(response.error || 'Erro ao buscar status da carteira')
      }
      return response.data
    },
    enabled: !!companyId,
    staleTime: 1000 * 60, // 1 minute
  })
}

/**
 * Hook to fetch company metrics
 */
export function useCompanyMetrics(companyId: string | undefined, params?: MetricsQueryParams) {
  return useQuery({
    queryKey: companyKeys.metrics(companyId!, params),
    queryFn: async () => {
      const response = await companyService.getCompanyMetrics(companyId!, params)
      if (!response.success) {
        throw new Error(response.error || 'Erro ao buscar métricas da empresa')
      }
      return response.data
    },
    enabled: !!companyId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

/**
 * Hook to fetch billing information
 */
export function useCompanyBilling(companyId: string | undefined) {
  return useQuery({
    queryKey: companyKeys.billing(companyId!),
    queryFn: async () => {
      const response = await companyService.getBillingInfo(companyId!)
      if (!response.success) {
        throw new Error(response.error || 'Erro ao buscar informações de cobrança')
      }
      return response.data
    },
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
