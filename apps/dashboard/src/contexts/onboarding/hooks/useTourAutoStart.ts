import { useEffect, useRef } from 'react'
import { isMobile } from '../utils/device'

interface UseTourAutoStartProps {
  isLoading: boolean
  hasUser: boolean
  hasCompletedOnboarding: boolean
  onStart: () => void
  onOpenSidebar: () => void
}

export const useTourAutoStart = ({
  isLoading,
  hasUser,
  hasCompletedOnboarding,
  onStart,
  onOpenSidebar,
}: UseTourAutoStartProps) => {
  const timeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }

    if (isLoading || !hasUser || hasCompletedOnboarding) {
      return
    }

    timeoutRef.current = window.setTimeout(() => {
      onStart()
      if (isMobile()) {
        onOpenSidebar()
      }
    }, 1500)

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [isLoading, hasUser, hasCompletedOnboarding, onStart, onOpenSidebar])
}
