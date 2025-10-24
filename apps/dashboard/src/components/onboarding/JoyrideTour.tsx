import React from 'react'
import Joyride, { CallBackProps, STATUS, EVENTS } from 'react-joyride'
import type { OnboardingStep } from '@/hooks/useOnboarding'
import { CustomTooltip } from './CustomTooltip'

interface JoyrideTourProps {
  steps: OnboardingStep[]
  isRunning: boolean
  onComplete?: () => void
  onSkip?: () => void
  onStopTour?: () => void
  continuous?: boolean
  showProgress?: boolean
  disableCloseOnEsc?: boolean
  disableOverlayClose?: boolean
  hideBackButton?: boolean
  locale?: {
    back?: string
    close?: string
    last?: string
    next?: string
    step?: string
    skip?: string
    finish?: string
  }
}

export const JoyrideTour: React.FC<JoyrideTourProps> = ({
  steps,
  isRunning,
  onComplete,
  onSkip,
  onStopTour,
  continuous = true,
  showProgress = true,
  disableCloseOnEsc = false,
  disableOverlayClose = false,
  hideBackButton = false,
  locale = {
    back: 'Voltar',
    close: 'Fechar',
    last: 'Finalizar',
    next: 'Próximo',
    step: 'Passo',
    skip: 'Pular',
    finish: 'Concluir',
  },
}) => {
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, action, index } = data

    // Tratar eventos de navegação
    if (type === EVENTS.STEP_AFTER) {
      // Step foi avançado com sucesso, não precisamos fazer nada
      // O Joyride gerencia o stepIndex internamente
    }

    if (type === EVENTS.TARGET_NOT_FOUND) {
      // Target não encontrado, pular para o próximo
      // eslint-disable-next-line no-console
      console.warn(`Target not found for step ${index}, attempting to continue`)
    }

    // Tratar ação de fechar (botão X)
    if (action === 'close') {
      onStopTour?.()
      onSkip?.() // Tratar como skip quando fechar
      return
    }

    // Tratar finalização do tour
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      onStopTour?.()
      if (status === STATUS.FINISHED) {
        onComplete?.()
      } else {
        onSkip?.()
      }
    }
  }


  return (
    <>
      <Joyride
        steps={steps}
        run={isRunning}
        continuous={continuous}
        showProgress={showProgress}
        showSkipButton={false}
        disableCloseOnEsc={disableCloseOnEsc}
        disableOverlayClose={disableOverlayClose}
        disableScrolling={false}
        scrollToFirstStep={true}
        scrollOffset={100}
        hideBackButton={hideBackButton}
        locale={locale}
        callback={handleJoyrideCallback}
        tooltipComponent={CustomTooltip}
        floaterProps={{
          disableAnimation: false,
          styles: {
            floater: {
              filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.15))',
            },
          },
        }}
        styles={{
          options: {
            primaryColor: '#00D959',
            overlayColor: 'rgba(0, 0, 0, 0.4)',
            spotlightShadow: '0 0 15px rgba(0, 217, 89, 0.3)',
            zIndex: 1000,
            arrowColor: 'transparent',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          },
          spotlight: {
            borderRadius: 12,
          },
        }}
      />
    </>
  )
}