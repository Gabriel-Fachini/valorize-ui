import React from 'react'
import { ProfileForm } from '@/components/settings/ProfileForm'
import { PreferencesForm } from '@/components/settings/PreferencesForm'
import { AddressTab } from '@/components/settings/AddressTab'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { PageLayout } from '@/components/layout/PageLayout'

type TabKey = 'profile' | 'preferences' | 'addresses'

interface TabConfig {
  key: TabKey
  label: string
  icon: string
  description: string
}

const TABS: TabConfig[] = [
  {
    key: 'profile',
    label: 'Perfil',
    icon: '👤',
    description: 'Gerencie suas informações pessoais',
  },
  {
    key: 'preferences',
    label: 'Preferências',
    icon: '⚙️',
    description: 'Personalize sua experiência',
  },
  {
    key: 'addresses',
    label: 'Endereços',
    icon: '📍',
    description: 'Gerencie endereços de entrega',
  },
]

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<TabKey>('profile')
  const { startTour, resetTour, hasCompletedOnboarding } = useOnboarding()

  const handleStartTour = () => {
    if (hasCompletedOnboarding) {
      resetTour()
    }
    startTour()
  }

  const activeTabConfig = TABS.find((tab) => tab.key === activeTab)

  return (
    <main
      id="main-content"
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Configurações
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Personalize sua conta e preferências do sistema
          </p>
        </header>

        {/* Layout with Vertical Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Vertical Tabs */}
          <aside className="lg:col-span-1">
            <nav
              data-tour="settings-tabs"
              className="sticky top-24 rounded-2xl p-2 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-xl"
              aria-label="Settings navigation"
            >
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 group ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                  aria-current={activeTab === tab.key ? 'page' : undefined}
                >
                  <span className="text-2xl">{tab.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{tab.label}</div>
                    <div
                      className={`text-xs mt-0.5 ${
                        activeTab === tab.key
                          ? 'text-white/80'
                          : 'text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'
                      }`}
                    >
                      {tab.description}
                    </div>
                  </div>
                  {activeTab === tab.key && (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3">
            <div className="rounded-2xl p-6 sm:p-8 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-xl">
              {/* Tab Header */}
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{activeTabConfig?.icon}</span>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeTabConfig?.label}
                  </h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 ml-12">
                  {activeTabConfig?.description}
                </p>
              </div>

              {/* Tab Content */}
              <div className="animate-fadeIn">
                {activeTab === 'profile' && <ProfileForm />}
                
                {activeTab === 'preferences' && (
                  <div>
                    <PreferencesForm />

                    {/* Onboarding Tour Control */}
                    <div
                      data-tour="settings-tour-control"
                      className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-3xl">🎯</span>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">Tour Interativo</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {hasCompletedOnboarding
                              ? 'Quer fazer o tour novamente? Clique no botão abaixo para reiniciar.'
                              : 'Inicie o tour para conhecer melhor o Valorize.'}
                          </p>
                          <button
                            type="button"
                            onClick={handleStartTour}
                            className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                          >
                            {hasCompletedOnboarding ? '🔄 Reiniciar Tour' : '🎯 Iniciar Tour'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'addresses' && <AddressTab />}
              </div>
            </div>
          </main>
        </div>
      </div>
    </main>
  )
}

export default SettingsPage
