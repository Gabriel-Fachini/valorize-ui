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
  BaseInputProps,
  EmailInputProps,
  PasswordInputProps,
  InputValidationState,
} from './forms'

export {
  loginFormSchema,
  emailSchema,
  passwordSchema,
  suggestEmailDomain,
  COMMON_EMAIL_DOMAINS,
} from './forms'
