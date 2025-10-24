import { SidebarDesktop } from './SidebarDesktop'
import { SidebarMobile } from './SidebarMobile'
import { MobileHeader } from './MobileHeader'

export const Sidebar = () => {
  return (
    <>
      <MobileHeader />
      <SidebarDesktop />
      <SidebarMobile />
    </>
  )
}

