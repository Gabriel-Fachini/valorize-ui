import React, { useState, useCallback, useMemo } from 'react'
import { SidebarContext } from './sidebar'

interface SidebarProviderProps {
  children: React.ReactNode
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
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

  return <SidebarContext value={value}>{children}</SidebarContext>
}