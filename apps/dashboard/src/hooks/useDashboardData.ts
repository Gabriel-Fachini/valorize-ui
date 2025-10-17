import { useQuery } from '@tanstack/react-query'
import { getCompanyNews, getUpcomingEvents } from '@/services/dashboard.service'
import { usePraisesData } from './usePraisesData'
import type { NewsItem, EventItem } from '@/types/dashboard.types'

export interface DashboardData {
  news: NewsItem[]
  events: EventItem[]
  praises: ReturnType<typeof usePraisesData>['praises']
  loading: {
    news: boolean
    events: boolean
    praises: boolean
  }
  errors: {
    news?: string
    events?: string
    praises?: string
  }
  hasAnyError: boolean
  isAnyLoading: boolean
}

export const useDashboardData = (): DashboardData => {
  // News query
  const newsQuery = useQuery({
    queryKey: ['dashboard', 'news'],
    queryFn: getCompanyNews,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Events query
  const eventsQuery = useQuery({
    queryKey: ['dashboard', 'events'],
    queryFn: getUpcomingEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Praises data (using existing hook)
  const praisesData = usePraisesData()

  // Computed values
  const hasAnyError = !!(newsQuery.error ?? eventsQuery.error ?? praisesData.computed.hasAnyError)
  const isAnyLoading = newsQuery.isLoading || eventsQuery.isLoading || praisesData.computed.isAnyLoading

  return {
    news: newsQuery.data ?? [],
    events: eventsQuery.data ?? [],
    praises: praisesData.praises,
    loading: {
      news: newsQuery.isLoading,
      events: eventsQuery.isLoading,
      praises: praisesData.computed.isAnyLoading,
    },
    errors: {
      news: newsQuery.error?.message,
      events: eventsQuery.error?.message,
      praises: praisesData.computed.combinedErrorMessage ?? undefined,
    },
    hasAnyError,
    isAnyLoading,
  }
}

