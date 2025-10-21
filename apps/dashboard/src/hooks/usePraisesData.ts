import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { listReceivableUsers, getCompanyValues, getUserBalance, getComplimentsHistory } from '@/services/compliments'
import { useAuth } from '@/hooks/useAuth'
import type { ComplimentUser, CompanyValue as APICompanyValue, Compliment } from '@/types'

// Types for UI components
export interface PraiseUser {
  id: string
  name: string
  email: string
  avatar?: string
  department: string
}

export interface PraiseCompanyValue {
  id: string
  name: string
  description: string
  color: string
  icon: string
}

export interface PraiseData {
  id: string
  from: {
    name: string
    avatar?: string
  }
  to: {
    name: string
    avatar?: string
  }
  message: string
  value: string
  coins: number
  createdAt: string
}

export interface UserBalance {
  complimentBalance: number
  redeemableBalance: number
}

export interface PraisesDataState {
  users: PraiseUser[]
  companyValues: PraiseCompanyValue[]
  userBalance: UserBalance
  praises: PraiseData[]
  currentFilter: 'all' | 'sent' | 'received'
  loading: {
    users: boolean
    values: boolean
    balance: boolean
    praises: boolean
  }
  errors: {
    users?: string
    values?: string
    balance?: string
    praises?: string
  }
}

export interface PraisesDataActions {
  refreshBalance: () => void
  refreshUsers: () => void
  refreshValues: () => void
  refreshPraises: () => void
  setFilter: (filter: 'all' | 'sent' | 'received') => void
  invalidateCache: () => void
  clearError: (type: keyof PraisesDataState['errors']) => void
}

// Action types for the reducer - Not used with React Query
// Keeping for reference if needed later

// Default company value colors for fallback
const defaultColors = [
  'from-purple-500 to-indigo-600',
  'from-green-500 to-emerald-600',
  'from-blue-500 to-cyan-600',
  'from-orange-500 to-red-600',
  'from-pink-500 to-rose-600',
  'from-yellow-500 to-orange-600',
  'from-indigo-500 to-purple-600',
  'from-cyan-500 to-blue-600',
]

// Mock departments for users (since API doesn't provide departments yet)
const mockDepartments = [
  'Marketing', 'Tecnologia', 'Vendas', 'RH', 'Design', 
  'Produto', 'Financeiro', 'Operações', 'Geral',
]

export const usePraisesData = () => {
  const { user: currentUser } = useAuth()
  const queryClient = useQueryClient()
  const [currentFilter, setCurrentFilter] = useState<'all' | 'sent' | 'received'>('all')

  // Users query
  const usersQuery = useQuery({
    queryKey: ['praises', 'users'],
    queryFn: async () => {
      if (!currentUser) return []
      
      const response = await listReceivableUsers()
      
      // Convert API users to UI format
      const uiUsers: PraiseUser[] = response.users.map((apiUser: ComplimentUser, index: number) => ({
        id: apiUser.id,
        name: apiUser.name,
        email: apiUser.email,
        avatar: apiUser.avatar ?? undefined,
        department: mockDepartments[index % mockDepartments.length],
      }))
      
      return uiUsers
    },
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  // Company values query
  const companyValuesQuery = useQuery({
    queryKey: ['praises', 'values', currentUser?.companyId],
    queryFn: async () => {
      if (!currentUser?.companyId) return []
      
      const response = await getCompanyValues(currentUser.companyId)
      
      // Convert API values to UI format
      const uiValues: PraiseCompanyValue[] = response.map((apiValue: APICompanyValue, index: number) => ({
        id: apiValue.id.toString(),
        name: apiValue.title,
        description: apiValue.description,
        color: defaultColors[index % defaultColors.length],
        icon: apiValue.icon,
      }))
      
      return uiValues
    },
    enabled: !!currentUser?.companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchOnWindowFocus: true, // ✅ Refetch quando usuário volta para a aba
    refetchOnMount: true, // ✅ Refetch quando componente monta
  })

  // User balance query
  const balanceQuery = useQuery({
    queryKey: ['praises', 'balance'],
    queryFn: async () => {
      if (!currentUser) return { complimentBalance: 0, redeemableBalance: 0 }
      
      return await getUserBalance()
    },
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // ✅ SOLUÇÃO 2: Retry automático para recuperar de falhas temporárias
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  // Praises query
  const praisesQuery = useQuery({
    queryKey: ['praises', 'history', currentFilter],
    queryFn: async () => {
      if (!currentUser) return []
      
      let allPraises: Compliment[] = []
      
      if (currentFilter === 'all') {
        // Load both sent and received
        const [sentPraises, receivedPraises] = await Promise.all([
          getComplimentsHistory('sent'),
          getComplimentsHistory('received'),
        ])
        allPraises = [...sentPraises, ...receivedPraises]
      } else {
        // Load only the specific type
        allPraises = await getComplimentsHistory(currentFilter)
      }
      
      // Convert API compliments to UI format
      const uiPraises: PraiseData[] = allPraises.map((compliment: Compliment) => ({
        id: compliment.id,
        from: {
          name: compliment.sender?.name ?? 'Usuário desconhecido',
          avatar: compliment.sender?.avatar ?? undefined,
        },
        to: {
          name: compliment.receiver?.name ?? 'Usuário desconhecido',
          avatar: compliment.receiver?.avatar ?? undefined,
        },
        message: compliment.message,
        value: compliment.companyValue?.title ?? 'Valor não informado',
        coins: compliment.coins,
        createdAt: compliment.createdAt,
      }))
      
      // Sort by creation date (newest first)
      uiPraises.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      return uiPraises
    },
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  // Actions
  const actions: PraisesDataActions = {
    refreshBalance: () => {
      queryClient.invalidateQueries({ queryKey: ['praises', 'balance'] })
      queryClient.refetchQueries({ queryKey: ['praises', 'balance'] })
    },
    refreshUsers: () => {
      queryClient.invalidateQueries({ queryKey: ['praises', 'users'] })
      queryClient.refetchQueries({ queryKey: ['praises', 'users'] })
    },
    refreshValues: () => {
      queryClient.invalidateQueries({ queryKey: ['praises', 'values'] })
      queryClient.refetchQueries({ queryKey: ['praises', 'values'] })
    },
    refreshPraises: () => {
      queryClient.invalidateQueries({ queryKey: ['praises', 'history'] })
      queryClient.refetchQueries({ queryKey: ['praises', 'history'] })
    },
    setFilter: (filter) => {
      setCurrentFilter(filter)
    },
    invalidateCache: () => {
      queryClient.invalidateQueries({ queryKey: ['praises'] })
      queryClient.refetchQueries({ queryKey: ['praises'] })
    },
    clearError: () => {
      // Errors are automatically handled by React Query
      // This is kept for compatibility
    },
  }

  // Computed properties
  const hasAnyError = !!(usersQuery.error ?? companyValuesQuery.error ?? balanceQuery.error ?? praisesQuery.error)
  const isAnyLoading = usersQuery.isLoading || companyValuesQuery.isLoading || balanceQuery.isLoading || praisesQuery.isLoading
  const combinedErrorMessage = [
    usersQuery.error?.message,
    companyValuesQuery.error?.message,
    balanceQuery.error?.message,
    praisesQuery.error?.message,
  ].filter(Boolean).join('; ') || null

  const hasUsers = (usersQuery.data?.length ?? 0) > 0
  const hasCompanyValues = (companyValuesQuery.data?.length ?? 0) > 0
  const isUsersLoading = usersQuery.isLoading
  const isValuesLoading = companyValuesQuery.isLoading
  
  const hasUsersError = !isUsersLoading && !hasUsers && usersQuery.error
  const hasValuesError = !isValuesLoading && !hasCompanyValues && companyValuesQuery.error

  return {
    users: usersQuery.data ?? [],
    companyValues: companyValuesQuery.data ?? [],
    userBalance: balanceQuery.data ?? { complimentBalance: 0, redeemableBalance: 0 },
    praises: praisesQuery.data ?? [],
    currentFilter,
    loading: {
      users: usersQuery.isLoading,
      values: companyValuesQuery.isLoading,
      balance: balanceQuery.isLoading,
      praises: praisesQuery.isLoading,
    },
    errors: {
      users: usersQuery.error?.message,
      values: companyValuesQuery.error?.message,
      balance: balanceQuery.error?.message,
      praises: praisesQuery.error?.message,
    },
    actions,
    computed: {
      hasAnyError,
      isAnyLoading,
      combinedErrorMessage,
      hasUsers,
      hasCompanyValues,
      hasPraises: (praisesQuery.data?.length ?? 0) > 0,
      canSendPraise: hasUsers && hasCompanyValues && !isAnyLoading,
      hasUsersError,
      hasValuesError,
      isUsersLoading,
      isValuesLoading,
    },
  }
}