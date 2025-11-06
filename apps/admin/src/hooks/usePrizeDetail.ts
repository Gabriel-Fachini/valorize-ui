/**
 * Prize Detail Hook
 * Hook for fetching a single prize details
 */

import { useQuery } from '@tanstack/react-query'
import { prizesService } from '@/services/prizes'

export const usePrizeDetail = (id: string | undefined) => {
  const query = useQuery({
    queryKey: ['prize', id],
    queryFn: async () => {
      if (!id) throw new Error('Prize ID is required')
      return await prizesService.get(id)
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  })

  return {
    prize: query.data?.prize,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
  }
}

export type UsePrizeDetailReturn = ReturnType<typeof usePrizeDetail>
