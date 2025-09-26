/**
 * Transactions Hook
 * Manages transaction data loading, pagination, and filtering using React Query
 */

import { useState, useCallback } from 'react'
import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { getTransactions, getWalletBalance } from '@/services/wallets.service'
import { useAuth } from '@/hooks/useAuth'
import type {
  TransactionFilters,
  TransactionQueryParams,
  UseTransactionsReturn,
} from '@/types'

// Constants
const DEFAULT_LIMIT = 20
const TRANSACTIONS_QUERY_KEY = 'transactions'
const BALANCE_QUERY_KEY = 'wallet-balance'

/**
 * Main hook for managing transactions data
 */
export const useTransactions = (): UseTransactionsReturn => {
  const { user: currentUser } = useAuth()
  const queryClient = useQueryClient()
  
  // Local state for filters
  const [filters, setFiltersState] = useState<TransactionFilters>({})

  // Balance query (separate from transactions for independent caching)
  const balanceQuery = useQuery({
    queryKey: [BALANCE_QUERY_KEY],
    queryFn: async () => {
      if (!currentUser) return { complimentBalance: 0, redeemableBalance: 0 }
      return await getWalletBalance()
    },
    enabled: !!currentUser,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,    // 5 minutes
  })

  // Infinite query for transactions with pagination
  const transactionsQuery = useInfiniteQuery({
    queryKey: [TRANSACTIONS_QUERY_KEY, filters],
    queryFn: async ({ pageParam = 0 }) => {
      if (!currentUser) {
        return { transactions: [], pagination: { total: 0, limit: DEFAULT_LIMIT, offset: 0, hasMore: false } }
      }

      const queryParams: TransactionQueryParams = {
        limit: DEFAULT_LIMIT,
        offset: pageParam,
        ...filters,
      }

      return await getTransactions(queryParams)
    },
    enabled: !!currentUser,
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages) => {
      const { pagination } = lastPage
      return pagination.hasMore ? pagination.offset + pagination.limit : undefined
    },
    staleTime: 1 * 60 * 1000,  // 1 minute
    gcTime: 3 * 60 * 1000,     // 3 minutes
  })

  // Flatten all pages into single array
  const allTransactions = transactionsQuery.data?.pages.flatMap(page => page.transactions) ?? []
  
  // Get pagination info from last page
  const lastPage = transactionsQuery.data?.pages[transactionsQuery.data.pages.length - 1]
  const pagination = lastPage?.pagination ?? {
    total: 0,
    limit: DEFAULT_LIMIT,
    offset: 0,
    hasMore: false,
  }

  // Actions
  const setFilters = useCallback((newFilters: TransactionFilters) => {
    setFiltersState(newFilters)
    // Reset pagination when filters change
    queryClient.removeQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] })
  }, [queryClient])

  const loadMore = useCallback(() => {
    if (transactionsQuery.hasNextPage && !transactionsQuery.isFetchingNextPage) {
      transactionsQuery.fetchNextPage()
    }
  }, [transactionsQuery])

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] })
    queryClient.invalidateQueries({ queryKey: [BALANCE_QUERY_KEY] })
  }, [queryClient])

  // Error handling
  const error = transactionsQuery.error ?? balanceQuery.error
  const errorMessage = error?.message ?? null

  return {
    // Data
    transactions: allTransactions,
    filters,
    pagination,
    balance: balanceQuery.data ?? { complimentBalance: 0, redeemableBalance: 0 },
    
    // Loading states
    loading: transactionsQuery.isLoading,
    loadingMore: transactionsQuery.isFetchingNextPage,
    loadingBalance: balanceQuery.isLoading,
    
    // Error state
    error: errorMessage,
    
    // Computed states
    hasMore: !!transactionsQuery.hasNextPage,
    hasTransactions: allTransactions.length > 0,
    
    // Actions
    setFilters,
    loadMore,
    refresh,
  }
}

/**
 * Hook for just getting current balance (lighter version)
 */
export const useWalletBalance = () => {
  const { user: currentUser } = useAuth()
  
  return useQuery({
    queryKey: [BALANCE_QUERY_KEY],
    queryFn: async () => {
      if (!currentUser) return { complimentBalance: 0, redeemableBalance: 0 }
      return await getWalletBalance()
    },
    enabled: !!currentUser,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}