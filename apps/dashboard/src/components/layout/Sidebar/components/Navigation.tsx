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
      const index = NAV_LINKS.findIndex(link => link.path === currentPath)
      return index >= 0 ? index : 0
    },
    [currentPath],
  )

  // Verifica se a rota atual é uma das rotas do bottom (configurações)
  const isBottomRoute = useMemo(
    () => BOTTOM_NAV_LINKS.some(link => link.path === currentPath),
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
        
        {NAV_LINKS.map((link) => (
          <NavigationItem
            key={link.path}
            path={link.path}
            label={link.label}
            icon={link.icon}
            dataTour={link.dataTour}
            isActive={currentPath === link.path}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </nav>
  )
}

