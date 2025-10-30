import { api } from './api'
import type {
  DashboardData,
  DashboardDataResponse,
} from '../types/dashboard'

/**
 * Dashboard service for fetching executive metrics
 * Implements queries from Linear task FAC-79
 *
 * ✅ Uses a SINGLE consolidated endpoint for better performance
 */
export const dashboardService = {
  /**
   * Fetch all dashboard data in a single request
   *
   * Endpoint: GET /admin/dashboard
   *
   * Returns:
   * - Metrics (last 30 days)
   * - Compliments by week (last 8 weeks)
   * - Top 5 values ranking
   *
   * This approach is better than multiple endpoints because:
   * - 1 HTTP request instead of 3+
   * - Consistent data (same timestamp)
   * - Lower latency
   * - Better UX (single loading state)
   */
  async getDashboardData(): Promise<DashboardData> {
    const response = await api.get<DashboardDataResponse>('/admin/dashboard')

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch dashboard data')
    }

    return response.data.data
  },
}
