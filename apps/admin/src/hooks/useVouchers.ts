/**
 * Vouchers List Hook
 * Hook for fetching and managing the list of voucher products
 */

import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { vouchersService } from '@/services/vouchers'
import type { VouchersQueryParams } from '@/types/vouchers'

export const useVouchers = (params?: VouchersQueryParams) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['vouchers', params],
    queryFn: async () => await vouchersService.list(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    // Keep previous data while fetching new page
    placeholderData: keepPreviousData,
  })

  const invalidateVouchers = () => {
    queryClient.invalidateQueries({
      queryKey: ['vouchers'],
      exact: false,
    })
  }

  return {
    vouchers: query.data?.items ?? [],
    totalCount: query.data?.total ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    invalidateVouchers,
    refetch: query.refetch,
  }
}

export type UseVouchersReturn = ReturnType<typeof useVouchers>
