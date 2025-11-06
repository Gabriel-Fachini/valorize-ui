/**
 * Voucher Detail Hook
 * Hook for fetching a single voucher product details
 */

import { useQuery } from '@tanstack/react-query'
import { vouchersService } from '@/services/vouchers'

export const useVoucherDetail = (id: string | undefined) => {
  const query = useQuery({
    queryKey: ['voucher', id],
    queryFn: async () => {
      if (!id) throw new Error('Voucher ID is required')
      return await vouchersService.get(id)
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
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

export type UseVoucherDetailReturn = ReturnType<typeof useVoucherDetail>
