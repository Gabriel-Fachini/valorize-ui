import { api } from './api'
import type { DashboardData, DashboardFilters } from '../types/dashboard'

export interface DepartmentOption {
  id: string
  name: string
}

export interface RoleOption {
  id: string
  name: string
}

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
  async getDashboardData(filters?: DashboardFilters): Promise<DashboardData> {
    // Pass filters as query params. Backend should accept startDate, endDate, departmentId, role
    const response = (
      await api.get<DashboardData>('/admin/dashboard/stats', {
        params: filters,
      })
    ).data

    return response
  },

  async getDepartments(): Promise<DepartmentOption[]> {
    // Assumption: backend exposes /admin/departments returning array of { id, name }
    const response = (await api.get<DepartmentOption[]>('/admin/departments')).data
    return response
  },

  async getRoles(): Promise<RoleOption[]> {
    // Assumption: backend exposes /admin/roles returning array of { id, name }
    const response = (await api.get<RoleOption[]>('/admin/roles')).data
    return response
  },
}
