import React, { useState } from 'react'
import { useSpring, animated } from '@react-spring/web'
import type { NavigationItemProps } from '../types'

export const NavigationItem: React.FC<NavigationItemProps> = React.memo(({ 
  path,
  label, 
  icon, 
  dataTour, 
  isActive, 
  collapsed = false, 
  onNavigate, 
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const hoverStyle = useSpring({
    scale: isHovered ? 1.05 : 1,
    config: { tension: 300, friction: 20 },
  })

  // Usar versão fill quando ativo, regular quando não ativo
  const iconClass = isActive ? `ph-fill ph-${icon}` : `ph ph-${icon}`

  return (
    <animated.button
      onClick={() => onNavigate(path)}
      data-tour={dataTour}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={hoverStyle}
      className={`relative z-10 flex h-12 items-center ${
        collapsed 
          ? 'justify-center w-12 mx-auto' 
          : 'w-full gap-4 px-4'
      } rounded-xl text-left transition-colors ${
        isActive
          ? 'text-black font-semibold'
          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
      }`}
      aria-current={isActive ? 'page' : undefined}
      aria-label={collapsed ? `Ir para ${label}` : undefined}
      title={collapsed ? label : undefined}
      type="button"
    >
      <i 
        className={iconClass}
        style={{ fontSize: '1.5rem' }}
        aria-hidden="true"
      />
      {!collapsed && <span className="font-medium">{label}</span>}
    </animated.button>
  )
})

NavigationItem.displayName = 'NavigationItem'

