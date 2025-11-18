import { useMemo, useState, useEffect } from 'react'
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
  // Estado para controlar qual item está aberto (accordion behavior)
  // Usa o label como identificador único, pois múltiplos itens podem ter path: '#'
  const [openItemLabel, setOpenItemLabel] = useState<string | null>(null)

  // Fecha dropdowns quando navega para uma página sem subItems
  useEffect(() => {
    // Verifica se o currentPath pertence a algum item com subItems
    const belongsToItemWithSubItems = NAV_LINKS.some(link => {
      if (!link.subItems) return false
      return link.subItems.some(subItem =>
        currentPath === subItem.path || currentPath.startsWith(subItem.path + '/')
      )
    })

    // Se não pertence a nenhum item com subItems, fecha todos os dropdowns
    if (!belongsToItemWithSubItems) {
      setOpenItemLabel(null)
    }
  }, [currentPath])

  // Find which main nav link matches the current path
  const mainActiveIndex = useMemo(
    () => {
      const index = NAV_LINKS.findIndex(link => {
        if (link.path === currentPath) return true
        // Check if current path is a sub-route of the nav link
        if (link.subItems) {
          return link.subItems.some(subItem => 
            currentPath === subItem.path || currentPath.startsWith(subItem.path + '/')
          )
        }
        return currentPath.startsWith(link.path + '/')
      })
      return index >= 0 ? index : -1
    },
    [currentPath],
  )

  // Find which sub-item is active (if any)
  const activeSubItemInfo = useMemo(
    () => {
      if (mainActiveIndex === -1) return null
      
      const mainLink = NAV_LINKS[mainActiveIndex]
      if (!mainLink.subItems) return null
      
      const subIndex = mainLink.subItems.findIndex(subItem => 
        currentPath === subItem.path || currentPath.startsWith(subItem.path + '/')
      )
      
      return subIndex >= 0 ? { mainIndex: mainActiveIndex, subIndex } : null
    },
    [mainActiveIndex, currentPath],
  )

  // Verifica se a rota atual é uma das rotas do bottom (configurações)
  const isBottomRoute = useMemo(
    () => BOTTOM_NAV_LINKS.some(link => 
      currentPath === link.path || currentPath.startsWith(link.path + '/')
    ),
    [currentPath],
  )

  // Calculate indicator position
  const indicatorStyle = useSpring({
    transform: activeSubItemInfo 
      ? `translateY(${activeSubItemInfo.mainIndex * (ITEM_HEIGHT + ITEM_GAP)}px)`
      : mainActiveIndex >= 0
      ? `translateY(${mainActiveIndex * (ITEM_HEIGHT + ITEM_GAP)}px)`
      : `translateY(0px)`,
    height: ITEM_HEIGHT,
    opacity: isBottomRoute || mainActiveIndex === -1 ? 0 : 1,
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
          style={indicatorStyle as any}
          // @ts-expect-error - animated component className typing issue with react-spring
          className={`absolute ${
            collapsed
              ? 'left-0 right-0 mx-auto w-12 h-12'
              : 'left-0 right-0 h-12'
          } bg-primary rounded-xl`}
          aria-hidden="true"
        />
        
        {NAV_LINKS.map((link, index) => {
          // Check if current path is the link or a sub-route
          // But only if we're NOT in a bottom route (settings)
          const isActive = !isBottomRoute && (
            currentPath === link.path || (link.path !== '#' && currentPath.startsWith(link.path + '/'))
          )

          // Check if this item has the indicator (mainActiveIndex matches this item's position)
          const hasIndicator = mainActiveIndex === index

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
              subItems={link.subItems}
              currentPath={currentPath}
              hasIndicator={hasIndicator}
              isOpen={openItemLabel === link.label}
              onToggleOpen={(isOpen) => setOpenItemLabel(isOpen ? link.label : null)}
            />
          )
        })}
      </div>
    </nav>
  )
}

