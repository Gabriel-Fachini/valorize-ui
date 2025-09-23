import React, { createContext, useState } from 'react'

interface SidebarContextType {
  desktopSidebarCollapsed: boolean
  setDesktopSidebarCollapsed: (collapsed: boolean) => void
  toggleDesktopSidebar: () => void
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

interface SidebarProviderProps {
  children: React.ReactNode
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false)

  const toggleDesktopSidebar = () => {
    setDesktopSidebarCollapsed(prev => !prev)
  }

  return (
    <SidebarContext.Provider value={{
      desktopSidebarCollapsed,
      setDesktopSidebarCollapsed,
      toggleDesktopSidebar,
    }}>
      {children}
    </SidebarContext.Provider>
  )
}