import { useEffect } from 'react'
import { useLocation } from '@tanstack/react-router'
import { useOnboarding } from '@/contexts/onboarding'

/**
 * Componente que monitora mudanças de rota e avança o tour do onboarding
 * quando o usuário navega para a página esperada.
 * 
 * Este componente deve ser renderizado dentro do RouterProvider.
 */
export const OnboardingRouteListener = () => {
  const location = useLocation()
  const { handleRouteChange } = useOnboarding()

  useEffect(() => {
    handleRouteChange(location.pathname)
  }, [location.pathname, handleRouteChange])

  return null
}

