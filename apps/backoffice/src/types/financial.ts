/**
 * Financial Management Types
 * TypeScript definitions for the Financial Management module
 * Aligned with backend implementation (financial-management-api.md)
 */

// ==================== Enums ====================

export enum ChargeStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELED = 'CANCELED',
  PARTIAL = 'PARTIAL',
}

export enum PaymentMethod {
  BOLETO = 'BOLETO',
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
}

// ==================== Base Types ====================

export interface Payment {
  id: string
  chargeId: string
  amount: number
  paidAt: string
  paymentMethod: PaymentMethod
  notes?: string
  createdAt: string
  createdByUserId: string
  createdByUser: {
    id: string
    name: string
    email: string
  }
}

export interface ChargeAttachment {
  id: string
  chargeId: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  uploadedAt: string
  uploadedByUserId: string
  uploadedByUser: {
    id: string
    name: string
    email: string
  }
}

export interface ChargeListItem {
  id: string
  companyId: string
  amount: number
  description: string
  dueDate: string
  issueDate: string
  status: ChargeStatus
  paymentMethod?: PaymentMethod
  paidAt?: string
  canceledAt?: string
  notes?: string
  createdAt: string
  updatedAt: string
  createdByUserId: string
  company: {
    id: string
    name: string
    cnpj: string
  }
  createdByUser: {
    id: string
    name: string
    email: string
  }
  attachments: ChargeAttachment[]
  payments: Payment[]
}

export interface ChargeDetails extends ChargeListItem {
  balance: number
  totalPaid: number
  isPaid: boolean
}

// ==================== API Response Types ====================

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
  statusCode?: number
}

export interface ChargesAggregations {
  totalAmount: number
  pendingAmount: number
  paidAmount: number
  overdueAmount: number
  chargesByStatus: {
    status: ChargeStatus
    count: number
    totalAmount: number
  }[]
}

export interface PaginatedChargesResponse {
  success: boolean
  data: ChargeListItem[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
  aggregations: ChargesAggregations
  message?: string
  error?: string
  statusCode?: number
}

export interface ActionResponse {
  success: boolean
  message: string
}

export interface CreateChargeResponse {
  id: string
  message: string
}

// ==================== API Input Types ====================

export interface CreateChargeInput {
  companyId: string
  amount: number
  description: string
  dueDate: string
  issueDate?: string
  paymentMethod?: PaymentMethod
  notes?: string
}

export interface UpdateChargeInput {
  amount?: number
  description?: string
  dueDate?: string
  issueDate?: string
  paymentMethod?: PaymentMethod
  notes?: string
}

export interface RegisterPaymentInput {
  amount: number
  paidAt: string
  paymentMethod: PaymentMethod
  notes?: string
}

export interface UploadAttachmentInput {
  file: File
}

// ==================== Filter Types ====================

export interface ChargesFilters {
  search?: string
  status?: ChargeStatus | ChargeStatus[]
  companyId?: string
  issueDateFrom?: string
  issueDateTo?: string
  dueDateFrom?: string
  dueDateTo?: string
}

export interface ChargesPagination {
  page: number
  pageSize: number
}

export interface ChargesSorting {
  sortBy?: 'issueDate' | 'dueDate' | 'amount' | 'status'
  sortOrder?: 'asc' | 'desc'
}

// ==================== Form Types ====================

export interface CreateChargeFormData {
  companyId: string
  amount: string // String for form input, will be converted to number
  description: string
  dueDate: string
  issueDate: string
  paymentMethod?: PaymentMethod
  notes?: string
}

export interface EditChargeFormData {
  amount: string
  description: string
  dueDate: string
  issueDate: string
  paymentMethod?: PaymentMethod
  notes?: string
}

export interface RegisterPaymentFormData {
  amount: string
  paidAt: string
  paymentMethod: PaymentMethod
  notes?: string
}
