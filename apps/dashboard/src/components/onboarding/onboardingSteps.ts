import type { OnboardingStep } from '@/hooks/useOnboarding'

/**
 * Helper function to generate correct selector for mobile/desktop
 * Mobile uses #mobile-sidebar while desktop uses aside[role="complementary"]
 */
const getSelectorForDevice = (tourAttr: string, isMobile: boolean): string => {
  const sidebarElements = [
    'sidebar',
    'user-profile',
    'balance-cards',
    'home',
    'praises',
    'transactions',
    'prizes',
    'redemptions',
    'profile',
  ]

  if (sidebarElements.includes(tourAttr)) {
    return isMobile
      ? `#mobile-sidebar [data-tour="${tourAttr}"]`
      : `aside[role="complementary"] [data-tour="${tourAttr}"]`
  }

  return `[data-tour="${tourAttr}"]`
}

/**
 * Generate sidebar onboarding steps based on device type
 */
export const getSidebarOnboardingSteps = (isMobile: boolean): OnboardingStep[] => [
  {
    target: getSelectorForDevice('sidebar', isMobile),
    content: 'Bem-vindo ao Valorize! Esta é a barra lateral de navegação, onde você pode acessar todas as funcionalidades principais do sistema.',
    title: 'Bem-vindo ao Valorize!',
    placement: isMobile ? 'bottom' : 'right',
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    spotlightClicks: false,
  },
  {
    target: getSelectorForDevice('user-profile', isMobile),
    content: 'Esta é sua área de perfil, onde você pode ver suas informações pessoais e acessar configurações da conta.',
    title: 'Seu Perfil',
    placement: isMobile ? 'bottom' : 'right',
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    spotlightClicks: false,
  },
  {
    target: getSelectorForDevice('balance-cards', isMobile),
    content: 'Aqui você pode acompanhar seus saldos: pontos de elogio (para enviar reconhecimentos) e pontos resgatáveis (para trocar por prêmios).',
    title: 'Seus Saldos',
    placement: isMobile ? 'bottom' : 'right',
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    spotlightClicks: false,
  },
  {
    target: getSelectorForDevice('home', isMobile),
    content: 'O painel inicial mostra um resumo geral das suas atividades, estatísticas e informações importantes.',
    title: 'Painel Inicial',
    placement: isMobile ? 'bottom' : 'right',
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    spotlightClicks: false,
  },
  {
    target: getSelectorForDevice('praises', isMobile),
    content: 'Na seção de Elogios, você pode enviar e receber reconhecimentos dos seus colegas de trabalho.',
    title: 'Elogios',
    placement: isMobile ? 'bottom' : 'right',
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    spotlightClicks: false,
  },
  {
    target: getSelectorForDevice('transactions', isMobile),
    content: 'Aqui você acompanha todas as suas transações, incluindo pontos recebidos e gastos.',
    title: 'Transações',
    placement: isMobile ? 'bottom' : 'right',
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    spotlightClicks: false,
  },
  {
    target: getSelectorForDevice('prizes', isMobile),
    content: 'Na seção de Prêmios, você pode visualizar todos os prêmios disponíveis para resgate.',
    title: 'Prêmios',
    placement: isMobile ? 'bottom' : 'right',
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    spotlightClicks: false,
  },
  {
    target: getSelectorForDevice('redemptions', isMobile),
    content: 'Aqui você acompanha o histórico dos seus resgates de prêmios e seu status.',
    title: 'Resgates',
    placement: isMobile ? 'bottom' : 'right',
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    spotlightClicks: false,
  },
  {
    target: getSelectorForDevice('profile', isMobile),
    content: 'Nas Configurações, você pode personalizar sua conta, preferências e gerenciar suas informações.',
    title: 'Configurações',
    placement: isMobile ? 'bottom' : 'right',
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    spotlightClicks: false,
  },
]

/**
 * @deprecated Use getSidebarOnboardingSteps(isMobile) instead
 * Kept for backward compatibility
 */
export const sidebarOnboardingSteps: OnboardingStep[] = getSidebarOnboardingSteps(false)

export const quickStartSteps: OnboardingStep[] = [
  {
    target: '[data-tour="praises"]',
    content: 'Vamos começar enviando seu primeiro elogio! Clique aqui para acessar a seção de elogios.',
    title: 'Primeiro Passo',
    placement: 'right',
    disableBeacon: false,
    disableOverlayClose: true,
    hideCloseButton: false,
    spotlightClicks: true,
  },
]

export const advancedFeaturesSteps: OnboardingStep[] = [
  {
    target: '[data-tour="prizes"]',
    content: 'Explore os prêmios disponíveis e veja como você pode resgatar recompensas com seus pontos.',
    title: 'Prêmios e Recompensas',
    placement: 'right',
    disableBeacon: false,
    disableOverlayClose: true,
    hideCloseButton: false,
    spotlightClicks: true,
  },
  {
    target: '[data-tour="transactions"]',
    content: 'Acompanhe seu histórico de transações para entender melhor como você ganha e gasta seus pontos.',
    title: 'Histórico de Transações',
    placement: 'right',
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    spotlightClicks: true,
  },
]
