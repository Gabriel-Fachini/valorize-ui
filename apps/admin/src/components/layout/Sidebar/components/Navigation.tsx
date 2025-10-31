import { useMemo } from 'react'
import { useSpring, animated } from '@react-spring/web'
import type { NavigationProps } from '../types'
import { NavigationItem } from './NavigationItem'
import { NAV_LINKS, BOTTOM_NAV_LINKS } from '../constants'

const ITEM_HEIGHT = 48
const ITEM_GAP = 8

export const Navigation = ({ 
  collapsed = false, 
  currentPath, 
  onNavigate, 
}: NavigationProps) => {
  const activeIndex = useMemo(
    () => {
      // Check for exact match or sub-routes (e.g., /elogios/novo should activate /elogios)
      const index = NAV_LINKS.findIndex(link => {
        if (link.path === currentPath) return true
        // Check if current path is a sub-route of the nav link
        return currentPath.startsWith(link.path + '/')
      })
      return index >= 0 ? index : 0
    },
    [currentPath],
  )

  // Verifica se a rota atual é uma das rotas do bottom (configurações)
  // Inclui verificação para sub-rotas (e.g., /settings/basic-info)
  const isBottomRoute = useMemo(
    () => BOTTOM_NAV_LINKS.some(link => 
      currentPath === link.path || currentPath.startsWith(link.path + '/')
    ),
    [currentPath],
  )

  const indicatorStyle = useSpring({
    transform: `translateY(${activeIndex * (ITEM_HEIGHT + ITEM_GAP)}px)`,
    opacity: isBottomRoute ? 0 : 1, // Esconde o indicador se estiver em rota do bottom
    config: { tension: 280, friction: 20 },
  })

  return (
    <nav 
      className={collapsed ? 'flex-1 px-3 py-6' : 'flex-1 px-6 py-6'}
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="relative space-y-2">
        <animated.div
          style={indicatorStyle}
          className={`absolute ${
            collapsed 
              ? 'left-0 right-0 mx-auto w-12 h-12' 
              : 'left-0 right-0 h-12'
          } bg-primary rounded-xl`}
          aria-hidden="true"
        />
        
        {NAV_LINKS.map((link) => {
          // Check if current path is the link or a sub-route
          // But only if we're NOT in a bottom route (settings)
          const isActive = !isBottomRoute && (
            currentPath === link.path || currentPath.startsWith(link.path + '/')
          )
          
          return (
            <NavigationItem
              key={link.path}
              path={link.path}
              label={link.label}
              icon={link.icon}
              dataTour={link.dataTour}
              isActive={isActive}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          )
        })}
      </div>
    </nav>
  )
}

