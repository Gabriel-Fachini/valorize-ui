/**
 * Audit Service
 * API integration for Audit Logs management
 * Connects to backend endpoints defined in audit-logs-summary.md
 */

import { api } from './api'
import type {
  ApiResponse,
  PaginatedApiResponse,
  AuditLog,
  AuditLogItem,
  AuditFilters,
  PaginationParams,
  SortingParams,
} from '@/types/audit'

// ==================== Query Methods ====================

/**
 * List all audit logs with filters, pagination, and sorting
 * GET /backoffice/audit-logs
 */
export async function listAuditLogs(
  filters?: AuditFilters,
  pagination?: PaginationParams,
  sorting?: SortingParams
): Promise<PaginatedApiResponse<AuditLogItem>> {
  const params = new URLSearchParams()

  // Pagination
  if (pagination) {
    params.append('page', pagination.page.toString())
    params.append('limit', pagination.limit.toString())
  }

  // Sorting
  if (sorting?.sortOrder) {
    params.append('sortOrder', sorting.sortOrder)
  }

  // Filters
  if (filters) {
    if (filters.search) params.append('search', filters.search)
    if (filters.action) params.append('action', filters.action)
    if (filters.entityType) params.append('entityType', filters.entityType)
    if (filters.userId) params.append('userId', filters.userId)
    if (filters.companyId) params.append('companyId', filters.companyId)
    if (filters.startDate) params.append('startDate', filters.startDate)
    if (filters.endDate) params.append('endDate', filters.endDate)
  }

  const response = await api.get<PaginatedApiResponse<AuditLogItem>>(
    `/backoffice/audit-logs?${params.toString()}`
  )
  return response.data
}

/**
 * Get audit logs for a specific company
 * GET /backoffice/audit-logs/companies/:companyId
 */
export async function getCompanyAuditLogs(
  companyId: string,
  filters?: Omit<AuditFilters, 'companyId'>,
  pagination?: PaginationParams,
  sorting?: SortingParams
): Promise<PaginatedApiResponse<AuditLogItem>> {
  const params = new URLSearchParams()

  // Pagination
  if (pagination) {
    params.append('page', pagination.page.toString())
    params.append('limit', pagination.limit.toString())
  }

  // Sorting
  if (sorting?.sortOrder) {
    params.append('sortOrder', sorting.sortOrder)
  }

  // Filters
  if (filters) {
    if (filters.search) params.append('search', filters.search)
    if (filters.action) params.append('action', filters.action)
    if (filters.entityType) params.append('entityType', filters.entityType)
    if (filters.userId) params.append('userId', filters.userId)
    if (filters.startDate) params.append('startDate', filters.startDate)
    if (filters.endDate) params.append('endDate', filters.endDate)
  }

  const response = await api.get<PaginatedApiResponse<AuditLogItem>>(
    `/backoffice/audit-logs/companies/${companyId}?${params.toString()}`
  )
  return response.data
}

/**
 * Get audit logs for a specific user
 * GET /backoffice/audit-logs/users/:userId
 */
export async function getUserAuditLogs(
  userId: string,
  filters?: Omit<AuditFilters, 'userId'>,
  pagination?: PaginationParams,
  sorting?: SortingParams
): Promise<PaginatedApiResponse<AuditLogItem>> {
  const params = new URLSearchParams()

  // Pagination
  if (pagination) {
    params.append('page', pagination.page.toString())
    params.append('limit', pagination.limit.toString())
  }

  // Sorting
  if (sorting?.sortOrder) {
    params.append('sortOrder', sorting.sortOrder)
  }

  // Filters
  if (filters) {
    if (filters.search) params.append('search', filters.search)
    if (filters.action) params.append('action', filters.action)
    if (filters.entityType) params.append('entityType', filters.entityType)
    if (filters.companyId) params.append('companyId', filters.companyId)
    if (filters.startDate) params.append('startDate', filters.startDate)
    if (filters.endDate) params.append('endDate', filters.endDate)
  }

  const response = await api.get<PaginatedApiResponse<AuditLogItem>>(
    `/backoffice/audit-logs/users/${userId}?${params.toString()}`
  )
  return response.data
}

// ==================== Query Keys Factory ====================

export const auditLogKeys = {
  all: ['auditLogs'] as const,
  lists: () => [...auditLogKeys.all, 'list'] as const,
  list: (filters?: AuditFilters, pagination?: PaginationParams, sorting?: SortingParams) =>
    [...auditLogKeys.lists(), { filters, pagination, sorting }] as const,
  companyLogs: (companyId: string) => [...auditLogKeys.all, 'company', companyId] as const,
  companyLogsList: (
    companyId: string,
    filters?: Omit<AuditFilters, 'companyId'>,
    pagination?: PaginationParams,
    sorting?: SortingParams
  ) => [...auditLogKeys.companyLogs(companyId), { filters, pagination, sorting }] as const,
  userLogs: (userId: string) => [...auditLogKeys.all, 'user', userId] as const,
  userLogsList: (
    userId: string,
    filters?: Omit<AuditFilters, 'userId'>,
    pagination?: PaginationParams,
    sorting?: SortingParams
  ) => [...auditLogKeys.userLogs(userId), { filters, pagination, sorting }] as const,
}
