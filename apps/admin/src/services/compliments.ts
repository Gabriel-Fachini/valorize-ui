import { api } from './api'
import type {
  ComplimentsDashboardFilters,
  ComplimentsDashboardResponse,
  NetworkGraphData,
  NetworkFilters,
  ExportDashboardPayload,
} from '@/types/compliments'

/**
 * Compliments Service
 * Handles all API calls related to compliments analytics and dashboard
 */
export const complimentsService = {
  /**
   * Get complete dashboard data with all analytics
   * GET /admin/compliments-dashboard
   *
   * Query Parameters:
   * - startDate: Data inicial (default: últimos 30 dias)
   * - endDate: Data final (default: hoje)
   * - departmentId: Filtro por departamento
   * - jobTitleId: Filtro por cargo
   */
  getDashboard: async (
    params?: ComplimentsDashboardFilters
  ): Promise<ComplimentsDashboardResponse> => {
    const { data } = await api.get<ComplimentsDashboardResponse>(
      '/admin/compliments-dashboard',
      { params }
    )
    return data
  },

  /**
   * Get network graph data for visualization
   * GET /admin/compliments-dashboard/network
   *
   * Query Parameters:
   * - startDate (string, YYYY-MM-DD): Data inicial (default: 30 dias atrás)
   * - endDate (string, YYYY-MM-DD): Data final (default: hoje)
   * - department (string): Filtrar por nome do departamento
   * - minConnections (number, min: 1): Mínimo de elogios totais
   * - limit (number, min: 1, max: 100): Máximo de nodes (default: 50)
   * - userIds (string): Lista de IDs separados por vírgula
   */
  getNetwork: async (params?: NetworkFilters): Promise<NetworkGraphData> => {
    const { data } = await api.get<NetworkGraphData>(
      '/admin/compliments-dashboard/network',
      { params }
    )
    return data
  },

  /**
   * Export dashboard data
   * POST /admin/compliments-export
   */
  exportDashboard: async (payload: ExportDashboardPayload): Promise<Blob> => {
    const { data } = await api.post<Blob>(
      '/admin/compliments-export',
      payload,
      {
        responseType: 'blob',
      }
    )
    return data
  },
}
