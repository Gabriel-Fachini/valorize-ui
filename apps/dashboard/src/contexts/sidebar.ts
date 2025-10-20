import { createContext } from 'react'

export interface SidebarContextType {
  desktopSidebarCollapsed: boolean
  setDesktopSidebarCollapsed: (collapsed: boolean) => void
  toggleDesktopSidebar: () => void
  mobileSidebarOpen: boolean
  setMobileSidebarOpen: (open: boolean) => void
  toggleMobileSidebar: () => void
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined)
