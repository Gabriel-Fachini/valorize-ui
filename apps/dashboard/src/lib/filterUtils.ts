/**
 * Filter Utilities
 * Helper functions to convert UI filters to API filters
 */

import type { 
  TransactionUIFilters, 
  TransactionFilters,
  TimePeriodFilter,
} from '@/types'

/**
 * Get date range for time period filter
 */
const getDateRangeForPeriod = (period: TimePeriodFilter, customRange?: { from: string; to: string }) => {
  const now = new Date()
  let fromDate: string | undefined
  let toDate: string | undefined

  switch (period) {
    case 'today': {
      const start = new Date(now)
      start.setHours(0, 0, 0, 0)
      fromDate = start.toISOString()
      toDate = now.toISOString()
      break
    }
    case 'week': {
      const start = new Date(now)
      start.setDate(now.getDate() - 7)
      fromDate = start.toISOString()
      toDate = now.toISOString()
      break
    }
    case 'month': {
      const start = new Date(now)
      start.setMonth(now.getMonth() - 1)
      fromDate = start.toISOString()
      toDate = now.toISOString()
      break
    }
    case 'custom':
      if (customRange?.from) {
        fromDate = new Date(customRange.from).toISOString()
      }
      if (customRange?.to) {
        toDate = new Date(customRange.to).toISOString()
      }
      break
  }

  return { fromDate, toDate }
}

/**
 * Convert UI filters to API filters
 * Maps user-friendly filters to backend-compatible format
 */
export const convertUIFiltersToAPI = (uiFilters: TransactionUIFilters): TransactionFilters => {
  const apiFilters: TransactionFilters = {}

  // Map activity filter to balance/transaction type combinations
  switch (uiFilters.activity) {
    case 'praises':
      // Praises are COMPLIMENT balance type
      apiFilters.balanceType = 'COMPLIMENT'
      break
    case 'prizes':
      // Prize redemptions are REDEEMABLE balance + DEBIT transaction
      apiFilters.balanceType = 'REDEEMABLE'
      apiFilters.transactionType = 'DEBIT'
      break
    case 'system':
      // System transactions are RESET type
      apiFilters.transactionType = 'RESET'
      break
    case 'all':
    default:
      // No specific filter - show all
      break
  }

  // Map direction filter to transaction type (if not already set)
  if (!apiFilters.transactionType) {
    switch (uiFilters.direction) {
      case 'in':
        apiFilters.transactionType = 'CREDIT'
        break
      case 'out':
        apiFilters.transactionType = 'DEBIT'
        break
      case 'both':
      default:
        // No filter - show both
        break
    }
  }

  // Map time period filter to date range
  const { fromDate, toDate } = getDateRangeForPeriod(
    uiFilters.timePeriod,
    uiFilters.customDateRange,
  )
  
  if (fromDate) apiFilters.fromDate = fromDate
  if (toDate) apiFilters.toDate = toDate

  return apiFilters
}

/**
 * Get default UI filters
 */
export const getDefaultUIFilters = (): TransactionUIFilters => ({
  activity: 'all',
  direction: 'both',
  timePeriod: 'month',
  customDateRange: undefined,
})
