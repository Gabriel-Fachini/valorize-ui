import { MOBILE_BREAKPOINT } from '../config/constants'

export const isMobile = (): boolean => {
  return typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
}

export const getSelectorForDevice = (tourAttr: string, forceMobile?: boolean): string => {
  const sidebarElements = ['balance-cards', 'home', 'praises', 'transactions', 'prizes', 'redemptions', 'profile']
  
  if (!sidebarElements.includes(tourAttr)) {
    return `[data-tour="${tourAttr}"]`
  }
  
  const isMobileView = forceMobile ?? isMobile()
  
  return isMobileView
    ? `#mobile-sidebar [data-tour="${tourAttr}"]`
    : `aside[role="complementary"] [data-tour="${tourAttr}"]`
}
