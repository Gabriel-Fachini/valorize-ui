/**
 * Hook for fetching public compliments feed
 */
import { useQuery } from '@tanstack/react-query'
import { getComplimentsFeed } from '@/services/compliments'
import type { ComplimentFeedItem } from '@/types'

export interface UseComplimentsFeedReturn {
  data: ComplimentFeedItem[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Hook to fetch the public compliments feed
 * Returns the latest 10 public compliments from the company
 */
export const useComplimentsFeed = (): UseComplimentsFeedReturn => {
  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['compliments', 'feed'],
    queryFn: getComplimentsFeed,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (previously cacheTime)
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
  })

  return {
    data,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  }
}
