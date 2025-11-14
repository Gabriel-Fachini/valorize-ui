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

// Redemption Types
export type {
  Redemption,
  RedemptionFilters,
  VoucherRedemption,
  TrackingInfo,
  TrackingHistoryItem,
  AdminNote,
  UpdateStatusPayload,
  AddTrackingPayload,
  AddNotePayload,
  CancelRedemptionPayload,
  PaginationInfo,
  RedemptionsListResponse,
  RedemptionDetailResponse,
  StatusUpdateResponse,
  TrackingUpdateResponse,
  AddNoteResponse,
  CancelRedemptionResponse,
} from './redemptions'

export { RedemptionStatus, RedemptionType } from './redemptions'

// Compliments Types
export type {
  CompanyValue,
  Department,
  ComplimentsDashboardFilters,
  PeriodInfo,
  ComparisonMetrics,
  ComplimentsOverview,
  ValueDistributionItem,
  TopSenderUser,
  TopReceiverUser,
  BalancedUser,
  TopUsers,
  DepartmentAnalyticsItem,
  CrossDepartmentFlowItem,
  DepartmentAnalytics,
  WeeklyTrendPoint,
  DayOfWeekDistribution,
  HourlyDistribution,
  MonthlyGrowth,
  TemporalPatterns,
  RecentActivityItem,
  InsightItem,
  EngagementMetrics,
  DashboardMetadata,
  ComplimentsDashboardResponse,
  NetworkNode,
  NetworkLink,
  NetworkGraphData,
  NetworkFilters,
  ExportDashboardPayload,
} from './compliments'

export { ExportFormat } from './compliments'

// Common Types
export interface ProviderProps {
  children: React.ReactNode
}
