import React, { createContext, useEffect } from 'react'
import { TourProvider, type StepType, useTour as useReactTour } from '@reactour/tour'

export interface OnboardingContextType {
  startTour: () => void
  completeTour: () => void
  resetTour: () => void
  hasCompletedOnboarding: boolean
}

export const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

const ONBOARDING_STORAGE_KEY = 'valorize_onboarding_completed'
const FEEDBACK_FORM_URL = 'https://forms.google.com/your-feedback-form-url'

// Initial tour steps configuration
const tourSteps: StepType[] = [
  {
    selector: '[data-tour="welcome"]',
    content: 'Bem vindo ao Valorize! Vamos fazer um tour rápido para ajudá-lo a começar.',
    position: 'center',
  },
  {
    selector: '[data-tour="sidebar"]',
    content: 'Esta é a sua barra de navegação. Use-a para acessar diferentes seções do aplicativo.',
    position: 'right',
  },
  {
    selector: '[data-tour="home"]',
    content: 'Aqui você pode ver um resumo das suas atividades recentes e estatísticas importantes.',
    position: 'right',
  },
  {
    selector: '[data-tour="praises"]',
    content: 'Aqui você pode visualizar e enviar elogios aos seus colegas de equipe.',
    position: 'right',
  },
  {
    selector: '[data-tour="transactions"]',
    content: 'Acompanhe todas as suas transações e movimentações de moedas no sistema.',
    position: 'right',
  },
  {
    selector: '[data-tour="transactions-page"]',
    content: 'Aqui você pode ver o histórico detalhado de todas as suas transações, incluindo recebimentos e gastos de moedas.',
    position: 'bottom',
  },
  {
    selector: '[data-tour="prizes"]',
    content: 'Confira os prêmios disponíveis que você pode resgatar com seus pontos.',
    position: 'right',
  },
  {
    selector: '[data-tour="redemptions"]',
    content: 'Veja o histórico dos prêmios que você já resgatou e o status das suas solicitações.',
    position: 'right',
  },
  {
    selector: '[data-tour="redemptions-page"]',
    content: 'Monitore o status dos seus resgates, filtre por período e status, e veja todos os prêmios que você já conquistou.',
    position: 'bottom',
  },
  {
    selector: '[data-tour="profile"]',
    content: 'Acesse seu perfil e suas preferências aqui.',
    position: 'right',
  },
  {
    selector: '#tour-completion-modal', // Non-existent element to create modal effect
    content: ({ setIsOpen }: { setIsOpen: (open: boolean) => void }) => (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          🎉 Parabéns! Tour Concluído
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Você concluiu o tour do Valorize! Agora você está pronto para começar a usar todas as funcionalidades.
        </p>
        <div className="pt-4 space-y-3">
          <a
            href={FEEDBACK_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-4 py-3 text-center text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
          >
            📝 Enviar Feedback sobre o Tour
          </a>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    ),
    position: 'center',
    padding: 0,
    styles: {
      popover: (base: React.CSSProperties) => ({
        ...base,
        maxWidth: '450px',
        backgroundColor: 'var(--tour-bg-color)',
        padding: '32px',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        zIndex: 100000,
      }),
      maskWrapper: (base: React.CSSProperties) => ({
        ...base,
        color: '#000',
        opacity: 0.7, // Fully opaque for modal effect
        zIndex: 99999,
      }),
    },
  },
]

interface OnboardingProviderProps {
  children: React.ReactNode
}

// Inner component that uses useTour hook
const OnboardingControllerContent = ({ children }: { children: React.ReactNode }) => {
  const { setIsOpen } = useReactTour()
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = React.useState(() => {
    return localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true'
  })

  useEffect(() => {
    // Auto-start tour for first-time users after a short delay
    // Only if user is authenticated (not on login page)
    const isAuthenticated = !!localStorage.getItem('access_token')
    
    if (!hasCompletedOnboarding && isAuthenticated) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [hasCompletedOnboarding, setIsOpen])

  const startTour = () => {
    setIsOpen(true)
  }

  const completeTour = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true')
    setHasCompletedOnboarding(true)
    setIsOpen(false)
  }

  const resetTour = () => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY)
    setHasCompletedOnboarding(false)
  }

  const value: OnboardingContextType = {
    startTour,
    completeTour,
    resetTour,
    hasCompletedOnboarding,
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
  return (
    <TourProvider
      steps={tourSteps}
      styles={{
        popover: (base) => ({
          ...base,
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '450px',
          backgroundColor: 'var(--tour-bg-color)',
          color: 'var(--tour-text-color)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        }),
        maskArea: (base) => ({
          ...base,
          rx: 8,
        }),
        maskWrapper: (base) => ({
          ...base,
          color: '#000',
          opacity: 0.85,
        }),
        badge: (base) => ({
          ...base,
          backgroundColor: '#6366f1',
          color: 'white',
        }),
        controls: (base) => ({
          ...base,
          marginTop: '24px',
        }),
        close: (base) => ({
          ...base,
          right: '16px',
          top: '16px',
          color: 'var(--tour-text-color)',
          opacity: 0.8,
          transition: 'opacity 0.2s ease',
        }),
        arrow: (base) => ({
          ...base,
          color: 'white',
          borderColor: 'var(--tour-bg-color)',
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
        }),
      }}
      showBadge={true}
      showCloseButton={true}
      showNavigation={true}
      showDots={true}
      scrollSmooth={true}
      disableInteraction={false}
      onClickMask={({ setIsOpen, currentStep, steps }) => {
        // Don't close on mask click for last step (completion modal)
        if (steps && currentStep === steps.length - 1) {
          return
        }
        setIsOpen(false)
      }}
      onClickClose={({ setIsOpen, currentStep, steps }) => {
        // If on last step, mark as completed
        if (steps && currentStep === steps.length - 1) {
          localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true')
        }
        setIsOpen(false)
      }}
      afterOpen={(_target) => {
        // Optional: Add any side effects after opening
      }}
      beforeClose={(_target) => {
        // Optional: Add any side effects before closing
      }}
    >
      <OnboardingControllerContent>
        {children}
      </OnboardingControllerContent>
    </TourProvider>
  )
}

// Export hook directly from context
export const useOnboarding = (): OnboardingContextType => {
  const context = React.useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within OnboardingProvider')
  }
  return context
}
