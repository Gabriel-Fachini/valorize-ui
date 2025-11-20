/**
 * Company Types
 * TypeScript definitions for the Companies/Clients module
 * Aligned with backend implementation (companies-implementation-summary.md)
 */

// ==================== Enums ====================

export enum PlanType {
  ESSENTIAL = 'ESSENTIAL',
  PROFESSIONAL = 'PROFESSIONAL',
}

export enum CompanyStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// ==================== Base Types ====================

export interface Company {
  id: string
  name: string
  domain: string
  logoUrl?: string
  country: string
  timezone: string
  billingEmail?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CompanyBrazil {
  id: string
  companyId: string
  cnpj: string
  razaoSocial: string
  inscricaoEstadual?: string
  cnaePrincipal?: string
  naturezaJuridica?: string
  porteEmpresa?: string
  situacaoCadastral?: string
  createdAt: string
  updatedAt: string
}

export interface CompanyPlan {
  id: string
  companyId: string
  planType: PlanType
  pricePerUser: number
  startDate: string
  endDate?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CompanyValue {
  id: string
  companyId: string
  title: string
  description?: string
  iconName?: string
  iconColor?: string
  isActive: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export interface CompanyContact {
  id: string
  companyId: string
  userId: string
  role?: string
  isPrimary: boolean
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    name: string
    email: string
    avatar?: string
  }
}

export interface AllowedDomain {
  id: string
  companyId: string
  domain: string
  createdAt: string
}

// ==================== Wallet Types ====================

export interface CompanyWallet {
  id: string
  companyId: string
  balance: number
  totalDeposited: number
  totalSpent: number
  overdraftLimit: number
  isFrozen: boolean
  createdAt: string
  updatedAt: string
}

export interface CompanyWalletStatus extends CompanyWallet {
  burnRate: number // Monthly burn rate
  coverageIndex: number // Months of coverage
  projectedDepletion?: string // ISO date
  totalRedemptions: {
    vouchers: number
    products: number
  }
}

export interface WalletDeposit {
  id: string
  walletId: string
  amount: number
  reason?: string
  depositedBy: string
  createdAt: string
}

// ==================== Metrics Types ====================

export interface CompanyMetrics {
  users: {
    total: number
    active: number
    inactive: number
  }
  compliments: {
    sent: number
    received: number
    period?: {
      startDate: string
      endDate: string
      sent: number
      received: number
    }
  }
  engagement: {
    WAU: number // Weekly Active Users
    complimentUsageRate: number // Percentage
  }
  redemptions: {
    total: number
    vouchers: number
    products: number
    averageTicket: number
  }
  values: {
    total: number
    active: number
  }
}

export interface BillingInfo {
  currentMRR: number
  activeUsers: number
  planType: PlanType
  pricePerUser: number
  estimatedMonthlyAmount: number
  nextBillingDate?: string
  billingEmail?: string
}

// ==================== List & Detail Types ====================

export interface CompanyListItem {
  id: string
  name: string
  domain: string
  logoUrl?: string
  country: string
  planType: PlanType | null
  isActive: boolean
  totalUsers: number
  activeUsers: number
  currentMRR: number
  createdAt: string
  updatedAt: string
}

export interface CompanyDetails extends Company {
  companyBrazil?: CompanyBrazil
  currentPlan?: CompanyPlan
  wallet?: CompanyWallet
  contacts?: CompanyContact[]
  allowedDomains?: AllowedDomain[]
  values?: CompanyValue[]
  settings?: {
    id: string
    companyId: string
    [key: string]: any
  }
}

// ==================== Query Types ====================

export interface PaginationParams {
  page: number
  limit: number
}

export interface SortingParams {
  sortBy: 'name' | 'createdAt' | 'updatedAt' | 'mrr'
  sortOrder: 'asc' | 'desc'
}

export interface CompanyFilters {
  search?: string
  status?: CompanyStatus
  planType?: PlanType
  country?: string
  createdAfter?: string
  createdBefore?: string
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  aggregations?: {
    totalMRR: number
    activeCompanies: number
    inactiveCompanies: number
  }
}

export interface MetricsQueryParams {
  startDate?: string
  endDate?: string
}

// ==================== Input Types ====================

export interface FirstAdmin {
  name: string
  email: string
}

export interface CreateCompanyInput {
  name: string
  domain: string
  country: string
  timezone: string
  logoUrl?: string
  billingEmail?: string
  firstAdmin: FirstAdmin
  companyBrazil?: {
    cnpj: string
    razaoSocial: string
    inscricaoEstadual?: string
    cnaePrincipal?: string
    naturezaJuridica?: string
    porteEmpresa?: string
    situacaoCadastral?: string
  }
  plan: {
    planType: PlanType
    pricePerUser: number
    startDate: string
  }
  initialValues: Array<{
    title: string
    description?: string
    iconName?: string
    iconColor?: string
  }>
  initialWalletBudget?: number
}

export interface UpdateCompanyInput {
  name?: string
  domain?: string
  logoUrl?: string
  country?: string
  timezone?: string
  billingEmail?: string
  companyBrazil?: {
    cnpj?: string
    razaoSocial?: string
    inscricaoEstadual?: string
    cnaePrincipal?: string
    naturezaJuridica?: string
    porteEmpresa?: string
    situacaoCadastral?: string
  }
}

export interface AddWalletCreditsInput {
  amount: number
  reason?: string
}

export interface RemoveWalletCreditsInput {
  amount: number
  reason: string
}

export interface UpdateCompanyPlanInput {
  planType: PlanType
  pricePerUser: number
  startDate: string
}

export interface AddCompanyContactInput {
  userId: string
  role?: string
}

export interface UpdateCompanyContactInput {
  role?: string
  isPrimary?: boolean
}

export interface AddAllowedDomainInput {
  domain: string
}

// ==================== API Response Types ====================

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
  statusCode?: number
}

export interface PaginatedApiResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  aggregations?: {
    totalMRR: number
    activeCompanies: number
    inactiveCompanies: number
  }
  message?: string
  error?: string
  statusCode?: number
}

export interface ActionResponse {
  success: boolean
  message: string
}

export interface CreatedAdmin {
  id: string
  name: string
  email: string
  auth0Id: string
  roles: string[]
}

// Response from create company endpoint
export interface CreateResponseNew {
  company: Company
  firstAdmin: CreatedAdmin
  passwordResetUrl: string
}

// Legacy - kept for backwards compatibility (deprecated)
export interface CreateResponseOld {
  id: string
  name?: string
  message?: string
}

// Current response type
export type CreateResponse = CreateResponseNew

export interface WalletActionResponse extends ActionResponse {
  newBalance?: number
}
