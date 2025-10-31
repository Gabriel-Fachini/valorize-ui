import { api } from './api'
import type { Company, CompanySettings } from '../types/company'

/**
 * Company service for managing company settings
 * Implements endpoints for FAC-82
 */
export const companyService = {
  /**
   * Fetch current company settings
   *
   * Endpoint: GET /admin/company/settings
   *
   * Returns company configuration including:
   * - Basic info (name, logo)
   * - Allowed domains for SSO
   * - Coin economy settings
   */
  async getCompanySettings(): Promise<Company> {
    const response = await api.get<Company>('/admin/company/settings')
    return response.data
  },

  /**
   * Update company settings
   *
   * Endpoint: PUT /admin/company/settings
   *
   * Updates company configuration with new values
   */
  async updateCompanySettings(settings: CompanySettings): Promise<Company> {
    const response = await api.put<Company>('/admin/company/settings', settings)
    return response.data
  },

  /**
   * Update only basic info (name and logo)
   *
   * Endpoint: PATCH /admin/company/settings/basic-info
   *
   * Partial update for basic information
   */
  async updateBasicInfo(data: { name: string; logo_url?: string }): Promise<Company> {
    const response = await api.patch<Company>('/admin/company/settings/basic-info', data)
    return response.data
  },

  /**
   * Update allowed domains for SSO
   *
   * Endpoint: PATCH /admin/company/settings/domains
   *
   * Updates the list of allowed domains for Google SSO
   */
  async updateDomains(domains: string[]): Promise<Company> {
    const response = await api.patch<Company>('/admin/company/settings/domains', { domains })
    return response.data
  },

  /**
   * Update coin economy settings
   *
   * Endpoint: PATCH /admin/company/settings/coin-economy
   *
   * Updates weekly renewal amount and day
   */
  async updateCoinEconomy(data: { weekly_renewal_amount: number; renewal_day: number }): Promise<Company> {
    const response = await api.patch<Company>('/admin/company/settings/coin-economy', data)
    return response.data
  },

  /**
   * Upload company logo
   *
   * Endpoint: POST /admin/company/logo
   *
   * Uploads logo file and returns the URL
   * Accepts: PNG, JPG, SVG
   * Max size: 1MB
   */
  async uploadLogo(file: File): Promise<{ logo_url: string }> {
    const formData = new FormData()
    formData.append('logo', file)

    const response = await api.post<{ logo_url: string }>('/admin/company/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  },
}
