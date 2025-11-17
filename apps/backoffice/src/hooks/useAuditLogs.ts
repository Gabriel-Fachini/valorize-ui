/**
 * React Query Hooks for Audit Logs
 * Query hooks for fetching audit log data
 */

import { useQuery } from '@tanstack/react-query'
import type { AuditFilters, PaginationParams, SortingParams } from '@/types/audit'
import * as auditService from '@/services/audit.service'

// Re-export query keys from service
export { auditLogKeys } from '@/services/audit.service'

/**
 * Hook to fetch list of audit logs
 */
export function useAuditLogs(
  filters?: AuditFilters,
  pagination?: PaginationParams,
  sorting?: SortingParams
) {
  return useQuery({
    queryKey: auditService.auditLogKeys.list(filters, pagination, sorting),
    queryFn: async () => {
      const response = await auditService.listAuditLogs(filters, pagination, sorting)
      if (!response.success) {
        throw new Error('Erro ao buscar logs de auditoria')
      }
      return {
        data: response.data,
        pagination: response.pagination,
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to fetch audit logs for a specific company
 */
export function useCompanyAuditLogs(
  companyId: string | undefined,
  filters?: Omit<AuditFilters, 'companyId'>,
  pagination?: PaginationParams,
  sorting?: SortingParams
) {
  return useQuery({
    queryKey: auditService.auditLogKeys.companyLogsList(
      companyId!,
      filters,
      pagination,
      sorting
    ),
    queryFn: async () => {
      const response = await auditService.getCompanyAuditLogs(
        companyId!,
        filters,
        pagination,
        sorting
      )
      if (!response.success) {
        throw new Error('Erro ao buscar logs de auditoria da empresa')
      }
      return {
        data: response.data,
        pagination: response.pagination,
      }
    },
    enabled: !!companyId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to fetch audit logs for a specific user
 */
export function useUserAuditLogs(
  userId: string | undefined,
  filters?: Omit<AuditFilters, 'userId'>,
  pagination?: PaginationParams,
  sorting?: SortingParams
) {
  return useQuery({
    queryKey: auditService.auditLogKeys.userLogsList(userId!, filters, pagination, sorting),
    queryFn: async () => {
      const response = await auditService.getUserAuditLogs(userId!, filters, pagination, sorting)
      if (!response.success) {
        throw new Error('Erro ao buscar logs de auditoria do usuário')
      }
      return {
        data: response.data,
        pagination: response.pagination,
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}
