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
  const hasActiveSubItem = subItems?.some((subItem) => {
    // Exact match
    if (currentPath === subItem.path) return true
    // Check if it's a true sub-path (has /$ after the path)
    if (currentPath.startsWith(subItem.path + '/')) {
      // But exclude paths like /prizes/dashboard when checking /prizes
      if (subItem.path === '/prizes' && currentPath === '/prizes/dashboard') return false
      return true
    }
    return false
  })

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
      {/* @ts-expect-error - animated component typing issue with react-spring */}
      <animated.button
        onClick={handleMainClick}
        data-tour={dataTour}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={hoverStyle as any}
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
        // @ts-expect-error - animated component typing issue with react-spring
        <animated.div
          style={{
            ...(subItemsStyle as any),
            overflow: 'hidden',
          }}
        >
          <div ref={contentRef} className="py-1">
            {subItems.map((subItem) => {
              // Check if this specific sub-item is active
              // For sub-items, we want exact match OR a true deeper route (with additional path segments)
              let isSubItemActive = currentPath === subItem.path

              // Check for sub-routes (like /compliments/network/details would match /compliments/network)
              if (!isSubItemActive && currentPath.startsWith(subItem.path + '/')) {
                // Make sure it's not just a sibling route that shares a prefix
                // Check if any other sibling has an exact match or is a better match
                const hasExactMatchSibling = subItems.some(other => currentPath === other.path)
                const hasBetterMatchSibling = subItems.some(other =>
                  other.path !== subItem.path &&
                  currentPath.startsWith(other.path + '/') &&
                  other.path.length > subItem.path.length
                )

                if (!hasExactMatchSibling && !hasBetterMatchSibling) {
                  // Special case: exclude /prizes from matching /prizes/dashboard
                  if (!(subItem.path === '/prizes' && currentPath === '/prizes/dashboard')) {
                    isSubItemActive = true
                  }
                }
              }

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

