import { useNavigate, useLocation } from '@tanstack/react-router'
import { useSidebar } from '@/hooks/useSidebar'

export const useNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setMobileSidebarOpen } = useSidebar()

  const isActive = (path: string) => location.pathname === path

  const handleNavigation = (path: string) => {
    // Feedback tátil
    if (navigator.vibrate) navigator.vibrate(50)

    navigate({ to: path })
    setMobileSidebarOpen(false)
  }

  return {
    currentPath: location.pathname,
    isActive,
    handleNavigation,
  }
}

