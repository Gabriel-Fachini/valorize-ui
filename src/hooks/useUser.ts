/**
 * User Hook
 * Hook for managing user-related data and operations
 */

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { getUserBalance } from '@/services/compliments'
import type { UserBalance } from '@/types'

/**
 * Hook para gerenciar dados do usuário
 * Inclui funcionalidades para obter saldos com keys descritivas para invalidação
 */
export const useUser = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Query para obter saldos do usuário
  const balanceQuery = useQuery({
    queryKey: ['user', user?.id, 'balance'],
    queryFn: async (): Promise<UserBalance> => {
      if (!user) {
        return { complimentBalance: 0, redeemableBalance: 0 }
      }
      return await getUserBalance()
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutos - mais agressivo para saldos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    retry: 2,
  })

  // Funções utilitárias para gerenciar cache
  const invalidateBalance = () => {
    queryClient.invalidateQueries({ 
      queryKey: ['user', user?.id, 'balance'],
      exact: true, 
    })
  }

  const refreshBalance = () => {
    return balanceQuery.refetch()
  }

  // Função para invalidar saldo após movimentação
  const onBalanceMovement = () => {
    invalidateBalance()
    // Também invalida outras queries relacionadas a movimentação
    queryClient.invalidateQueries({ 
      queryKey: ['praises', 'history'],
      exact: false, 
    })
    queryClient.invalidateQueries({ 
      queryKey: ['transactions'],
      exact: false, 
    })
  }

  // Função para invalidar todos os dados do usuário
  const invalidateUserData = () => {
    queryClient.invalidateQueries({ 
      queryKey: ['user', user?.id],
      exact: false, 
    })
  }

  return {
    // Dados
    user,
    balance: balanceQuery.data ?? { complimentBalance: 0, redeemableBalance: 0 },
    
    // Estados de loading/error
    isLoadingBalance: balanceQuery.isLoading,
    isErrorBalance: balanceQuery.isError,
    balanceError: balanceQuery.error,
    
    // Funções de gerenciamento
    invalidateBalance,
    refreshBalance,
    onBalanceMovement,
    invalidateUserData,
    
    // Query raw para casos avançados
    balanceQuery,
  }
}

/**
 * Hook específico apenas para saldos (mais leve)
 * Útil quando só precisamos dos saldos sem outras funcionalidades
 */
export const useUserBalance = () => {
  const { balance, isLoadingBalance, isErrorBalance, onBalanceMovement, refreshBalance } = useUser()
  
  return {
    balance,
    isLoading: isLoadingBalance,
    isError: isErrorBalance,
    onBalanceMovement,
    refreshBalance,
  }
}

/**
 * Tipos para facilitar uso do hook
 */
export type UseUserReturn = ReturnType<typeof useUser>
export type UseUserBalanceReturn = ReturnType<typeof useUserBalance>