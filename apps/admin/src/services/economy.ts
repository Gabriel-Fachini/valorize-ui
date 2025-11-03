/**
 * Economy Service
 * Service layer for economy dashboard API calls
 */

import { api } from './api'
import type { EconomyDashboardData, DepositHistory } from '@/types/economy'

/**
 * Economy service for fetching economy dashboard data
 * Implements queries from Linear task FAC-93
 */
export const economyService = {
  /**
   * Fetch all economy dashboard data in a single request
   *
   * Endpoint: GET /admin/dashboard/economy
   *
   * Returns:
   * - 5 metric cards (wallet, prize fund, redeemable coins, compliment engagement, redemption rate)
   * - Alerts (prioritized)
   * - Deposit history summary
   * - Suggested deposit (if applicable)
   *
   * @returns {Promise<EconomyDashboardData>} Complete economy dashboard data
   * @throws {Error} If request fails
   */
  async getEconomyDashboard(): Promise<EconomyDashboardData> {
    const response = await api.get<EconomyDashboardData>('/admin/dashboard/economy')
    return response.data
  },

  /**
   * Fetch paginated wallet deposit history
   *
   * Endpoint: GET /admin/dashboard/economy/wallet-history
   *
   * Query Parameters:
   * - limit (optional): Number of records to return (default: 20)
   *
   * Returns:
   * - Array of deposits with pagination info
   *
   * @param {number} limit - Maximum number of deposits to return (default: 20)
   * @returns {Promise<DepositHistory>} Paginated deposit history
   * @throws {Error} If request fails
   */
  async getWalletHistory(limit: number = 20): Promise<DepositHistory> {
    const response = await api.get<DepositHistory>('/admin/dashboard/economy/wallet-history', {
      params: { limit },
    })
    return response.data
  },
}
