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
} from './forms'

// Economy Types
export type {
  EconomyStatus,
  DepositStatus,
  AlertPriority,
  WalletBalance,
  PrizeFund,
  RedeemableCoins,
  ComplimentEngagement,
  RedemptionRate,
  EconomyAlert,
  Deposit,
  DepositHistory,
  SuggestedDeposit,
  EconomyDashboardData,
} from './economy'

// Common Types
export interface ProviderProps {
  children: React.ReactNode
}
