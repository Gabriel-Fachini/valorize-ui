import { useState } from 'react'
import { useSpring, animated } from '@react-spring/web'
import type { BottomActionsProps } from '../types'
import { BOTTOM_NAV_LINKS } from '../constants'

export const BottomActions = ({ 
  collapsed = false,
  currentPath,
  onNavigate,
  onLogout, 
}: BottomActionsProps) => {
  const [hoveredLogout, setHoveredLogout] = useState(false)

  const logoutHoverStyle = useSpring({
    scale: hoveredLogout ? 1.05 : 1,
    config: { tension: 300, friction: 20 },
  })

  return (
    <div className={
      collapsed 
        ? 'border-t border-gray-200 dark:border-gray-800 p-3 bg-gray-50 dark:bg-black/20 space-y-2'
        : 'border-t border-gray-200 dark:border-gray-800 p-6 bg-gray-50 dark:bg-black/20 space-y-2'
    }>
      {/* Configurações com indicador verde */}
      <div className="relative">
        {BOTTOM_NAV_LINKS.map((link) => {
          const isActive = currentPath === link.path
          const iconClass = isActive ? `ph-fill ph-${link.icon}` : `ph ph-${link.icon}`
          
          return (
            <div key={link.path}>
              {/* Indicador verde de fundo quando ativo */}
              {isActive && (
                <div 
                  className={`absolute ${
                    collapsed 
                      ? 'left-0 right-0 mx-auto w-12 h-12' 
                      : 'left-0 right-0 h-12'
                  } bg-primary rounded-xl`}
                  aria-hidden="true"
                />
              )}
              
              <button
                onClick={() => onNavigate(link.path)}
                data-tour={link.dataTour}
                className={`relative z-10 flex w-full items-center ${
                  collapsed 
                    ? 'justify-center h-12 w-12 mx-auto' 
                    : 'gap-4 px-4'
                } py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'text-black font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                }`}
                title={collapsed ? link.label : undefined}
                aria-label={collapsed ? link.label : undefined}
                type="button"
              >
                <i 
                  className={iconClass} 
                  style={{ fontSize: '1.25rem' }} 
                  aria-hidden="true" 
                />
                {!collapsed && <span className="font-medium">{link.label}</span>}
              </button>
            </div>
          )
        })}
      </div>

      {/* Sair */}
      <animated.button
        style={logoutHoverStyle}
        onMouseEnter={() => setHoveredLogout(true)}
        onMouseLeave={() => setHoveredLogout(false)}
        onClick={() => {
          if (navigator.vibrate) navigator.vibrate(100)
          onLogout()
        }}
        className={`flex w-full items-center ${
          collapsed 
            ? 'justify-center h-12 w-12 mx-auto' 
            : 'gap-4 px-4'
        } py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors`}
        title={collapsed ? 'Sair' : undefined}
        aria-label={collapsed ? 'Sair da conta' : undefined}
        type="button"
      >
        <i className="ph ph-sign-out" style={{ fontSize: '1.25rem' }} aria-hidden="true" />
        {!collapsed && <span className="font-medium drop-shadow-sm">Sair</span>}
      </animated.button>
    </div>
  )
}

