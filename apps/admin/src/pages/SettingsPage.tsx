import { type FC, useEffect, useState } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { SettingsTabs } from '@/components/settings/SettingsTabs'
import { companyService } from '@/services/company'
import type { Company } from '@/types/company'

/**
 * Settings Page - Company Configuration
 *
 * Página de configurações globais da empresa no painel admin.
 * Task: FAC-82
 *
 * Funcionalidades:
 * - Informações básicas (nome, logo)
 * - Domínios permitidos para SSO Google
 * - Economia de moedas (renovação semanal)
 */
export const SettingsPage: FC = () => {
  const [company, setCompany] = useState<Company | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    loadCompanySettings()
  }, [])

  const loadCompanySettings = async () => {
    setIsLoading(true)
    setError(undefined)

    try {
      const data = await companyService.getCompanySettings()
      console.log('📦 Company data loaded:', data)
      setCompany(data)
    } catch (err) {
      console.error('Error loading company settings:', err)
      setError('Erro ao carregar configurações da empresa. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageLayout maxWidth="4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <i className="ph ph-gear text-primary" />
            Configurações da Empresa
          </h1>
          <p className="text-muted-foreground">
            Gerencie as configurações globais da sua empresa, incluindo informações básicas, domínios de SSO e economia de moedas.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-3">
              <i className="ph ph-warning-circle text-red-600 dark:text-red-400 text-xl" />
              <div className="flex-1">
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                  {error}
                </p>
                <button
                  onClick={loadCompanySettings}
                  className="text-sm text-red-600 dark:text-red-400 underline hover:no-underline mt-2"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tabs */}
        <SettingsTabs company={company} isLoading={isLoading} />
      </div>
    </PageLayout>
  )
}
