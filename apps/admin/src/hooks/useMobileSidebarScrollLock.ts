import { useEffect } from 'react'
import { useSidebar } from './useSidebar'

export const useMobileSidebarScrollLock = () => {
  const { mobileSidebarOpen } = useSidebar()

  useEffect(() => {
    if (mobileSidebarOpen) {
      // Desabilitar scroll do body quando sidebar estiver aberta
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${window.scrollY}px`
    } else {
      // Reabilitar scroll quando sidebar fechar
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }

    return () => {
      // Cleanup: garantir que o scroll seja reabilitado se o componente for desmontado
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
    }
  }, [mobileSidebarOpen])
}
