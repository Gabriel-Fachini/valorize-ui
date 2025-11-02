import { useQuery } from '@tanstack/react-query'
import { usersService } from '@/services/users'
import type { AllowedDomain } from '@/types/users'

export const useAllowedDomains = () => {
  return useQuery<AllowedDomain[]>({
    queryKey: ['allowedDomains'],
    queryFn: () => usersService.getAllowedDomains(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
