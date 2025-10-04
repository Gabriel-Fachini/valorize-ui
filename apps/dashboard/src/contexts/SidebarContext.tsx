import React, { createContext, useState } from 'react'

interface SidebarContextType {
  desktopSidebarCollapsed: boolean
  setDesktopSidebarCollapsed: (collapsed: boolean) => void
  toggleDesktopSidebar: () => void
  mobileSidebarOpen: boolean
  setMobileSidebarOpen: (open: boolean) => void
  toggleMobileSidebar: () => void
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

interface SidebarProviderProps {
  children: React.ReactNode
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const toggleDesktopSidebar = () => {
    setDesktopSidebarCollapsed(prev => !prev)
  }

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(prev => !prev)
  }

  return (
    <SidebarContext.Provider value={{
      desktopSidebarCollapsed,
      setDesktopSidebarCollapsed,
      toggleDesktopSidebar,
      mobileSidebarOpen,
      setMobileSidebarOpen,
      toggleMobileSidebar,
    }}>
      {children}
    </SidebarContext.Provider>
  )
}