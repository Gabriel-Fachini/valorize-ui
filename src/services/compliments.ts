/**
 * Compliments Service
 * Service for handling compliments API operations
 */

import { api } from './api'
import type {
  SendComplimentData,
  SendComplimentResponse,
  ListReceivableUsersResponse,
  UserBalance,
  CompanyValue,
} from '@/types'

/**
 * Send a compliment to another user
 */
export const sendCompliment = async (data: SendComplimentData): Promise<SendComplimentResponse> => {
  const response = await api.post<SendComplimentResponse>(
    '/compliments/send-compliment',
    data,
  )

  return response.data
}

/**
 * Get list of users that can receive compliments (same company)
 */
export const listReceivableUsers = async (): Promise<ListReceivableUsersResponse> => {
  const response = await api.get<ListReceivableUsersResponse>(
    '/compliments/list-receivable-users',
  )

  return response.data
}

/**
 * Get company values for a specific company
 */
export const getCompanyValues = async (companyId: string): Promise<CompanyValue[]> => {
  const response = await api.get<CompanyValue[]>(
    `/companies/${companyId}/values`,
  )

  return response.data
}

/**
 * Get user's current balance from the wallets service.
 * This endpoint retrieves the balance as managed by the wallets API.
 */
export const getUserBalance = async (): Promise<UserBalance> => {
  const response = await api.get<UserBalance>('/wallets/balance')
  return response.data
}

/**
 * Get user's current balance from the users service.
 * This endpoint retrieves the balance as managed by the users API and may include additional user-specific logic.
 */
export const getMyBalance = async (): Promise<UserBalance> => {
  const response = await api.get<UserBalance>('/users/me/get-my-balance')
  return response.data
}
