import React, { useState } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { OnboardingManager } from './OnboardingManager'
import { Button } from '@/components/ui/button'

interface OnboardingTriggerProps {
  collapsed?: boolean
  className?: string
  variant?: 'button' | 'icon' | 'text'
}

export const OnboardingTrigger: React.FC<OnboardingTriggerProps> = ({
  collapsed = false,
  className = '',
  variant = 'button',
}) => {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const hoverStyle = useSpring({
    scale: isHovered ? 1.05 : 1,
    config: { tension: 300, friction: 20 },
  })

  const handleStartTour = () => {
    setShowOnboarding(true)
  }

  const handleComplete = () => {
    setShowOnboarding(false)
  }

  const handleSkip = () => {
    setShowOnboarding(false)
  }

  if (variant === 'icon') {
    return (
      <>
        <animated.div style={hoverStyle}>
          <Button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleStartTour}
            variant="ghost"
            className={`flex items-center justify-center ${
              collapsed ? 'h-12 w-12 mx-auto' : 'gap-4 px-4 h-12 w-full'
            } rounded-xl bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:bg-green-500/20 dark:text-green-400 dark:hover:bg-green-500/30 transition-colors ${className}`}
            title={collapsed ? 'Iniciar tour' : undefined}
            aria-label="Iniciar tour de onboarding"
          >
            <i className="ph ph-question" style={{ fontSize: '1.25rem' }} aria-hidden="true" />
            {!collapsed && <span className="font-medium">Ajuda</span>}
          </Button>
        </animated.div>
        
        {showOnboarding && (
          <OnboardingManager
            autoStart={true}
            showWelcomeMessage={false}
            onComplete={handleComplete}
            onSkip={handleSkip}
          />
        )}
      </>
    )
  }

  if (variant === 'text') {
    return (
      <>
        <Button
          onClick={handleStartTour}
          variant="ghost"
          className={`text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium text-sm transition-colors ${className}`}
        >
          Iniciar tour
        </Button>
        
        {showOnboarding && (
          <OnboardingManager
            autoStart={true}
            showWelcomeMessage={false}
            onComplete={handleComplete}
            onSkip={handleSkip}
          />
        )}
      </>
    )
  }

  return (
    <>
      <animated.div style={hoverStyle}>
        <Button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleStartTour}
          className={`flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors ${className}`}
        >
          <i className="ph ph-question" style={{ fontSize: '1rem' }} />
          Iniciar Tour
        </Button>
      </animated.div>
      
      {showOnboarding && (
        <OnboardingManager
          autoStart={true}
          showWelcomeMessage={false}
          onComplete={handleComplete}
          onSkip={handleSkip}
        />
      )}
    </>
  )
}

export default OnboardingTrigger
