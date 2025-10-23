/**
 * Date utilities for period calculations
 * Shared between TransactionsPage and RedemptionsPage
 */

export type PeriodType = 'today' | 'week' | 'month' | 'custom'

export interface CustomDateRange {
  from: string
  to: string
}

export interface PeriodOption {
  label: string
  days?: number
}

/**
 * Get date range for a given period
 */
export function getPeriodDates(period: PeriodType, customRange?: CustomDateRange) {
  if (period === 'custom' && customRange) {
    return {
      fromDate: customRange.from,
      toDate: customRange.to,
    }
  }

  if (period === 'today') {
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
    
    return {
      fromDate: startOfDay.toISOString(),
      toDate: endOfDay.toISOString(),
    }
  }

  if (period === 'week') {
    const today = new Date()
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    return {
      fromDate: weekAgo.toISOString(),
      toDate: today.toISOString(),
    }
  }

  if (period === 'month') {
    const today = new Date()
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    
    return {
      fromDate: monthAgo.toISOString(),
      toDate: today.toISOString(),
    }
  }

  return {
    fromDate: undefined,
    toDate: undefined,
  }
}

/**
 * Format period label for display
 */
export function formatPeriodLabel(period: PeriodType): string {
  const labels = {
    today: 'Hoje',
    week: 'Esta Semana',
    month: 'Este Mês',
    custom: 'Personalizado',
  }
  
  return labels[period] || 'Todos'
}

/**
 * Get period from days
 */
export function getPeriodFromDays(days?: number): PeriodType {
  if (!days) return 'month'
  if (days === 1) return 'today'
  if (days === 7) return 'week'
  if (days === 30) return 'month'
  return 'custom'
}
