/**
 * Redemption Types
 * Types for managing user redemptions (prize claims) in admin
 */

import type { Prize } from './prizes'
import type { User } from './users'

/**
 * Redemption status progression
 */
export enum RedemptionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  SENT = 'sent',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
}

/**
 * Type of prize being redeemed
 */
export enum RedemptionType {
  VOUCHER = 'voucher',
  PHYSICAL = 'physical',
}

/**
 * Tracking information for physical deliveries
 */
export interface TrackingInfo {
  code: string
  carrier?: string
  url?: string
  updatedAt: string
}

/**
 * Tracking history item in redemption audit trail
 */
export interface TrackingHistoryItem {
  id: string
  status: string // 'sent', 'admin_note', etc
  notes: string
  createdBy: string
  createdAt: string
}

/**
 * Admin note in redemption history
 */
export interface AdminNote {
  id: string
  text: string
  createdBy: string
  createdAt: string
}

/**
 * Complete redemption record
 */
export interface Redemption {
  id: string
  userId: string
  userName?: string
  userEmail?: string
  userAvatar?: string
  user?: User | null
  prizeId: string
  prizeName?: string
  prizeType?: string
  prizeImage?: string
  prize?: Prize | null
  variantId?: string | null
  variant?: unknown | null
  addressId?: string | null
  status: RedemptionStatus | string
  type?: RedemptionType | string
  coinsSpent: number
  trackingCode?: string | null
  trackingCarrier?: string | null
  voucherRedemption?: VoucherRedemption | null
  notes?: AdminNote[]
  tracking?: TrackingHistoryItem[] // Audit trail with all tracking updates and admin notes
  redeemedAt?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Voucher-specific redemption data
 */
export interface VoucherRedemption {
  id?: string
  redemptionId?: string
  provider?: string // e.g., 'tremendous'
  voucherLink?: string | null
  voucherCode?: string | null
  expiresAt?: string | null
  redeemedAt?: string | null
  status?: string // e.g., 'completed', 'pending'
  completedAt?: string | null
}

/**
 * Filter parameters for redemptions list
 */
export interface RedemptionFilters {
  status?: RedemptionStatus | string
  type?: RedemptionType | string
  userId?: string
  prizeId?: string
  search?: string
  dateFrom?: string
  dateTo?: string
  orderBy?: 'createdAt' | 'updatedAt'
  order?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

/**
 * Payload for updating redemption status
 */
export interface UpdateStatusPayload {
  status: RedemptionStatus | string
  notes?: string
}

/**
 * Payload for adding tracking information
 */
export interface AddTrackingPayload {
  trackingCode: string
  carrier?: string
  notes?: string
}

/**
 * Payload for adding admin note
 */
export interface AddNotePayload {
  note: string
}

/**
 * Payload for cancelling a redemption
 */
export interface CancelRedemptionPayload {
  reason?: string
}

/**
 * Pagination info in list response
 */
export interface PaginationInfo {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

/**
 * Response for list of redemptions
 */
export interface RedemptionsListResponse {
  data: Redemption[]
  pagination: PaginationInfo
}

/**
 * Response for single redemption details
 * The API returns the redemption object directly, not wrapped in a response envelope
 */
export type RedemptionDetailResponse = Redemption

/**
 * Response for status update
 */
export interface StatusUpdateResponse {
  success: boolean
  message: string
  redemption: Redemption
}

/**
 * Response for tracking update
 */
export interface TrackingUpdateResponse {
  success: boolean
  message: string
  trackingCode: string
  trackingCarrier?: string
}

/**
 * Response for adding note
 */
export interface AddNoteResponse {
  success: boolean
  message: string
  note: AdminNote
}

/**
 * Response for cancellation
 */
export interface CancelRedemptionResponse {
  success: boolean
  message: string
  refundedCoins: number
  refundedBudget: number
}

/**
 * Period information for metrics
 */
export interface MetricsPeriod {
  startDate: string
  endDate: string
}

/**
 * Volume metrics for redemptions
 */
export interface VolumeMetrics {
  totalRedemptions: number
  totalCoinsSpent: number
  totalValueBRL: number
  avgCoinsPerRedemption: number
  periodComparison: {
    redemptionsChange: string
    valueChange: string
  }
}

/**
 * Status breakdown item
 */
export interface StatusBreakdownItem {
  status: string
  count: number
  percentage: number
}

/**
 * Type breakdown with status distribution
 */
export interface TypeBreakdownItem {
  type: RedemptionType | string
  count: number
  percentage: number
  totalValueBRL: number
  statusBreakdown: Record<string, number>
}

/**
 * Top redeemed prize item
 */
export interface TopPrizeItem {
  prizeId: string
  prizeName: string
  prizeType: RedemptionType | string
  redemptionCount: number
  totalCoinsSpent: number
  totalValueBRL: number
}

/**
 * User engagement metrics
 */
export interface UserEngagementMetrics {
  uniqueRedeemers: number
  totalActiveUsers: number
  percentageOfActive: number
  repeatRedeemers: number
  repeatRate: number
  avgRedemptionsPerUser: number
}

/**
 * Financial impact metrics
 */
export interface FinancialImpactMetrics {
  totalCost: number
  voucherCost: number
  physicalCost: number
  avgCostPerRedemption: number
  projectedMonthlyCost: number
}

/**
 * Complete redemption metrics response
 */
export interface RedemptionMetrics {
  period: MetricsPeriod
  volume: VolumeMetrics
  statusBreakdown: StatusBreakdownItem[]
  typeBreakdown: TypeBreakdownItem[]
  topPrizes: TopPrizeItem[]
  userEngagement: UserEngagementMetrics
  financialImpact: FinancialImpactMetrics
}
