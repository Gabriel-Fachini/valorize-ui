import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { redemptionsService } from '@/services/redemptions.service'
import type { RedemptionsQuery } from '@/types/redemption.types'
import { useUser } from '@/hooks/useUser'

export const useRedemptions = (params: RedemptionsQuery) => {
  // Debounce simples do objeto (especialmente para busca)
  const key = React.useMemo(() => JSON.stringify(params), [params])
  const stableParams = React.useMemo(() => JSON.parse(key) as RedemptionsQuery, [key])

  return useQuery({
  queryKey: ['redemptions', key],
    queryFn: () => redemptionsService.getRedemptions(stableParams),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useRedemptionById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['redemption', id],
    queryFn: () => redemptionsService.getRedemptionById(id!),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useCancelRedemption = () => {
  const queryClient = useQueryClient()
  const { onBalanceMovement } = useUser()

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => redemptionsService.cancelRedemption(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['redemptions'] })
      queryClient.invalidateQueries({ queryKey: ['redemption'] })
      onBalanceMovement()
    },
  })
}
