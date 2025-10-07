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

  return (
    <animated.button
      onClick={() => onNavigate(path)}
      data-tour={dataTour}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={hoverStyle}
      className={`relative z-10 flex w-full h-12 items-center ${
        collapsed 
          ? 'justify-center w-12 mx-auto' 
          : 'gap-4 px-4'
      } rounded-xl text-left ${
        isActive
          ? 'text-purple-600 dark:text-purple-400 font-medium'
          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20'
      }`}
      aria-current={isActive ? 'page' : undefined}
      aria-label={collapsed ? `Ir para ${label}` : undefined}
      title={collapsed ? label : undefined}
      type="button"
    >
      <span className="text-xl" aria-hidden="true">{icon}</span>
      {!collapsed && <span className="font-medium">{label}</span>}
    </animated.button>
  )
})

NavigationItem.displayName = 'NavigationItem'

