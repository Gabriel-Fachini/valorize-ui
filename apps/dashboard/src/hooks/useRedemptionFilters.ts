import { useState, useCallback, useMemo } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import type { RedemptionsQuery } from '@/types/redemption.types'

const PERIOD_OPTIONS = [
  { label: 'Últimos 30 dias', value: '30', days: 30 },
  { label: 'Últimos 90 dias', value: '90', days: 90 },
  { label: 'Todos', value: 'ALL' },
] as const

const ITEMS_PER_PAGE = 12

interface UseRedemptionFiltersReturn {
  // State
  status: string
  period: string
  search: string
  offset: number
  // Actions
  setStatus: (status: string) => void
  setPeriod: (period: string) => void
  setSearch: (search: string) => void
  setOffset: (offset: number) => void
  handleSearchChange: (value: string) => void
  handleStatusChange: (value: string) => void
  handlePeriodChange: (value: string) => void
  handleLoadMore: () => void
  handleClearFilters: () => void
  // Computed
  params: RedemptionsQuery
  hasActiveFilters: boolean
  hasMore: (itemsCount: number) => boolean
}

/**
 * Custom hook to manage redemption filters state and logic
 * Encapsulates all filter-related state and handlers
 */
export const useRedemptionFilters = (): UseRedemptionFiltersReturn => {
  const [status, setStatus] = useState<string>('ALL')
  const [period, setPeriod] = useState<string>('30')
  const [search, setSearch] = useState('')
  const [offset, setOffset] = useState(0)
  
  // Debounce search to avoid excessive API calls
  const debouncedSearch = useDebounce(search, 300)

  // Calculate date range based on selected period
  const { fromDate, toDate } = useMemo(() => {
    const selectedPeriod = PERIOD_OPTIONS.find(p => p.value === period)
    if (!selectedPeriod || !('days' in selectedPeriod)) {
      return { fromDate: undefined, toDate: undefined }
    }
    
    const to = new Date()
    const from = new Date(Date.now() - selectedPeriod.days * 24 * 60 * 60 * 1000)
    return { fromDate: from.toISOString(), toDate: to.toISOString() }
  }, [period])

  // Build API query parameters
  const params: RedemptionsQuery = useMemo(() => ({
    limit: ITEMS_PER_PAGE,
    offset,
    status: status === 'ALL' ? undefined : status,
    fromDate,
    toDate,
    search: debouncedSearch.trim() || undefined,
  }), [offset, status, fromDate, toDate, debouncedSearch])

  // Check if any filters are active
  const hasActiveFilters = useMemo(
    () => search.trim() !== '' || status !== 'ALL' || period !== '30',
    [search, status, period],
  )

  // Check if there are more items to load
  const hasMore = useCallback(
    (itemsCount: number) => itemsCount === ITEMS_PER_PAGE,
    [],
  )

  // Handler: Search input change
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setOffset(0) // Reset pagination when search changes
  }, [])

  // Handler: Status filter change
  const handleStatusChange = useCallback((value: string) => {
    setStatus(value)
    setOffset(0) // Reset pagination when filter changes
  }, [])

  // Handler: Period filter change
  const handlePeriodChange = useCallback((value: string) => {
    setPeriod(value)
    setOffset(0) // Reset pagination when filter changes
  }, [])

  // Handler: Load more items (pagination)
  const handleLoadMore = useCallback(() => {
    setOffset(prev => prev + ITEMS_PER_PAGE)
  }, [])

  // Handler: Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearch('')
    setStatus('ALL')
    setPeriod('30')
    setOffset(0)
  }, [])

  return {
    // State
    status,
    period,
    search,
    offset,
    // Actions
    setStatus,
    setPeriod,
    setSearch,
    setOffset,
    handleSearchChange,
    handleStatusChange,
    handlePeriodChange,
    handleLoadMore,
    handleClearFilters,
    // Computed
    params,
    hasActiveFilters,
    hasMore,
  }
}
