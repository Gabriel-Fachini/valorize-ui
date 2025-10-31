import { type FC } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { SettingsTabs } from '@/components/settings/SettingsTabs'

/**
 * Settings Page - Company Configuration
 *
 * Página de configurações globais da empresa no painel admin.
 * Updated to use modular architecture with independent data loading per tab.
 *
 * Funcionalidades:
 * - Informações básicas (nome, logo)
 * - Domínios permitidos para SSO Google
 * - Economia de moedas (renovação semanal)
 * - Valores da empresa
 */
export const SettingsPage: FC = () => {
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

        {/* Settings Tabs - Each tab loads its own data independently */}
        <SettingsTabs />
      </div>
    </PageLayout>
  )
}
