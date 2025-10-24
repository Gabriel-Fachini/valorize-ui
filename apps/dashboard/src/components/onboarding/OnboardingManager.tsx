import React, { useState, useEffect, useCallback } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { JoyrideTour } from './JoyrideTour'
import { getSidebarOnboardingSteps } from './onboardingSteps'
import { useOnboarding, type OnboardingStep } from '@/hooks/useOnboarding'
import { useSidebar } from '@/hooks/useSidebar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LottieAnimation } from '@/components/ui/LottieAnimation'

// LocalStorage keys
const ONBOARDING_COMPLETED_KEY = 'valorize_onboarding_completed'
const ONBOARDING_SKIPPED_KEY = 'valorize_onboarding_skipped'

interface OnboardingManagerProps {
  onComplete?: () => void
  onSkip?: () => void
  autoStart?: boolean
  showWelcomeMessage?: boolean
}

export const OnboardingManager: React.FC<OnboardingManagerProps> = ({
  onComplete,
  onSkip,
  autoStart = false,
  showWelcomeMessage = true,
}) => {
  const [currentTour, setCurrentTour] = useState<boolean>(false)
  // Initialize showWelcome based on localStorage to prevent flash
  const [showWelcome, setShowWelcome] = useState(() => {
    const isCompleted = localStorage.getItem(ONBOARDING_COMPLETED_KEY) === 'true'
    const wasSkipped = localStorage.getItem(ONBOARDING_SKIPPED_KEY) === 'true'
    // Only show welcome message if user hasn't completed or skipped AND prop is true
    return showWelcomeMessage && !isCompleted && !wasSkipped
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { isRunning, startTour, stopTour } = useOnboarding()
  const { setMobileSidebarOpen } = useSidebar()

  // Detect mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const welcomeAnimation = useSpring({
    opacity: showWelcome ? 1 : 0,
    transform: showWelcome ? 'translateY(0px)' : 'translateY(-20px)',
    config: { tension: 300, friction: 30 },
  })

  const successAnimation = useSpring({
    opacity: showSuccess ? 1 : 0,
    transform: showSuccess ? 'translateY(0px) scale(1)' : 'translateY(20px) scale(0.9)',
    config: { tension: 300, friction: 30 },
  })

  const handleStartSidebarTour = useCallback(() => {
    setCurrentTour(true)
    setShowWelcome(false)
    
    // Open mobile sidebar if on mobile device
    if (isMobile) {
      setMobileSidebarOpen(true)
    }
    
    startTour()
  }, [startTour, isMobile, setMobileSidebarOpen])


  const handleTourComplete = () => {
    setCurrentTour(false)
    stopTour()
    
    // Close mobile sidebar when tour ends
    if (isMobile) {
      setMobileSidebarOpen(false)
    }
    
    // Save completion status to localStorage
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true')
    localStorage.removeItem(ONBOARDING_SKIPPED_KEY) // Remove skip flag if it exists
    
    setShowSuccess(true)
    onComplete?.()
  }

  const handleTourSkip = () => {
    setCurrentTour(false)
    stopTour()
    
    // Close mobile sidebar when tour is skipped
    if (isMobile) {
      setMobileSidebarOpen(false)
    }
    
    // Mark onboarding as completed when skipped
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true')
    localStorage.setItem(ONBOARDING_SKIPPED_KEY, 'true')
    
    onSkip?.()
  }

  const handleCloseWelcome = () => {
    setShowWelcome(false)
    
    // Mark onboarding as completed when user closes welcome message
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true')
    localStorage.setItem(ONBOARDING_SKIPPED_KEY, 'true')
    
    onSkip?.()
  }

  const handleCloseSuccess = () => {
    setShowSuccess(false)
  }

  useEffect(() => {
    if (autoStart) {
      // Check if user already completed or skipped onboarding
      const isCompleted = localStorage.getItem(ONBOARDING_COMPLETED_KEY) === 'true'
      const wasSkipped = localStorage.getItem(ONBOARDING_SKIPPED_KEY) === 'true'
      
      // Only auto-start if user hasn't completed or skipped
      if (!isCompleted && !wasSkipped) {
        const timer = setTimeout(() => {
          handleStartSidebarTour()
        }, 1000)
        return () => clearTimeout(timer)
      }
    }
    return undefined
  }, [autoStart, handleStartSidebarTour])

  const getCurrentSteps = (): OnboardingStep[] => {
    return getSidebarOnboardingSteps(isMobile)
  }

  return (
    <>
      {/* Welcome Message */}
      {showWelcome && (
        <animated.div
          style={welcomeAnimation}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <Card className="bg-white dark:bg-neutral-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl border border-neutral-200 dark:border-neutral-700">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4">
                <LottieAnimation
                  path="/animations/happy-face.json"
                  loop={true}
                  autoplay={true}
                  speed={1}
                  className="w-full h-full"
                />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                Bem-vindo ao Valorize!
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                Vamos fazer um tour rápido para você conhecer todas as funcionalidades da plataforma.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={handleStartSidebarTour}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  <i className="ph ph-rocket-launch" />
                  Iniciar Tour
                </Button>
                <Button
                  onClick={handleCloseWelcome}
                  variant="ghost"
                  className="w-full text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Pular por enquanto
                </Button>
              </div>
            </div>
          </Card>
        </animated.div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <animated.div
          style={successAnimation}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <Card className="bg-white dark:bg-neutral-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl border border-neutral-200 dark:border-neutral-700 relative">
            {/* Close button */}
            <button
              onClick={handleCloseSuccess}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              aria-label="Fechar mensagem de sucesso"
            >
              <i className="ph ph-x" style={{ fontSize: '16px' }} />
            </button>
            
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4">
                <LottieAnimation
                  path="/animations/party.json"
                  loop={true}
                  autoplay={true}
                  speed={1}
                  scale={1.2}
                  className="w-full h-full"
                />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                Tour Concluído!
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                Parabéns! Você agora conhece todas as funcionalidades do Valorize. 
                Comece a usar a plataforma e reconheça o trabalho dos seus colegas!
              </p>
              <Button
                onClick={handleCloseSuccess}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <i className="ph ph-rocket-launch" />
                Começar a Usar
              </Button>
            </div>
          </Card>
        </animated.div>
      )}

      {/* Tour Component */}
      {currentTour && (
        <JoyrideTour
          steps={getCurrentSteps()}
          isRunning={isRunning}
          onComplete={handleTourComplete}
          onSkip={handleTourSkip}
          onStopTour={stopTour}
          continuous={true}
          showProgress={true}
          disableCloseOnEsc={false}
          disableOverlayClose={false}
          hideBackButton={false}
          locale={{
            back: 'Voltar',
            close: 'Fechar',
            last: 'Finalizar',
            next: 'Próximo',
            step: 'Passo',
            skip: 'Pular',
            finish: 'Concluir',
          }}
        />
      )}
    </>
  )
}

export default OnboardingManager
