/**
 * Praises Data Hook
 * Manages all data loading and state for the Praises page using useReducer for optimal state management
 */

import { useReducer, useEffect, useCallback } from 'react'
import { listReceivableUsers, getCompanyValues, getUserBalance } from '@/services/compliments'
import { useAuth } from '@/hooks/useAuth'
import type { ComplimentUser, CompanyValue as APICompanyValue } from '@/types'

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
  praises: PraiseData[] // TODO: Implement real praises loading
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
  refreshBalance: () => Promise<void>
  refreshUsers: () => Promise<void>
  refreshValues: () => Promise<void>
  refreshPraises: () => Promise<void>
  clearError: (type: keyof PraisesDataState['errors']) => void
}

// Action types for the reducer
type PraisesDataAction =
  | { type: 'SET_USERS_LOADING'; payload: boolean }
  | { type: 'SET_VALUES_LOADING'; payload: boolean }
  | { type: 'SET_BALANCE_LOADING'; payload: boolean }
  | { type: 'SET_PRAISES_LOADING'; payload: boolean }
  | { type: 'SET_USERS_SUCCESS'; payload: PraiseUser[] }
  | { type: 'SET_VALUES_SUCCESS'; payload: PraiseCompanyValue[] }
  | { type: 'SET_BALANCE_SUCCESS'; payload: UserBalance }
  | { type: 'SET_PRAISES_SUCCESS'; payload: PraiseData[] }
  | { type: 'SET_USERS_ERROR'; payload: string }
  | { type: 'SET_VALUES_ERROR'; payload: string }
  | { type: 'SET_BALANCE_ERROR'; payload: string }
  | { type: 'SET_PRAISES_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR'; payload: keyof PraisesDataState['errors'] }

// Initial state
const initialState: PraisesDataState = {
  users: [],
  companyValues: [],
  userBalance: { complimentBalance: 0, redeemableBalance: 0 },
  praises: [], // Empty array - will show empty state
  loading: {
    users: true,
    values: true,
    balance: true,
    praises: false, // Not loading praises yet
  },
  errors: {},
}

// Reducer function following React 19 best practices
const praisesDataReducer = (state: PraisesDataState, action: PraisesDataAction): PraisesDataState => {
  switch (action.type) {
    case 'SET_USERS_LOADING':
      return {
        ...state,
        loading: { ...state.loading, users: action.payload },
        errors: { ...state.errors, users: undefined },
      }
    
    case 'SET_VALUES_LOADING':
      return {
        ...state,
        loading: { ...state.loading, values: action.payload },
        errors: { ...state.errors, values: undefined },
      }
    
    case 'SET_BALANCE_LOADING':
      return {
        ...state,
        loading: { ...state.loading, balance: action.payload },
        errors: { ...state.errors, balance: undefined },
      }
    
    case 'SET_PRAISES_LOADING':
      return {
        ...state,
        loading: { ...state.loading, praises: action.payload },
        errors: { ...state.errors, praises: undefined },
      }
    
    case 'SET_USERS_SUCCESS':
      return {
        ...state,
        users: action.payload,
        loading: { ...state.loading, users: false },
        errors: { ...state.errors, users: undefined },
      }
    
    case 'SET_VALUES_SUCCESS':
      return {
        ...state,
        companyValues: action.payload,
        loading: { ...state.loading, values: false },
        errors: { ...state.errors, values: undefined },
      }
    
    case 'SET_BALANCE_SUCCESS':
      return {
        ...state,
        userBalance: action.payload,
        loading: { ...state.loading, balance: false },
        errors: { ...state.errors, balance: undefined },
      }
    
    case 'SET_PRAISES_SUCCESS':
      return {
        ...state,
        praises: action.payload,
        loading: { ...state.loading, praises: false },
        errors: { ...state.errors, praises: undefined },
      }
    
    case 'SET_USERS_ERROR':
      return {
        ...state,
        users: [],
        loading: { ...state.loading, users: false },
        errors: { ...state.errors, users: action.payload },
      }
    
    case 'SET_VALUES_ERROR':
      return {
        ...state,
        companyValues: [],
        loading: { ...state.loading, values: false },
        errors: { ...state.errors, values: action.payload },
      }
    
    case 'SET_BALANCE_ERROR':
      return {
        ...state,
        userBalance: { complimentBalance: 0, redeemableBalance: 0 },
        loading: { ...state.loading, balance: false },
        errors: { ...state.errors, balance: action.payload },
      }
    
    case 'SET_PRAISES_ERROR':
      return {
        ...state,
        praises: [],
        loading: { ...state.loading, praises: false },
        errors: { ...state.errors, praises: action.payload },
      }
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload]: undefined },
      }
    
    default: {
      const exhaustiveCheck: never = action
      throw new Error(`Unknown action type: ${action.type}`)
    }
  }
}

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
  
  const [state, dispatch] = useReducer(praisesDataReducer, initialState)

  // Load receivable users
  const loadUsers = useCallback(async () => {
    // Wait for user authentication to be loaded
    if (currentUser === undefined) {
      return // Still loading user, wait
    }
    
    dispatch({ type: 'SET_USERS_LOADING', payload: true })
    
    if (currentUser === null) {
      // User is not authenticated, show empty state
      dispatch({ type: 'SET_USERS_SUCCESS', payload: [] })
      return
    }
    
    try {
      const response = await listReceivableUsers()
      
      // Convert API users to UI format
      const uiUsers: PraiseUser[] = response.users.map((apiUser: ComplimentUser, index: number) => ({
        id: apiUser.id,
        name: apiUser.name,
        email: apiUser.email,
        avatar: apiUser.avatar ?? undefined,
        department: mockDepartments[index % mockDepartments.length], // Fallback to mock departments
      }))
      
      dispatch({ type: 'SET_USERS_SUCCESS', payload: uiUsers })
    } catch {
      dispatch({ type: 'SET_USERS_ERROR', payload: 'Erro ao carregar usuários disponíveis' })
    }
  }, [currentUser])

  // Load company values
  const loadCompanyValues = useCallback(async () => {
    // Wait for user to be loaded before making decisions
    if (currentUser === undefined) {
      return // Still loading user, wait
    }
    
    dispatch({ type: 'SET_VALUES_LOADING', payload: true })
    
    if (!currentUser?.companyId) {
      // User is not authenticated or no company ID, show empty state
      dispatch({ type: 'SET_VALUES_SUCCESS', payload: [] })
      return
    }

    try {
      const response = await getCompanyValues(currentUser.companyId)
      
      // Convert API values to UI format
      const uiValues: PraiseCompanyValue[] = response.map((apiValue: APICompanyValue, index: number) => ({
        id: apiValue.companyId,
        name: apiValue.title,
        description: apiValue.description,
        color: defaultColors[index % defaultColors.length], // Cycling through default colors
        icon: apiValue.icon,
      }))
      
      dispatch({ type: 'SET_VALUES_SUCCESS', payload: uiValues })
    } catch {
      dispatch({ type: 'SET_VALUES_ERROR', payload: 'Erro ao carregar valores da empresa' })
    }
  }, [currentUser])

  // Load user balance
  const loadUserBalance = useCallback(async () => {
    // Wait for user authentication to be loaded
    if (currentUser === undefined) {
      return // Still loading user, wait
    }
    
    dispatch({ type: 'SET_BALANCE_LOADING', payload: true })
    
    if (currentUser === null) {
      // User is not authenticated, show default empty balance
      dispatch({ type: 'SET_BALANCE_SUCCESS', payload: { complimentBalance: 0, redeemableBalance: 0 } })
      return
    }
    
    try {
      const balance = await getUserBalance()
      dispatch({ type: 'SET_BALANCE_SUCCESS', payload: balance })
    } catch {
      dispatch({ type: 'SET_BALANCE_ERROR', payload: 'Erro ao carregar saldo' })
    }
  }, [currentUser])

  // Load praises (placeholder for future implementation)
  const loadPraises = useCallback(async () => {
    // TODO: Implement real praises loading when API is available
    dispatch({ type: 'SET_PRAISES_SUCCESS', payload: [] })
  }, [])

  // Actions
  const actions: PraisesDataActions = {
    refreshBalance: loadUserBalance,
    refreshUsers: loadUsers,
    refreshValues: loadCompanyValues,
    refreshPraises: loadPraises,
    clearError: (type) => {
      dispatch({ type: 'CLEAR_ERROR', payload: type })
    },
  }

  // Load data on mount and user change
  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  useEffect(() => {
    loadCompanyValues()
  }, [loadCompanyValues])

  useEffect(() => {
    loadUserBalance()
  }, [loadUserBalance])

  useEffect(() => {
    loadPraises()
  }, [loadPraises])

  // Computed properties
  const hasAnyError = Object.values(state.errors).some(error => error !== undefined)
  const isAnyLoading = Object.values(state.loading).some(loading => loading)
  const combinedErrorMessage = Object.values(state.errors)
    .filter(error => error !== undefined && error !== null && error !== '')
    .join('; ') || null

  return {
    ...state,
    actions,
    computed: {
      hasAnyError,
      isAnyLoading,
      combinedErrorMessage,
      hasUsers: state.users.length > 0,
      hasCompanyValues: state.companyValues.length > 0,
      hasPraises: state.praises.length > 0,
      canSendPraise: state.users.length > 0 && state.companyValues.length > 0 && !isAnyLoading,
    },
  }
}