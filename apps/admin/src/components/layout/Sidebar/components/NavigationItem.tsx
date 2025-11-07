import React, { useState, useEffect, useRef } from 'react'
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
  subItems,
  currentPath,
  hasIndicator = false,
  isOpen = false,
  onToggleOpen,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [viewHeight, setViewHeight] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const previousOpen = useRef(isOpen)

  // Measure content height
  useEffect(() => {
    if (contentRef.current) {
      setViewHeight(contentRef.current.scrollHeight)
    }
  }, [subItems, isOpen])

  // Check if any sub-item is active
  const hasActiveSubItem = subItems?.some(
    subItem => currentPath === subItem.path || currentPath.startsWith(subItem.path + '/')
  )

  // Close when sidebar collapses
  useEffect(() => {
    if (collapsed && onToggleOpen) {
      onToggleOpen(false)
    }
  }, [collapsed, onToggleOpen])

  const hoverStyle = useSpring({
    scale: isHovered ? 1.05 : 1,
    config: { tension: 300, friction: 20 },
  })

  const subItemsStyle = useSpring({
    height: isOpen ? viewHeight : 0,
    opacity: isOpen ? 1 : 0,
    config: { tension: 280, friction: 20 },
  })

  // Usar versão fill quando ativo, regular quando não ativo
  const iconClass = isActive ? `ph-fill ph-${icon}` : `ph ph-${icon}`

  const hasSubItems = subItems && subItems.length > 0

  const handleMainClick = () => {
    if (hasSubItems && !collapsed) {
      // Navegar para a primeira subpágina
      if (subItems && subItems.length > 0) {
        onNavigate(subItems[0].path)
      }
      // Abrir o dropdown
      if (onToggleOpen) {
        onToggleOpen(!isOpen)
      }
    } else if (path !== '#') {
      onNavigate(path)
    }
  }

  useEffect(() => {
    previousOpen.current = isOpen
  }, [isOpen])

  return (
    <div className="relative">
      <animated.button
        onClick={handleMainClick}
        data-tour={dataTour}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={hoverStyle}
        className={`relative z-10 flex h-12 items-center ${
          collapsed 
            ? 'justify-center w-12 mx-auto' 
            : 'w-full gap-4 px-4'
        } rounded-xl text-left transition-colors ${
          (isActive && !hasActiveSubItem) || hasIndicator
            ? 'text-black font-semibold'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
        }`}
        aria-current={isActive ? 'page' : undefined}
        aria-label={collapsed ? `Ir para ${label}` : undefined}
        title={collapsed ? label : undefined}
        type="button"
        aria-expanded={hasSubItems && !collapsed ? isOpen : undefined}
      >
        <i 
          className={iconClass}
          style={{ fontSize: '1.5rem' }}
          aria-hidden="true"
        />
        {!collapsed && (
          <>
            <span className="font-medium flex-1">{label}</span>
            {hasSubItems && (
              <i 
                className={`ph ${isOpen ? 'ph-caret-up' : 'ph-caret-down'}`}
                style={{ fontSize: '1rem' }}
                aria-hidden="true"
              />
            )}
          </>
        )}
      </animated.button>

      {/* Sub-items */}
      {hasSubItems && !collapsed && (
        <animated.div
          style={{
            ...subItemsStyle,
            overflow: 'hidden',
          }}
        >
          <div ref={contentRef} className="py-1">
            {subItems.map((subItem) => {
              const isSubItemActive = currentPath === subItem.path || currentPath.startsWith(subItem.path + '/')
              const subIconClass = isSubItemActive ? `ph-fill ph-${subItem.icon}` : `ph ph-${subItem.icon}`
              
              return (
                <button
                  key={subItem.path}
                  onClick={() => onNavigate(subItem.path)}
                  data-tour={subItem.dataTour}
                  className={`flex h-10 items-center w-full gap-3 px-4 pl-12 rounded-xl text-left transition-colors text-sm ${
                    isSubItemActive
                      ? 'text-primary font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                  aria-current={isSubItemActive ? 'page' : undefined}
                  type="button"
                >
                  <i 
                    className={subIconClass}
                    style={{ fontSize: '1.25rem' }}
                    aria-hidden="true"
                  />
                  <span className="font-medium">{subItem.label}</span>
                </button>
              )
            })}
          </div>
        </animated.div>
      )}
    </div>
  )
})

NavigationItem.displayName = 'NavigationItem'

