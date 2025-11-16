import { createContext, useState, useCallback, useMemo } from 'react'
import type { SidebarContextType, ProviderProps } from '@/types'

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const SidebarProvider = ({ children }: ProviderProps) => {
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const toggleDesktopSidebar = useCallback(() => {
    setDesktopSidebarCollapsed(prev => !prev)
  }, [])

  const toggleMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(prev => !prev)
  }, [])

  const value = useMemo(() => ({
    desktopSidebarCollapsed,
    setDesktopSidebarCollapsed,
    toggleDesktopSidebar,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    toggleMobileSidebar,
  }), [desktopSidebarCollapsed, mobileSidebarOpen, toggleDesktopSidebar, toggleMobileSidebar])

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}
