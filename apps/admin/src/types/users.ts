import { z } from 'zod'

// ============================================================================
// User Types
// ============================================================================

export interface Department {
  id: string
  name: string
}

export interface Position {
  id: string
  name: string
}

export interface UserStatistics {
  complimentsSent: number
  complimentsReceived: number
  totalCoins: number
  redeemptions: number
}

export interface User {
  id: string
  name: string
  email: string
  department?: Department
  position?: Position
  avatar?: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
  lastLogin?: string
  statistics?: UserStatistics
  welcomeEmailSentAt?: string | null
  lastWelcomeEmailSentAt?: string | null
  welcomeEmailSendCount: number
}

export interface CreateUserResponse extends User {
  temporaryPasswordUrl?: string
}

export interface PasswordResetResponse {
  message: string
  ticketUrl: string
  expiresIn: string
}

export interface AllowedDomain {
  id: string
  domain: string
}

export interface UsersListResponse {
  data: User[]
  totalCount: number
  pageCount: number
  currentPage: number
}

// ============================================================================
// Query Params Types
// ============================================================================

export interface UsersQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: 'active' | 'inactive'
  departmentId?: string
  jobTitleId?: string
  sortBy?: 'name' | 'email' | 'createdAt' | 'lastLogin'
  sortOrder?: 'asc' | 'desc'
}

// ============================================================================
// Form Schemas
// ============================================================================

export const userFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.string().email('Email inválido'),
  departmentId: z.string().optional(),
  jobTitleId: z.string().optional(),
  isActive: z.boolean().optional(),
  sendEmail: z.boolean().optional(),
})

export type UserFormData = z.infer<typeof userFormSchema>

export const userUpdateSchema = userFormSchema.partial()

export type UserUpdateData = z.infer<typeof userUpdateSchema>

// ============================================================================
// Bulk Actions Types
// ============================================================================

export type BulkAction = 'activate' | 'deactivate' | 'export'

export interface BulkActionsPayload {
  userIds: string[]
  action: BulkAction
}

export interface BulkActionsResponse {
  updated: number
}

// ============================================================================
// CSV Import Types
// ============================================================================

export type CSVRowStatus = 'valid' | 'error' | 'duplicate' | 'exists'
export type CSVRowAction = 'create' | 'update' | 'skip'

export interface CSVPreviewRow {
  rowNumber: number
  name: string
  email: string
  department: string
  position: string
  status: CSVRowStatus
  errors: string[]
  action: CSVRowAction
}

export interface CSVPreviewSummary {
  toCreate: number
  toUpdate: number
  errors: number
}

export interface CSVPreviewResponse {
  previewId: string
  totalRows: number
  validRows: number
  rowsWithErrors: number
  preview: CSVPreviewRow[]
  summary: CSVPreviewSummary
  expiresAt: string
}

export interface CSVImportPayload {
  previewId: string
  confirmedRows?: number[]
  sendEmails?: boolean
}

export interface CSVImportError {
  rowNumber: number
  email: string
  reason: string
}

export interface CSVImportReport {
  created: number
  updated: number
  skipped: number
  errors: CSVImportError[]
  emailsSent?: number
}

export interface CSVImportResponse {
  status: 'completed'
  report: CSVImportReport
}

// ============================================================================
// Welcome Email Types
// ============================================================================

export interface SendWelcomeEmailResponse {
  message: string
}

export interface BulkSendEmailResult {
  userId: string
  success: boolean
  error?: string
}

export interface BulkSendWelcomeEmailsPayload {
  userIds: string[]
  requestedBy: string
}

export interface BulkSendWelcomeEmailsResponse {
  message: string
  results: BulkSendEmailResult[]
  summary: {
    total: number
    sent: number
    failed: number
  }
}

// ============================================================================
// Filter State Type (for table toolbar)
// ============================================================================

export interface UserFilters extends Record<string, unknown> {
  search: string
  status: 'all' | 'active' | 'inactive'
  departmentId: string
  jobTitleId: string
}
