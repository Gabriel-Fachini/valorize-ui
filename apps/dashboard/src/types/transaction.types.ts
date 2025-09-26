/**
 * Transaction Types
 * Types for the wallet transactions system
 */

import type { UserBalance } from './compliments'

// Core transaction types based on API documentation
export type TransactionType = 'DEBIT' | 'CREDIT' | 'RESET'
export type BalanceType = 'COMPLIMENT' | 'REDEEMABLE'

// Main transaction interface based on /wallets/transactions endpoint
export interface Transaction {
  id: string
  transactionType: TransactionType
  balanceType: BalanceType
  amount: number
  previousBalance: number
  newBalance: number
  reason: string
  metadata: Record<string, unknown> | null
  createdAt: string
}

// Filter interface for transaction queries
export interface TransactionFilters {
  balanceType?: BalanceType
  transactionType?: TransactionType
  fromDate?: string // ISO date string
  toDate?: string   // ISO date string
}

// Pagination information
export interface TransactionPagination {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

// API response structure for transactions
export interface TransactionsResponse {
  transactions: Transaction[]
  pagination: TransactionPagination
}

// Query parameters for the API call
export interface TransactionQueryParams {
  limit?: number    // 1-100, default: 50
  offset?: number   // minimum 0, default: 0
  balanceType?: BalanceType
  transactionType?: TransactionType
  fromDate?: string // ISO date string
  toDate?: string   // ISO date string
}

// UI-specific types for components
export interface TransactionCardProps {
  transaction: Transaction
  className?: string
}

export interface TransactionFiltersProps {
  filters: TransactionFilters
  onFiltersChange: (filters: TransactionFilters) => void
  loading?: boolean
  className?: string
}

export interface TransactionFeedProps {
  transactions: Transaction[]
  hasMore: boolean
  loading: boolean
  loadingMore: boolean
  onLoadMore: () => void
  emptyMessage?: string
  className?: string
}

// Hook return type
export interface UseTransactionsReturn {
  transactions: Transaction[]
  filters: TransactionFilters
  pagination: TransactionPagination
  balance: UserBalance
  loading: boolean
  loadingMore: boolean
  loadingBalance: boolean
  error: string | null
  hasMore: boolean
  hasTransactions: boolean
  
  // Actions
  setFilters: (filters: TransactionFilters) => void
  loadMore: () => void
  refresh: () => void
}

// Transaction display helpers
export interface TransactionDisplayInfo {
  icon: string
  color: string
  title: string
  description: string
  amountPrefix: '+' | '-' | ''
}

// Transaction grouping by date
export interface TransactionGroup {
  date: string // ISO date string (YYYY-MM-DD)
  displayDate: string // Formatted date for display
  transactions: Transaction[]
}