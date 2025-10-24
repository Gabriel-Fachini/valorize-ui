import { useSidebar } from '@/hooks/useSidebar'

export const MobileContentBlur = () => {
  const { mobileSidebarOpen } = useSidebar()

  if (!mobileSidebarOpen) return null

  return (
    <div 
      className="fixed inset-0 z-40 lg:hidden pointer-events-none"
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
      }}
      aria-hidden="true"
    />
  )
}
