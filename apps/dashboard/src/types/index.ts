/**
 * Types Index
 * Central export point for all application types
 */

// API Types
export type { ApiSuccess, ApiError, ApiResponse } from './api'

// Authentication Types
export type {
  User,
  UserInfo,
  LoginData,
  RefreshData,
  VerifyMinimalData,
  VerifyFullData,
  AuthContextType,
} from './auth'

// Theme Types
export type { Theme, ThemeContextType } from './theme'

// Common Types
export type { BaseProps, ProviderProps, FormField, LoadingState } from './common'

// Form Types
export type {
  LoginFormData,
  RegisterFormData,
  BaseInputProps,
  EmailInputProps,
  PasswordInputProps,
  InputValidationState,
} from './forms'

export {
  loginFormSchema,
  registerFormSchema,
  emailSchema,
  passwordSchema,
} from './forms'

// Compliments Types
export type {
  ComplimentUser,
  ComplimentUserWithDepartment,
  CompanyValue,
  Compliment,
  SendComplimentData,
  SendComplimentResponse,
  ListReceivableUsersResponse,
  UserBalance,
  ComplimentsHistoryResponse,
  PraiseUser,
  PraiseValue,
  PraiseData,
} from './compliments'

// Transaction Types
export type {
  Transaction,
  TransactionType,
  BalanceType,
  ActivityFilter,
  DirectionFilter,
  TimePeriodFilter,
  TransactionFilters,
  TransactionUIFilters,
  TransactionPagination,
  TransactionsResponse,
  TransactionQueryParams,
  TransactionCardProps,
  TransactionFiltersProps,
  TransactionFeedProps,
  UseTransactionsReturn,
  TransactionDisplayInfo,
  TransactionGroup,
} from './transaction.types'
