// Audit Log Types

/**
 * Tipos de ações auditadas no sistema
 */
export enum AuditAction {
  // General CRUD
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',

  // Company lifecycle
  ACTIVATE = 'ACTIVATE',
  DEACTIVATE = 'DEACTIVATE',

  // Wallet operations
  WALLET_CREDIT = 'WALLET_CREDIT',
  WALLET_DEBIT = 'WALLET_DEBIT',
  WALLET_FREEZE = 'WALLET_FREEZE',
  WALLET_UNFREEZE = 'WALLET_UNFREEZE',

  // Contact management
  CONTACT_ADD = 'CONTACT_ADD',
  CONTACT_UPDATE = 'CONTACT_UPDATE',
  CONTACT_DELETE = 'CONTACT_DELETE',

  // Domain management
  DOMAIN_ADD = 'DOMAIN_ADD',
  DOMAIN_DELETE = 'DOMAIN_DELETE',

  // Plan management
  PLAN_CHANGE = 'PLAN_CHANGE',
}

/**
 * Tipos de entidades auditadas
 */
export enum AuditEntityType {
  COMPANY = 'Company',
  USER = 'User',
  WALLET = 'Wallet',
  COMPANY_WALLET = 'CompanyWallet',
  COMPANY_CONTACT = 'CompanyContact',
  COMPANY_PLAN = 'CompanyPlan',
  ALLOWED_DOMAIN = 'AllowedDomain',
}

/**
 * Informações do usuário que executou a ação
 */
export interface AuditUser {
  id: string
  name: string
  email: string
}

/**
 * Metadata adicional do log
 */
export interface AuditMetadata {
  ip?: string
  userAgent?: string
  [key: string]: unknown
}

/**
 * Mudanças realizadas em uma ação
 */
export interface AuditChanges {
  [field: string]: {
    before: unknown
    after: unknown
  }
}

/**
 * Log de auditoria completo
 */
export interface AuditLog {
  id: string
  userId: string
  user: AuditUser
  action: AuditAction
  entityType: AuditEntityType
  entityId: string
  changes?: AuditChanges
  metadata?: AuditMetadata
  createdAt: string
  companyId?: string
}

/**
 * Filtros para listagem de logs de auditoria
 */
export interface AuditFilters {
  search?: string
  action?: AuditAction
  entityType?: AuditEntityType
  userId?: string
  companyId?: string
  startDate?: string // ISO 8601
  endDate?: string // ISO 8601
}

/**
 * Item de log de auditoria para listagem (otimizado)
 */
export interface AuditLogItem extends AuditLog {
  // Adicionar campos computados se necessário
}

/**
 * Parâmetros de paginação
 */
export interface PaginationParams {
  page: number
  limit: number
}

/**
 * Parâmetros de ordenação
 */
export interface SortingParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Informações de paginação na resposta
 */
export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

/**
 * Resposta paginada da API
 */
export interface PaginatedApiResponse<T> {
  success: boolean
  data: T[]
  pagination: PaginationInfo
}

/**
 * Resposta padrão da API
 */
export interface ApiResponse<T> {
  success: boolean
  data: T
}
