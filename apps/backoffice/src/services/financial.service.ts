/**
 * Financial Management Service
 * API integration for Financial Management (Charges/Cobranças)
 * Connects to backend endpoints defined in financial-management-api.md
 */

import { api } from './api'
import type {
  ApiResponse,
  PaginatedChargesResponse,
  ChargeDetails,
  CreateChargeInput,
  UpdateChargeInput,
  RegisterPaymentInput,
  ChargesFilters,
  ChargesPagination,
  ChargesSorting,
  CreateChargeResponse,
  ActionResponse,
  Payment,
  ChargeAttachment,
} from '@/types/financial'

// ==================== Query Methods ====================

/**
 * List all charges with filters, pagination, sorting, and aggregations
 * GET /backoffice/financial/charges
 */
export async function listCharges(
  filters?: ChargesFilters,
  pagination?: ChargesPagination,
  sorting?: ChargesSorting
): Promise<PaginatedChargesResponse> {
  const params = new URLSearchParams()

  // Pagination
  if (pagination) {
    params.append('page', pagination.page.toString())
    params.append('pageSize', pagination.pageSize.toString())
  }

  // Sorting
  if (sorting) {
    if (sorting.sortBy) params.append('sortBy', sorting.sortBy)
    if (sorting.sortOrder) params.append('sortOrder', sorting.sortOrder)
  }

  // Filters
  if (filters) {
    if (filters.search) params.append('search', filters.search)

    if (filters.status) {
      if (Array.isArray(filters.status)) {
        filters.status.forEach(status => params.append('status', status))
      } else {
        params.append('status', filters.status)
      }
    }

    if (filters.companyId) params.append('companyId', filters.companyId)
    if (filters.issueDateFrom) params.append('issueDateFrom', filters.issueDateFrom)
    if (filters.issueDateTo) params.append('issueDateTo', filters.issueDateTo)
    if (filters.dueDateFrom) params.append('dueDateFrom', filters.dueDateFrom)
    if (filters.dueDateTo) params.append('dueDateTo', filters.dueDateTo)
  }

  const response = await api.get<PaginatedChargesResponse>(
    `/backoffice/financial/charges?${params.toString()}`
  )
  return response.data
}

/**
 * Get charge details by ID with balance calculations
 * GET /backoffice/financial/charges/:id
 */
export async function getChargeDetails(chargeId: string): Promise<ApiResponse<ChargeDetails>> {
  const response = await api.get<ApiResponse<ChargeDetails>>(
    `/backoffice/financial/charges/${chargeId}`
  )
  return response.data
}

// ==================== Mutation Methods ====================

/**
 * Create new charge
 * POST /backoffice/financial/charges
 */
export async function createCharge(
  input: CreateChargeInput
): Promise<ApiResponse<CreateChargeResponse>> {
  const response = await api.post<ApiResponse<CreateChargeResponse>>(
    '/backoffice/financial/charges',
    input
  )
  return response.data
}

/**
 * Update existing charge
 * PATCH /backoffice/financial/charges/:id
 * Note: Cannot update charges with status PAID or CANCELED
 */
export async function updateCharge(
  chargeId: string,
  input: UpdateChargeInput
): Promise<ApiResponse<ActionResponse>> {
  const response = await api.patch<ApiResponse<ActionResponse>>(
    `/backoffice/financial/charges/${chargeId}`,
    input
  )
  return response.data
}

/**
 * Delete charge
 * DELETE /backoffice/financial/charges/:id
 * Note: Can only delete charges with status PENDING or CANCELED and no payments
 */
export async function deleteCharge(chargeId: string): Promise<ApiResponse<ActionResponse>> {
  const response = await api.delete<ApiResponse<ActionResponse>>(
    `/backoffice/financial/charges/${chargeId}`
  )
  return response.data
}

/**
 * Cancel charge
 * POST /backoffice/financial/charges/:id/cancel
 * Note: Can only cancel charges with status PENDING or OVERDUE and no payments
 */
export async function cancelCharge(chargeId: string): Promise<ApiResponse<ActionResponse>> {
  const response = await api.post<ApiResponse<ActionResponse>>(
    `/backoffice/financial/charges/${chargeId}/cancel`
  )
  return response.data
}

// ==================== Payment Operations ====================

/**
 * Register payment for a charge
 * POST /backoffice/financial/charges/:id/payments
 * Note: Automatically updates charge status based on payment amount
 */
export async function registerPayment(
  chargeId: string,
  input: RegisterPaymentInput
): Promise<ApiResponse<Payment>> {
  const response = await api.post<ApiResponse<Payment>>(
    `/backoffice/financial/charges/${chargeId}/payments`,
    input
  )
  return response.data
}

// ==================== Attachment Operations ====================

/**
 * Upload attachment to charge
 * POST /backoffice/financial/charges/:id/attachments
 * Supported formats: PDF, JPG, PNG, WEBP (max 10MB)
 */
export async function uploadAttachment(
  chargeId: string,
  file: File
): Promise<ApiResponse<ChargeAttachment>> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post<ApiResponse<ChargeAttachment>>(
    `/backoffice/financial/charges/${chargeId}/attachments`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response.data
}

/**
 * Delete attachment from charge
 * DELETE /backoffice/financial/charges/:id/attachments/:attachmentId
 */
export async function deleteAttachment(
  chargeId: string,
  attachmentId: string
): Promise<ApiResponse<ActionResponse>> {
  const response = await api.delete<ApiResponse<ActionResponse>>(
    `/backoffice/financial/charges/${chargeId}/attachments/${attachmentId}`
  )
  return response.data
}
