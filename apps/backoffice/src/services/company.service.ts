/**
 * Company Service
 * API integration for Companies/Clients management
 * Connects to backend endpoints defined in companies-implementation-summary.md
 */

import { api } from './api'
import type {
  ApiResponse,
  PaginatedApiResponse,
  PaginatedResult,
  CompanyListItem,
  CompanyDetails,
  CompanyWalletStatus,
  CompanyMetrics,
  BillingInfo,
  CreateCompanyInput,
  UpdateCompanyInput,
  AddWalletCreditsInput,
  RemoveWalletCreditsInput,
  UpdateCompanyPlanInput,
  AddCompanyContactInput,
  UpdateCompanyContactInput,
  AddAllowedDomainInput,
  ActionResponse,
  CreateResponse,
  WalletActionResponse,
  PaginationParams,
  SortingParams,
  CompanyFilters,
  MetricsQueryParams,
} from '@/types/company'

// ==================== Query Methods ====================

/**
 * List all companies with filters, pagination, and sorting
 * GET /backoffice/companies
 */
export async function listCompanies(
  filters?: CompanyFilters,
  pagination?: PaginationParams,
  sorting?: SortingParams
): Promise<PaginatedApiResponse<CompanyListItem>> {
  const params = new URLSearchParams()

  // Pagination
  if (pagination) {
    params.append('page', pagination.page.toString())
    params.append('limit', pagination.limit.toString())
  }

  // Sorting
  if (sorting) {
    params.append('sortBy', sorting.sortBy)
    params.append('sortOrder', sorting.sortOrder)
  }

  // Filters
  if (filters) {
    if (filters.search) params.append('search', filters.search)
    if (filters.status) params.append('status', filters.status.toLowerCase())
    if (filters.planType) params.append('planType', filters.planType)
    if (filters.country) params.append('country', filters.country)
    if (filters.createdAfter) params.append('createdAfter', filters.createdAfter)
    if (filters.createdBefore) params.append('createdBefore', filters.createdBefore)
  }

  const response = await api.get<PaginatedApiResponse<CompanyListItem>>(
    `/backoffice/companies?${params.toString()}`
  )
  return response.data
}

/**
 * Get company details by ID
 * GET /backoffice/companies/:id
 */
export async function getCompanyDetails(companyId: string): Promise<ApiResponse<CompanyDetails>> {
  const response = await api.get<ApiResponse<CompanyDetails>>(`/backoffice/companies/${companyId}`)
  return response.data
}

/**
 * Get wallet status with metrics
 * GET /backoffice/companies/:id/wallet
 */
export async function getWalletStatus(
  companyId: string
): Promise<ApiResponse<CompanyWalletStatus>> {
  const response = await api.get<ApiResponse<CompanyWalletStatus>>(
    `/backoffice/companies/${companyId}/wallet`
  )
  return response.data
}

/**
 * Get company metrics
 * GET /backoffice/companies/:id/metrics
 */
export async function getCompanyMetrics(
  companyId: string,
  params?: MetricsQueryParams
): Promise<ApiResponse<CompanyMetrics>> {
  const queryParams = new URLSearchParams()

  if (params) {
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)
  }

  const queryString = queryParams.toString()
  const url = `/backoffice/companies/${companyId}/metrics${queryString ? `?${queryString}` : ''}`

  const response = await api.get<ApiResponse<CompanyMetrics>>(url)
  return response.data
}

/**
 * Get billing information
 * GET /backoffice/companies/:id/billing
 */
export async function getBillingInfo(companyId: string): Promise<ApiResponse<BillingInfo>> {
  const response = await api.get<ApiResponse<BillingInfo>>(
    `/backoffice/companies/${companyId}/billing`
  )
  return response.data
}

// ==================== Mutation Methods ====================

/**
 * Create new company
 * POST /backoffice/companies
 */
export async function createCompany(
  input: CreateCompanyInput
): Promise<ApiResponse<CreateResponse>> {
  const response = await api.post<ApiResponse<CreateResponse>>('/backoffice/companies', input)
  return response.data
}

/**
 * Update company information
 * PATCH /backoffice/companies/:id
 */
export async function updateCompany(
  companyId: string,
  input: UpdateCompanyInput
): Promise<ApiResponse<ActionResponse>> {
  const response = await api.patch<ApiResponse<ActionResponse>>(
    `/backoffice/companies/${companyId}`,
    input
  )
  return response.data
}

/**
 * Activate company
 * POST /backoffice/companies/:id/activate
 */
export async function activateCompany(
  companyId: string
): Promise<ApiResponse<ActionResponse>> {
  const response = await api.post<ApiResponse<ActionResponse>>(
    `/backoffice/companies/${companyId}/activate`
  )
  return response.data
}

/**
 * Deactivate company (blocks login + freezes wallet)
 * POST /backoffice/companies/:id/deactivate
 */
export async function deactivateCompany(
  companyId: string
): Promise<ApiResponse<ActionResponse>> {
  const response = await api.post<ApiResponse<ActionResponse>>(
    `/backoffice/companies/${companyId}/deactivate`
  )
  return response.data
}

// ==================== Wallet Operations ====================

/**
 * Add wallet credits
 * POST /backoffice/companies/:id/wallet/credits
 */
export async function addWalletCredits(
  companyId: string,
  input: AddWalletCreditsInput
): Promise<ApiResponse<WalletActionResponse>> {
  const response = await api.post<ApiResponse<WalletActionResponse>>(
    `/backoffice/companies/${companyId}/wallet/credits`,
    input
  )
  return response.data
}

/**
 * Remove wallet credits
 * DELETE /backoffice/companies/:id/wallet/credits
 */
export async function removeWalletCredits(
  companyId: string,
  input: RemoveWalletCreditsInput
): Promise<ApiResponse<WalletActionResponse>> {
  const response = await api.delete<ApiResponse<WalletActionResponse>>(
    `/backoffice/companies/${companyId}/wallet/credits`,
    { data: input }
  )
  return response.data
}

/**
 * Freeze wallet (blocks spending)
 * POST /backoffice/companies/:id/wallet/freeze
 */
export async function freezeWallet(companyId: string): Promise<ApiResponse<ActionResponse>> {
  const response = await api.post<ApiResponse<ActionResponse>>(
    `/backoffice/companies/${companyId}/wallet/freeze`
  )
  return response.data
}

/**
 * Unfreeze wallet (restores spending)
 * POST /backoffice/companies/:id/wallet/unfreeze
 */
export async function unfreezeWallet(companyId: string): Promise<ApiResponse<ActionResponse>> {
  const response = await api.post<ApiResponse<ActionResponse>>(
    `/backoffice/companies/${companyId}/wallet/unfreeze`
  )
  return response.data
}

// ==================== Plan Management ====================

/**
 * Update company plan
 * PATCH /backoffice/companies/:id/plan
 */
export async function updateCompanyPlan(
  companyId: string,
  input: UpdateCompanyPlanInput
): Promise<ApiResponse<ActionResponse>> {
  const response = await api.patch<ApiResponse<ActionResponse>>(
    `/backoffice/companies/${companyId}/plan`,
    input
  )
  return response.data
}

// ==================== Contact Management ====================

/**
 * Add contact to company (existing user only)
 * POST /backoffice/companies/:id/contacts
 */
export async function addContact(
  companyId: string,
  input: AddCompanyContactInput
): Promise<ApiResponse<CreateResponse>> {
  const response = await api.post<ApiResponse<CreateResponse>>(
    `/backoffice/companies/${companyId}/contacts`,
    input
  )
  return response.data
}

/**
 * Update contact
 * PATCH /backoffice/companies/:id/contacts/:contactId
 */
export async function updateContact(
  companyId: string,
  contactId: string,
  input: UpdateCompanyContactInput
): Promise<ApiResponse<ActionResponse>> {
  const response = await api.patch<ApiResponse<ActionResponse>>(
    `/backoffice/companies/${companyId}/contacts/${contactId}`,
    input
  )
  return response.data
}

/**
 * Delete contact
 * DELETE /backoffice/companies/:id/contacts/:contactId
 */
export async function deleteContact(
  companyId: string,
  contactId: string
): Promise<ApiResponse<ActionResponse>> {
  const response = await api.delete<ApiResponse<ActionResponse>>(
    `/backoffice/companies/${companyId}/contacts/${contactId}`
  )
  return response.data
}

// ==================== SSO Domain Management ====================

/**
 * Add allowed domain for SSO
 * POST /backoffice/companies/:id/domains
 */
export async function addAllowedDomain(
  companyId: string,
  input: AddAllowedDomainInput
): Promise<ApiResponse<CreateResponse>> {
  const response = await api.post<ApiResponse<CreateResponse>>(
    `/backoffice/companies/${companyId}/domains`,
    input
  )
  return response.data
}

/**
 * Delete allowed domain
 * DELETE /backoffice/companies/:id/domains/:domainId
 */
export async function deleteAllowedDomain(
  companyId: string,
  domainId: string
): Promise<ApiResponse<ActionResponse>> {
  const response = await api.delete<ApiResponse<ActionResponse>>(
    `/backoffice/companies/${companyId}/domains/${domainId}`
  )
  return response.data
}
