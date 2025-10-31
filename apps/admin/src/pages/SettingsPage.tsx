import { type FC, useEffect, useState } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { SettingsTabs } from '@/components/settings/SettingsTabs'
import { ErrorModal } from '@/components/ui/ErrorModal'
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
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)

  useEffect(() => {
    loadCompanySettings()
  }, [])

  const loadCompanySettings = async () => {
    setIsLoading(true)
    setError(undefined)
    setIsErrorModalOpen(false)

    try {
      const data = await companyService.getCompanySettings()
      setCompany(data)
    } catch (err) {
      console.error('Error loading company settings:', err)
      const errorMessage =
        'Erro ao carregar configurações da empresa. Tente novamente.'
      setError(errorMessage)
      setIsErrorModalOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setIsErrorModalOpen(false)
    setError(undefined)
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
            Gerencie as configurações globais da sua empresa, incluindo
            informações básicas, domínios de SSO e economia de moedas.
          </p>
        </div>

        {/* Settings Tabs */}
        <SettingsTabs company={company} isLoading={isLoading} />
      </div>

      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={handleCloseModal}
        onRetry={loadCompanySettings}
        title="Ocorreu um Erro"
        message={
          error || 'Algo deu errado. Por favor, tente novamente mais tarde.'
        }
      />
    </PageLayout>
  )
}
