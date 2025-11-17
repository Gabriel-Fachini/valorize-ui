/**
 * Formatting Utilities
 * Common formatting functions for numbers, currency, dates, and percentages
 */

/**
 * Format number with PT-BR locale
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value)
}

/**
 * Format percentage with one decimal place
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`
}

/**
 * Format currency in BRL
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Format date range for display
 */
export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
  const end = new Date(endDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  return `${start} - ${end}`
}

/**
 * Format single date for display
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Format short date
 */
export const formatShortDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
