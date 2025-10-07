import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { addressService } from '@/services/address.service'
import type { AddressInput } from '@/types/address.types'

export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: () => addressService.list(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const useCreateAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: AddressInput) => addressService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}

export const useUpdateAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: AddressInput }) =>
      addressService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}

export const useDeleteAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => addressService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => addressService.setDefault(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}

