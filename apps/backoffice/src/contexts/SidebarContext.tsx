import { createContext, useState, useContext, useMemo } from 'react'
import type { SidebarContextType, ProviderProps } from '@types'

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const SidebarProvider = ({ children }: ProviderProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev)
  }

  const value = useMemo(() => ({ isCollapsed, toggleSidebar }), [isCollapsed])

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
