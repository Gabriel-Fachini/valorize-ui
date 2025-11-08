import { api } from './api'
import type { Company, CompanySettings, CompanyInfo, CompanyDomain, CoinEconomy } from '../types/company'

/**
 * Company service for managing company settings
 * Updated to match new API endpoints structure
 */
export const companyService = {
  // ==================== Company Info ====================

  /**
   * Get company basic information
   *
   * Endpoint: GET /admin/company/info
   */
  async getCompanyInfo(): Promise<CompanyInfo> {
    const response = await api.get<CompanyInfo>('/admin/company/info')
    return response.data
  },

  /**
   * Update company basic info (name and/or logo)
   *
   * Endpoint: PATCH /admin/company/info
   */
  async updateCompanyInfo(data: { name?: string; logo_url?: string }): Promise<CompanyInfo> {
    const response = await api.patch<CompanyInfo>('/admin/company/info', data)
    return response.data
  },

  /**
   * Upload company logo as multipart/form-data
   *
   * Endpoint: POST /admin/company/info/logo
   */
  async uploadLogo(file: File): Promise<{ logo_url: string }> {
    const formData = new FormData()
    formData.append('logo', file)

    const response = await api.post<{ logo_url: string }>('/admin/company/info/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  /**
   * Delete company logo
   *
   * Endpoint: DELETE /admin/company/info/logo
   */
  async deleteLogo(): Promise<void> {
    await api.delete('/admin/company/info/logo')
  },

  // ==================== Company Domains ====================

  /**
   * Get all allowed domains for SSO
   *
   * Endpoint: GET /admin/company/domains
   */
  async getDomains(): Promise<CompanyDomain[]> {
    const response = await api.get<CompanyDomain[]>('/admin/company/domains')
    return response.data
  },

  /**
   * Replace all domains (atomic operation)
   *
   * Endpoint: PUT /admin/company/domains
   *
   * Removes all existing domains and creates new ones
   */
  async updateDomains(domains: string[]): Promise<CompanyDomain[]> {
    const response = await api.put<CompanyDomain[]>('/admin/company/domains', { domains })
    return response.data
  },

  /**
   * Add a single domain
   *
   * Endpoint: POST /admin/company/domains
   *
   * Returns 409 if domain already exists
   */
  async addDomain(domain: string): Promise<CompanyDomain> {
    const response = await api.post<CompanyDomain>('/admin/company/domains', { domain })
    return response.data
  },

  /**
   * Remove a specific domain
   *
   * Endpoint: DELETE /admin/company/domains/{id}
   *
   * Returns 400 if trying to remove last domain
   */
  async removeDomain(id: string): Promise<void> {
    await api.delete(`/admin/company/domains/${id}`)
  },

  // ==================== Coin Economy ====================

  /**
   * Get coin economy settings
   *
   * Endpoint: GET /admin/company/coin-economy
   */
  async getCoinEconomy(): Promise<CoinEconomy> {
    const response = await api.get<CoinEconomy>('/admin/company/coin-economy')
    return response.data
  },

  /**
   * Update coin economy settings
   *
   * Endpoint: PATCH /admin/company/coin-economy
   */
  async updateCoinEconomy(data: {
    weekly_renewal_amount?: number
    renewal_day?: number
  }): Promise<CoinEconomy> {
    const response = await api.patch<CoinEconomy>('/admin/company/coin-economy', data)
    return response.data
  },

  // ==================== Legacy Methods (Deprecated) ====================

  /**
   * @deprecated Use getCompanyInfo(), getDomains(), and getCoinEconomy() instead
   */
  async getCompanySettings(): Promise<Company> {
    const response = await api.get<Company>('/admin/company/settings')
    return response.data
  },

  /**
   * @deprecated Use updateCompanyInfo(), updateDomains(), and updateCoinEconomy() instead
   */
  async updateCompanySettings(settings: CompanySettings): Promise<Company> {
    const response = await api.put<Company>('/admin/company/settings', settings)
    return response.data
  },

  /**
   * @deprecated Use updateCompanyInfo() instead
   */
  async updateBasicInfo(data: { name: string; logo_url?: string }): Promise<Company> {
    const response = await api.patch<Company>('/admin/company/settings/basic-info', data)
    return response.data
  },
}
