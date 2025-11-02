import { api } from './api'
import type { DashboardData, DashboardFilters } from '../types/dashboard'

export interface DepartmentOption {
  id: string
  name: string
  userCount: number
}

export interface JobTitleOption {
  id: string
  name: string
  userCount: number
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
   * Endpoint: GET /admin/dashboard/stats
   *
   * Query Parameters:
   * - startDate (optional): ISO 8601 date (YYYY-MM-DD)
   * - endDate (optional): ISO 8601 date (YYYY-MM-DD)
   * - departmentId (optional): Department UUID
   * - jobTitleId (optional): Job Title UUID
   *
   * Returns:
   * - Period information
   * - Metrics (total compliments, coins, active users, prizes, engagement)
   * - Weekly compliments trend
   * - Top 5 values ranking
   *
   * Default behavior: Last 30 days if no date range provided
   */
  async getDashboardData(filters?: DashboardFilters): Promise<DashboardData> {
    const response = (
      await api.get<DashboardData>('/admin/dashboard/stats', {
        params: filters,
      })
    ).data

    return response
  },

  /**
   * Fetch all departments in the company
   *
   * Endpoint: GET /admin/dashboard/departments
   *
   * Returns: Array of departments with id, name, and user count
   */
  async getDepartments(): Promise<DepartmentOption[]> {
    const response = (await api.get<DepartmentOption[]>('/admin/dashboard/departments')).data
    return response
  },

  /**
   * Fetch all job titles in the company
   *
   * Endpoint: GET /admin/dashboard/job-titles
   *
   * Returns: Array of job titles with id, name, and user count
   */
  async getJobTitles(): Promise<JobTitleOption[]> {
    const response = (await api.get<JobTitleOption[]>('/admin/dashboard/job-titles')).data
    return response
  },

  /**
   * Fetch job titles filtered by department
   *
   * Endpoint: GET /job-titles/by-department
   *
   * Query Parameters:
   * - departmentId (required): Department UUID
   *
   * Returns: Array of job titles with id, name, and user count for the specified department
   */
  async getJobTitlesByDepartment(departmentId: string): Promise<JobTitleOption[]> {
    const response = (
      await api.get<JobTitleOption[]>('/job-titles/by-department', {
        params: { departmentId },
      })
    ).data
    return response
  },
}
