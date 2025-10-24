import { SidebarDesktop } from './SidebarDesktop'
import { SidebarMobile } from './SidebarMobile'
import { MobileHeader } from './MobileHeader'
import { MobileGestureArea } from './MobileGestureArea'

export const Sidebar = () => {
  return (
    <>
      <MobileGestureArea />
      <MobileHeader />
      <SidebarDesktop />
      <SidebarMobile />
    </>
  )
}

