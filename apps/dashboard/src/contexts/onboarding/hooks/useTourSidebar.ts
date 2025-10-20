import { useEffect, useCallback } from 'react'
import { useSidebar } from '@/hooks/useSidebar'
import { isMobile } from '../utils/device'
import { STEPS_REQUIRING_SIDEBAR } from '../config/constants'

interface UseTourSidebarProps {
  isOpen: boolean
  currentStep: number
}

export const useTourSidebar = ({ isOpen, currentStep }: UseTourSidebarProps) => {
  const { setMobileSidebarOpen } = useSidebar()

  // Manage sidebar during the tour
  useEffect(() => {
    if (!isOpen || !isMobile()) return

    const shouldShowSidebar = STEPS_REQUIRING_SIDEBAR.includes(currentStep)
    setMobileSidebarOpen(shouldShowSidebar)
  }, [currentStep, isOpen, setMobileSidebarOpen])

  // Open sidebar when starting the tour
  const openSidebarOnStart = useCallback(() => {
    if (isMobile()) {
      setMobileSidebarOpen(true)
    }
  }, [setMobileSidebarOpen])

  // Close sidebar when completing the tour
  const closeSidebarOnComplete = useCallback(() => {
    if (isMobile()) {
      setMobileSidebarOpen(false)
    }
  }, [setMobileSidebarOpen])

  return { openSidebarOnStart, closeSidebarOnComplete }
}
