import React from 'react'
import { Button } from '@/components/ui/button'

interface SettingsTourControlProps {
  hasCompletedOnboarding: boolean
  onStartTour: () => void
}

export const SettingsTourControl: React.FC<SettingsTourControlProps> = ({
  hasCompletedOnboarding,
  onStartTour,
}) => {
  return (
    <div
      data-tour="settings-tour-control"
      className="rounded-xl border border-neutral-200 dark:border-neutral-700/50 bg-neutral-50/50 dark:bg-neutral-900/30 p-6"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
          <i className="ph ph-compass text-2xl text-green-600 dark:text-green-400" />
        </div>
        <div className="flex-1">
          <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
            Tour Interativo
          </h3>
          <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
            {hasCompletedOnboarding
              ? 'Quer fazer o tour novamente? Clique no botão abaixo para reiniciar.'
              : 'Inicie o tour para conhecer melhor o Valorize.'}
          </p>
          <Button
            type="button"
            onClick={onStartTour}
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20"
          >
            <i className={`ph ${hasCompletedOnboarding ? 'ph-arrow-clockwise' : 'ph-play'}`} />
            {hasCompletedOnboarding ? 'Reiniciar Tour' : 'Iniciar Tour'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SettingsTourControl
