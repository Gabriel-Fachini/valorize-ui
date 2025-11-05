import { z } from 'zod'

// ============================================================================
// Role Types
// ============================================================================

export interface Role {
  id: string
  name: string
  description?: string | null
  companyId?: string
  createdAt?: string
  updatedAt?: string
}

export interface RoleWithCounts extends Role {
  usersCount: number
  permissionsCount: number
}

export interface RoleDetail extends RoleWithCounts {
  permissions: Permission[]
  users: RoleUser[]
}

// ============================================================================
// Permission Types
// ============================================================================

export interface Permission {
  id: string
  name: string
  description?: string | null
  category: string
}

export interface PermissionWithInUse extends Permission {
  inUse: boolean
}

export interface PermissionCategory {
  category: string
  permissions: Permission[]
}

export interface PermissionInfo {
  name: string
  description?: string | null
  category: string
}

export interface PermissionInfoByCategory {
  category: string
  permissions: PermissionInfo[]
}

// ============================================================================
// User Role Types
// ============================================================================

export interface UserRole {
  id: string
  userId: string
  roleId: string
  createdAt: string
}

export interface UserRoleDetail extends UserRole {
  role: RoleWithCounts
}

export interface RoleUser {
  id: string
  name: string
  email: string
  avatar?: string
}

// ============================================================================
// Response Types
// ============================================================================

export interface RolesListResponse {
  success: true
  data: RoleWithCounts[]
  totalCount: number
  pageCount: number
  currentPage: number
  timestamp: string
}

export interface RoleDetailResponse {
  success: true
  data: RoleDetail
  timestamp: string
}

export interface PermissionsListResponse {
  success: true
  data: PermissionWithInUse[]
  timestamp: string
}

export interface PermissionCategoriesResponse {
  success: true
  data: PermissionCategory[]
  timestamp: string
}

export interface UserRolesResponse {
  success: true
  data: UserRoleDetail[]
  timestamp: string
}

export interface UserRolesAndPermissionsResponse {
  success: true
  data: {
    permissions: string[]
    roles: Role[]
  }
  timestamp: string
}

export interface RoleUsersResponse {
  success: true
  data: RoleUser[]
  pageCount: number
  currentPage: number
  totalCount: number
  timestamp: string
}

export interface BulkAssignRoleResponse {
  success: true
  data: {
    successCount: number
    failedCount: number
    totalAttempted: number
    summary: string
    failedAssignments?: Array<{
      userId: string
      reason: string
    }>
  }
  timestamp: string
}

export interface ApiResponse<T> {
  success: true
  data: T
  timestamp: string
}

export interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, string>
  }
  timestamp: string
}

// ============================================================================
// Form Data Types
// ============================================================================

export interface RoleFormData {
  name: string
  description?: string
  permissionNames?: string[]
}

export interface RoleUpdateData {
  name?: string
  description?: string
}

export interface RolePermissionsUpdateData {
  permissionNames: string[]
}

// ============================================================================
// Query Parameters
// ============================================================================

export interface RolesQueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface RolesFilters {
  search: string
  sortBy?: 'name' | 'createdAt' | 'usersCount' | 'permissionsCount'
  sortOrder?: 'asc' | 'desc'
}

// ============================================================================
// Zod Schemas
// ============================================================================

export const roleFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome não pode exceder 50 caracteres'),
  description: z
    .string()
    .max(200, 'Descrição não pode exceder 200 caracteres')
    .optional()
    .or(z.literal('')),
  permissionNames: z
    .array(z.string())
    .optional()
    .default([]),
})

export type RoleFormSchemaType = z.infer<typeof roleFormSchema>

export const rolePermissionsSchema = z.object({
  permissionNames: z.array(z.string()),
})

export type RolePermissionsSchemaType = z.infer<typeof rolePermissionsSchema>
