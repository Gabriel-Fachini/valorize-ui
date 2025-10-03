import React from 'react'
import { ProfileForm } from '@/components/settings/ProfileForm'
import { PreferencesForm } from '@/components/settings/PreferencesForm'
import { AddressTab } from '@/components/settings/AddressTab'
import { useOnboarding } from '@/contexts/OnboardingContext'

type TabKey = 'profile' | 'preferences' | 'addresses'

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<TabKey>('profile')
  const { startTour, resetTour, hasCompletedOnboarding } = useOnboarding()

  const handleStartTour = () => {
    if (hasCompletedOnboarding) {
      resetTour()
    }
    startTour()
  }

  return (
    <main id="main-content" className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Configurações
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gerencie seu perfil e preferências de experiência.
          </p>
        </header>

        {/* Tabs */}
        <div data-tour="settings-tabs" className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl transition-all duration-200 border ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-lg shadow-purple-500/20'
                : 'bg-white/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 border-white/20 dark:border-gray-700/40 hover:bg-white/70 dark:hover:bg-gray-800/70'
            }`}
          >
            Perfil
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-2 rounded-xl transition-all duration-200 border ${
              activeTab === 'preferences'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-lg shadow-purple-500/20'
                : 'bg-white/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 border-white/20 dark:border-gray-700/40 hover:bg-white/70 dark:hover:bg-gray-800/70'
            }`}
          >
            Preferências
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2 rounded-xl transition-all duration-200 border ${
              activeTab === 'addresses'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-lg shadow-purple-500/20'
                : 'bg-white/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 border-white/20 dark:border-gray-700/40 hover:bg-white/70 dark:hover:bg-gray-800/70'
            }`}
          >
            Endereços
          </button>
        </div>

        {/* Tab content */}
        <section className="rounded-2xl p-6 bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/40 shadow-xl">
          {activeTab === 'profile' ? (
            <div>
              <h2 className="text-lg font-semibold mb-4">Editar Perfil</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Atualize seu nome e imagem de perfil. Seu email e empresa são exibidos para referência.
              </p>
              <ProfileForm />
            </div>
          ) : activeTab === 'preferences' ? (
            <div>
              <h2 className="text-lg font-semibold mb-4">Preferências</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Personalize tema, tamanho da fonte e opções de acessibilidade.
              </p>
              <PreferencesForm />
              
              {/* Onboarding Tour Control */}
              <div data-tour="settings-tour-control" className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-base font-semibold mb-2">Tour Interativo</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {hasCompletedOnboarding 
                    ? 'Quer fazer o tour novamente? Clique no botão abaixo para reiniciar.' 
                    : 'Inicie o tour para conhecer melhor o Valorize.'}
                </p>
                <button
                  type="button"
                  onClick={handleStartTour}
                  className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {hasCompletedOnboarding ? '🔄 Reiniciar Tour' : '🎯 Iniciar Tour'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-4">Endereços de entrega</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Cadastre endereços para receber seus prêmios. Defina um como padrão para facilitar futuros resgates.
              </p>
              <AddressTab />
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default SettingsPage
