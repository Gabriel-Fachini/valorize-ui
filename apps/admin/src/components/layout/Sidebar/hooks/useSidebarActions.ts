import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'

export const useSidebarActions = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    // Feedback tátil
    if (navigator.vibrate) navigator.vibrate(100)
    
    logout()
    navigate({ to: '/' })
  }

  return {
    handleLogout,
  }
}

