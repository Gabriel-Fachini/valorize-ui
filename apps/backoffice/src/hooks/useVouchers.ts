/**
 * Vouchers Query Hook
 * React Query hook for fetching and managing voucher products list
 */

import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { listVouchers, getVoucher } from '@/services/voucher.service'
import type { VouchersQueryParams, VoucherStats } from '@/types/voucher'
import { useMemo } from 'react'

/**
 * Query key factory for vouchers
 * Ensures consistent cache keys across the application
 */
export const voucherKeys = {
  all: ['vouchers'] as const,
  lists: () => [...voucherKeys.all, 'list'] as const,
  list: (params?: VouchersQueryParams) => [...voucherKeys.lists(), params] as const,
  details: () => [...voucherKeys.all, 'detail'] as const,
  detail: (id: string) => [...voucherKeys.details(), id] as const,
}

/**
 * Hook to fetch voucher products list
 *
 * @param params - Query parameters for filtering vouchers
 * @returns Vouchers data, loading states, and utility functions
 */
export function useVouchers(params?: VouchersQueryParams) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: voucherKeys.list(params),
    queryFn: async () => await listVouchers(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
    // Keep previous data while fetching new page
    placeholderData: keepPreviousData,
  })

  // Calculate statistics from voucher data
  const stats = useMemo<VoucherStats>(() => {
    const vouchers = query.data?.items ?? []
    const active = vouchers.filter((v) => v.isActive).length
    const inactive = vouchers.filter((v) => !v.isActive).length
    const lastSyncAt = vouchers.length > 0
      ? vouchers.reduce((latest, v) => {
          const vDate = new Date(v.lastSyncAt)
          return vDate > new Date(latest) ? v.lastSyncAt : latest
        }, vouchers[0].lastSyncAt)
      : null

    return {
      total: vouchers.length,
      active,
      inactive,
      lastSyncAt,
    }
  }, [query.data?.items])

  /**
   * Invalidate all voucher queries
   * Useful after mutations that affect voucher data
   */
  const invalidateVouchers = () => {
    queryClient.invalidateQueries({
      queryKey: voucherKeys.lists(),
      exact: false,
    })
  }

  return {
    vouchers: query.data?.items ?? [],
    totalCount: query.data?.total ?? 0,
    stats,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    invalidateVouchers,
    refetch: query.refetch,
  }
}

export type UseVouchersReturn = ReturnType<typeof useVouchers>

/**
 * Hook to fetch a single voucher product by ID
 *
 * @param id - Voucher product ID
 * @returns Voucher product data and loading states
 */
export function useVoucher(id: string) {
  const query = useQuery({
    queryKey: voucherKeys.detail(id),
    queryFn: async () => await getVoucher(id),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })

  return {
    voucher: query.data?.product,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
  }
}

export type UseVoucherReturn = ReturnType<typeof useVoucher>
