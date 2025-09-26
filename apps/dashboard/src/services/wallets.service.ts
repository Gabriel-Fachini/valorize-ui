/**
 * Wallets Service
 * Service for handling wallet transactions API operations
 */

import { api } from './api'
import type {
  TransactionsResponse,
  TransactionQueryParams,
  UserBalance,
} from '@/types'

/**
 * Get user's transaction history
 * 
 * @param params - Query parameters for filtering and pagination
 * @returns Promise with transactions and pagination info
 */
export const getTransactions = async (params: TransactionQueryParams = {}): Promise<TransactionsResponse> => {
  const {
    limit = 50,
    offset = 0,
    balanceType,
    transactionType,
    fromDate,
    toDate,
  } = params

  const queryParams = new URLSearchParams()
  
  queryParams.append('limit', limit.toString())
  queryParams.append('offset', offset.toString())
  
  if (balanceType) {
    queryParams.append('balanceType', balanceType)
  }
  
  if (transactionType) {
    queryParams.append('transactionType', transactionType)
  }
  
  if (fromDate) {
    queryParams.append('fromDate', fromDate)
  }
  
  if (toDate) {
    queryParams.append('toDate', toDate)
  }

  const response = await api.get<TransactionsResponse>(
    `/wallets/transactions?${queryParams.toString()}`,
  )

  return response.data
}

/**
 * Get user's current wallet balance
 * This endpoint retrieves the balance from the wallets service
 */
export const getWalletBalance = async (): Promise<UserBalance> => {
  const response = await api.get<UserBalance>('/wallets/balance')
  return response.data
}

/**
 * Reset weekly balance (admin only)
 * 
 * @param companyId - Optional company ID to reset specific company
 * @returns Promise with reset operation result
 */
export const resetWeeklyBalance = async (companyId?: string): Promise<{
  message: string
  companiesUpdated: number
  walletsUpdated: number
  resetBy: string
}> => {
  const queryParams = new URLSearchParams()
  
  if (companyId) {
    queryParams.append('companyId', companyId)
  }

  const response = await api.post(`/wallets/reset-weekly-balance?${queryParams.toString()}`)
  return response.data
}