import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { usersService } from '@/services/users'

/**
 * Hook for searching users with debounce
 * Useful for autocomplete/search inputs
 */
export function useUserSearch(search: string, debounceMs = 300) {
  const [debouncedSearch, setDebouncedSearch] = useState(search)

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [search, debounceMs])

  // Query users
  const query = useQuery({
    queryKey: ['users-search', debouncedSearch],
    queryFn: () => usersService.list({
      search: debouncedSearch,
      limit: 20,
      status: 'active',
    }),
    enabled: debouncedSearch.length >= 2, // Only search with 2+ characters
    staleTime: 30000, // Cache for 30 seconds
  })

  return {
    users: query.data?.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
  }
}
