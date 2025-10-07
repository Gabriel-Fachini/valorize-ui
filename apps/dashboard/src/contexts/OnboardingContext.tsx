import React, { createContext, useEffect, useState, useRef, useContext, useCallback } from 'react'
import { TourProvider, type StepType, useTour as useReactTour } from '@reactour/tour'
import { useSidebar } from '@/hooks/useSidebar'
import { useAuth } from '@/hooks/useAuth'

export interface OnboardingContextType {
  startTour: () => void
  completeTour: () => void
  resetTour: () => void
  hasCompletedOnboarding: boolean
  handleRouteChange: (pathname: string) => void
}

export const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

const ONBOARDING_STORAGE_KEY = 'valorize_onboarding_completed'
const FEEDBACK_FORM_URL = 'https://forms.google.com/your-feedback-form-url'

// Mapeamento entre os steps do tour e as rotas esperadas
export const STEP_TO_ROUTE_MAP: Record<number, string> = {
  3: '/home',           // Step 3: clique em "home"
  4: '/elogios',        // Step 4: clique em "praises"
  // Steps 5, 6, 7 ficam na página de elogios
  8: '/transacoes',     // Step 8: clique em "transactions"
  // Steps 9, 10, 11 ficam na página de transações
  12: '/prizes',        // Step 12: clique em "prizes"
  // Steps 13, 14 ficam na página de prêmios
  15: '/resgates',      // Step 15: clique em "redemptions"
  // Steps 16, 17, 18 ficam na página de resgates
  19: '/settings',      // Step 19: clique em "settings"
  // Steps 20, 21 ficam na página de configurações
  // Step 22: completion modal
}

// Helper function to get selector based on screen size
// Esta função verifica o tamanho da tela em tempo real para garantir o seletor correto
const getSelectorForDevice = (tourAttr: string, isMobile?: boolean) => {
  // Elementos que estão APENAS na sidebar (não nas páginas)
  const sidebarElements = ['balance-cards', 'home', 'praises', 'transactions', 'prizes', 'redemptions', 'profile']
  
  if (sidebarElements.includes(tourAttr)) {
    // Usa o parâmetro ou verifica o tamanho da tela em tempo real
    const isMobileNow = isMobile ?? (typeof window !== 'undefined' && window.innerWidth < 1024)
    
    if (isMobileNow) {
      // Em mobile (<1024px), usa a sidebar mobile
      const selector = `#mobile-sidebar [data-tour="${tourAttr}"]`
      return selector
    } else {
      // Em desktop (>=1024px), usa a sidebar desktop
      const selector = `aside[role="complementary"] [data-tour="${tourAttr}"]`
      return selector
    }
  }
  
  // Para outros elementos (páginas), usa seletor simples
  const selector = `[data-tour="${tourAttr}"]`
  return selector
}

// Function to generate tour steps based on current screen size
const getTourSteps = (): StepType[] => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024
  
  return [
  {
    selector: '[data-tour="welcome"]',
    content: 'Bem vindo ao Valorize! Vamos fazer um tour rápido para ajudá-lo a começar.',
    position: 'center',
  },
  {
    selector: isMobile ? '#mobile-sidebar' : 'aside[role="complementary"]',
    content: 'Esta é a sua barra de navegação. Use-a para acessar diferentes seções do aplicativo. Clique nos itens da barra para navegar durante o tour!',
    position: 'right',
  },
  {
    selector: getSelectorForDevice('balance-cards', isMobile),
    content: 'Aqui estão seus saldos! 🎁 Moedas para Elogiar (renovam toda semana) e ✨ Moedas Resgatáveis (acumuladas dos elogios recebidos).',
    position: 'bottom',
  },
  {
    selector: getSelectorForDevice('home', isMobile),
    content: '👆 Clique em "Início" para conhecer a página inicial',
    position: 'right',
    stepInteraction: true,
  },
  {
    selector: getSelectorForDevice('praises', isMobile),
    content: '👆 Clique em "Elogios" para conhecer o sistema de reconhecimento',
    position: 'right',
    stepInteraction: true,
  },
  {
    selector: '[data-tour="praises-stats"]',
    content: 'Aqui você vê suas estatísticas: elogios enviados, recebidos e total de pontos acumulados! 📊',
    position: 'bottom',
  },
  {
    selector: '[data-tour="praises-feed"]',
    content: 'Este é o feed de reconhecimentos. Você pode ver todos os elogios, filtrar por enviados ou recebidos, e interagir com as postagens. 💬',
    position: 'top',
  },
  {
    selector: '[data-tour="praises-fab"]',
    content: 'Use este botão flutuante para enviar elogios rapidamente! Reconheça seus colegas em poucos cliques. ✨',
    position: 'left',
  },
  {
    selector: getSelectorForDevice('transactions', isMobile),
    content: '👆 Clique em "Transações" para explorar seu histórico financeiro',
    position: 'right',
    stepInteraction: true,
  },
  {
    selector: '[data-tour="transactions-page"]',
    content: 'Esta é sua página de transações! Aqui você vê todas as movimentações de moedas: elogios enviados, recebidos e resgates de prêmios. 💰',
    position: 'bottom',
  },
  {
    selector: '[data-tour="transactions-balance"]',
    content: 'Resumo dos seus saldos atuais. As moedas para elogiar renovam semanalmente, enquanto as resgatáveis acumulam conforme você recebe reconhecimentos! 📊',
    position: 'bottom',
  },
  {
    selector: '[data-tour="transactions-feed"]',
    content: 'Aqui está todo o histórico de transações! Você pode filtrar por tipo de moeda (elogios ou resgates) e por período. Use "Carregar mais" para ver transações antigas. 📋',
    position: 'left',
  },
  {
    selector: getSelectorForDevice('prizes', isMobile),
    content: '👆 Clique em "Prêmios" para ver o que você pode resgatar',
    position: 'right',
    stepInteraction: true,
  },
  {
    selector: '[data-tour="prizes-grid"]',
    content: 'Navegue pelos prêmios disponíveis! Clique em um produto para ver detalhes completos e fazer o resgate. 🎁',
    position: 'top',
  },
  {
    selector: '[data-tour="prizes-filters"]',
    content: 'Use os filtros para encontrar prêmios por categoria, faixa de preço ou busca por nome. Você pode ordenar por novidades, preço ou nome. 🔍',
    position: 'bottom',
  },
  {
    selector: getSelectorForDevice('redemptions', isMobile),
    content: '👆 Clique em "Resgates" para acompanhar seus prêmios',
    position: 'right',
    stepInteraction: true,
  },
  {
    selector: '[data-tour="redemptions-page"]',
    content: 'Esta é sua página de resgates! Aqui você acompanha todos os prêmios que resgatou e o status de processamento de cada um. 📦',
    position: 'bottom',
  },
  {
    selector: '[data-tour="redemptions-filters"]',
    content: 'Use estes filtros para encontrar resgates específicos! Você pode buscar por nome do produto, filtrar por status (pendente, processando, concluído, cancelado) e por período. 🔍',
    position: 'bottom',
  },
  {
    selector: '[data-tour="redemptions-list"]',
    content: 'Aqui está a lista dos seus resgates! Cada card mostra o produto, valor gasto, data e status atual. Clique em um resgate para ver detalhes completos e a timeline de rastreamento! 📋',
    position: 'top',
  },
  {
    selector: getSelectorForDevice('profile', isMobile),
    content: '👆 Clique em "Configurações" para personalizar sua experiência',
    position: 'right',
    stepInteraction: true,
  },
  {
    selector: '[data-tour="settings-tabs"]',
    content: 'Aqui você pode editar seu perfil, ajustar preferências de tema e acessibilidade, e gerenciar endereços de entrega. ⚙️',
    position: 'bottom',
  },
  {
    selector: '[data-tour="settings-tour-control"]',
    content: 'Sempre que quiser refazer este tour, volte aqui e clique em "Reiniciar Tour"! 🔄',
    position: 'top',
  },
  {
    selector: '#tour-completion-modal', // Non-existent element to create modal effect
    content: () => (
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
            onClick={() => {
              window.dispatchEvent(new CustomEvent('onboarding:complete'))
            }}
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
        zIndex: 100, // Modal de conclusão acima de tudo
      }),
      maskWrapper: (base: React.CSSProperties) => ({
        ...base,
        color: '#000',
        opacity: 0.7, // Fully opaque for modal effect
        zIndex: 90, // Máscara do modal de conclusão
      }),
    },
  },
]
}

interface OnboardingProviderProps {
  children: React.ReactNode
}

// Helper para detectar se está em mobile
const isMobile = () => {
  return window.innerWidth < 1024 // lg breakpoint do Tailwind
}

// Inner component that uses useTour hook
const OnboardingControllerContent = ({ children }: { children: React.ReactNode }) => {
  const { setIsOpen, currentStep, setCurrentStep, isOpen, setSteps } = useReactTour()
  const { setMobileSidebarOpen } = useSidebar()
  const { user, isLoading } = useAuth()
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true'
  })
  const autoStartTimeoutRef = useRef<number | undefined>(undefined)
  
  // Rastreia a rota anterior para detectar mudanças
  const previousRouteRef = useRef<string>('')
  
  // Atualiza os steps sempre que o tour abre ou o tamanho da tela muda
  useEffect(() => {
    if (isOpen && setSteps) {
      const updatedSteps = getTourSteps()
      setSteps(updatedSteps)
      
      // Aguarda um pouco antes de verificar (para dar tempo de renderizar)
    setTimeout(() => {
      updatedSteps.forEach((step) => {
        if (typeof step.selector === 'string') {
          document.querySelector(step.selector)
        }
      })
    }, 500)
    }
  }, [isOpen, setSteps])
  
  // Listener para atualizar steps quando a tela mudar de tamanho
  useEffect(() => {
    if (!isOpen || !setSteps) return
    
    const handleResize = () => {
      const updatedSteps = getTourSteps()
      setSteps(updatedSteps)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen, setSteps])

  // Function to handle route changes from outside
  const handleRouteChange = (pathname: string) => {
    if (!isOpen) return

    const expectedRoute = STEP_TO_ROUTE_MAP[currentStep]
    
    // Só avança se:
    // 1. Existe uma rota esperada para o step atual
    // 2. A rota atual corresponde à esperada
    // 3. A rota MUDOU (não estava na rota esperada antes)
    if (
      expectedRoute && 
      pathname === expectedRoute && 
      previousRouteRef.current !== expectedRoute
    ) {
      // Aguarda um pouco para dar tempo do elemento aparecer na nova página
      // Timeout maior em mobile para garantir renderização completa
      const delay = window.innerWidth < 1024 ? 500 : 300
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        
        // Força atualização dos steps após navegar para nova página
        // Isso garante que o Reactour reprocesse os seletores e encontre os elementos que agora existem
        if (setSteps) {
          const refreshedSteps = getTourSteps()
          setSteps(refreshedSteps)
        }
        
        // Verificar se o próximo elemento existe após avançar
        setTimeout(() => {
          const nextStep = currentStep + 1
          const steps = getTourSteps()
          if (steps[nextStep] && typeof steps[nextStep].selector === 'string') {
            const selector = steps[nextStep].selector as string
            document.querySelector(selector)
          }
        }, 300)
      }, delay)
    }
    
    // Atualiza a rota anterior
    previousRouteRef.current = pathname
  }

  useEffect(() => {
    if (autoStartTimeoutRef.current !== undefined) {
      window.clearTimeout(autoStartTimeoutRef.current)
      autoStartTimeoutRef.current = undefined
    }

    if (isLoading || !user || hasCompletedOnboarding) {
      return undefined
    }

    autoStartTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(true)
      if (isMobile()) {
        setMobileSidebarOpen(true)
      }
    }, 1500)

    return () => {
      if (autoStartTimeoutRef.current !== undefined) {
        window.clearTimeout(autoStartTimeoutRef.current)
        autoStartTimeoutRef.current = undefined
      }
    }
  }, [hasCompletedOnboarding, isLoading, user, setIsOpen, setMobileSidebarOpen])

  useEffect(() => {
    if (isLoading) {
      return
    }
    if (!user && isOpen) {
      setIsOpen(false)
      if (isMobile()) {
        setMobileSidebarOpen(false)
      }
    }
  }, [isLoading, user, isOpen, setIsOpen, setMobileSidebarOpen])

  // Gerenciar a sidebar mobile durante o tour
  useEffect(() => {
    if (!isOpen) return

    // Steps que precisam da sidebar aberta (sidebar, balance-cards, e todos os steps de navegação)
    const stepsThatNeedSidebar = [1, 2, 3, 4, 8, 12, 15, 19]
    
    if (isMobile()) {
      if (stepsThatNeedSidebar.includes(currentStep)) {
        // Abrir a sidebar se estiver em um step que precisa dela
        setMobileSidebarOpen(true)
      } else if (currentStep > 4 && !stepsThatNeedSidebar.includes(currentStep)) {
        // Fechar a sidebar nos steps que não precisam dela (mas só depois do step 4)
        setMobileSidebarOpen(false)
      }
    }
  }, [currentStep, isOpen, setMobileSidebarOpen])

  const startTour = useCallback(() => {
    setIsOpen(true)
    // Se estiver em mobile, abrir a sidebar automaticamente
    if (isMobile()) {
      setMobileSidebarOpen(true)
    }
  }, [setIsOpen, setMobileSidebarOpen])

  const completeTour = useCallback(() => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true')
    setHasCompletedOnboarding(true)
    setIsOpen(false)
    // Fechar a sidebar mobile ao completar o tour
    if (isMobile()) {
      setMobileSidebarOpen(false)
    }
  }, [setIsOpen, setHasCompletedOnboarding, setMobileSidebarOpen])

  const resetTour = useCallback(() => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY)
    setHasCompletedOnboarding(false)
  }, [setHasCompletedOnboarding])

  // Listen for completion event from modal
  useEffect(() => {
    const handleComplete = () => {
      completeTour()
    }
    
    window.addEventListener('onboarding:complete', handleComplete)
    return () => window.removeEventListener('onboarding:complete', handleComplete)
  }, [completeTour])

  const value: OnboardingContextType = {
    startTour,
    completeTour,
    resetTour,
    hasCompletedOnboarding,
    handleRouteChange,
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
  // Steps que NÃO requerem clique do usuário (mostram botões de navegação)
  // Incluem: welcome, sidebar, balance-cards, e todos os steps informativos dentro das páginas
  const stepsWithNavigation = [0, 1, 2, 5, 6, 7, 9, 10, 11, 13, 14, 16, 17, 18, 20, 21, 22] 
  // 0: welcome
  // 1: sidebar
  // 2: balance-cards
  // 5: praises-stats, 6: praises-feed, 7: praises-fab
  // 9: transactions-page, 10: transactions-balance, 11: transactions-feed
  // 13: prizes-filters, 14: prizes-grid
  // 16: redemptions-page, 17: redemptions-filters, 18: redemptions-list
  // 20: settings-tabs, 21: settings-tour-control
  // 22: completion modal

  // Helper para detectar se está em mobile
  const isMobileDevice = () => window.innerWidth < 1024
  
  return (
    <TourProvider
      steps={getTourSteps()}
      styles={{
        popover: (base) => ({
          ...base,
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '450px',
          backgroundColor: 'var(--tour-bg-color)',
          color: 'var(--tour-text-color)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
          zIndex: 60, // Acima de tudo (maskArea: 56, maskWrapper: 55, sidebar: 50)
        }),
        maskArea: (base) => ({
          ...base,
          rx: 8,
          zIndex: 56, // Acima da máscara e da sidebar - elemento destacado
        }),
        maskWrapper: (base) => ({
          ...base,
          color: '#000',
          opacity: 0.85,
          zIndex: 55, // Acima da sidebar mobile (z-50) para cobri-la
        }),
        badge: (base) => ({
          ...base,
          backgroundColor: '#6366f1',
          color: 'white',
        }),
        controls: (base, state) => {
          // Esconde os controles nos steps que requerem clique
          const currentStep = state?.currentStep ?? 0
          const shouldHide = !stepsWithNavigation.includes(currentStep)
          return {
            ...base,
            marginTop: '24px',
            display: shouldHide ? 'none' : 'flex',
          }
        },
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
      beforeClose={(_target) => {
        // Fechar a sidebar mobile quando o tour for fechado
        if (isMobileDevice()) {
          // Usar timeout para garantir que a ação seja executada após o tour fechar
          setTimeout(() => {
            const event = new CustomEvent('onboarding:close-mobile-sidebar')
            window.dispatchEvent(event)
          }, 100)
        }
      }}
      afterOpen={(_target) => {
        // Optional: Add any side effects after opening
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
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within OnboardingProvider')
  }
  return context
}
