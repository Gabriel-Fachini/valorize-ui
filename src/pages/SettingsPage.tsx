import React from 'react'
import { ProfileForm } from '@/components/settings/ProfileForm'
import { PreferencesForm } from '@/components/settings/PreferencesForm'

type TabKey = 'profile' | 'preferences'

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<TabKey>('profile')

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
        <div className="flex gap-2 mb-6">
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
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-4">Preferências</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Personalize tema, tamanho da fonte e opções de acessibilidade.
              </p>
              <PreferencesForm />
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default SettingsPage
