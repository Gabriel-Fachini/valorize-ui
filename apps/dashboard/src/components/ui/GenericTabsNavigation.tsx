import React, { useRef, useEffect, useState, useCallback } from 'react'
import { animated, useSpring } from '@react-spring/web'
import { cn } from '@/lib/utils'

export interface TabItem {
  value: string
  label: string
  icon: string
  'aria-label': string
}

// Delay for DOM to settle before measuring tab dimensions
const MEASUREMENT_DELAY_MS = 100

interface GenericTabsNavigationProps {
  items: TabItem[]
  activeTab: string
  onChange: (value: string) => void
  className?: string
  'data-tour'?: string
  variant?: 'default' | 'compact'
  showLabels?: boolean
}

export const GenericTabsNavigation: React.FC<GenericTabsNavigationProps> = ({
  items,
  activeTab,
  onChange,
  className,
  'data-tour': dataTour,
  variant = 'default',
  showLabels = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState<{ [key: string]: { width: number; left: number } }>({})

  const indicatorStyle = useSpring({
    width: dimensions[activeTab]?.width || 0,
    left: dimensions[activeTab]?.left || 0,
    config: { tension: 280, friction: 20 },
  })

  const measureTab = useCallback((tabValue: string, element: HTMLButtonElement) => {
    if (!element || !containerRef.current) return

    const rect = element.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    
    const newDimensions = {
      width: rect.width + 2, // Add small padding to ensure proper fit
      left: rect.left - containerRect.left,
    }
    
    setDimensions(prev => {
      const existing = prev[tabValue]
      if (existing && existing.width === newDimensions.width && existing.left === newDimensions.left) {
        return prev
      }
      return {
        ...prev,
        [tabValue]: newDimensions,
      }
    })
  }, [])

  // Force initial measurement when component mounts
  useEffect(() => {
    const forceInitialMeasurement = () => {
      if (containerRef.current) {
        items.forEach(item => {
          const element = containerRef.current?.querySelector(`[data-tab="${item.value}"]`) as HTMLButtonElement
          if (element) {
            // Force multiple reflows to ensure element is fully rendered
            void element.offsetHeight
            void element.offsetWidth
            void element.getBoundingClientRect()
            
            // Small delay to ensure layout is stable
            setTimeout(() => {
              measureTab(item.value, element)
            }, 10)
          }
        })
      }
    }

    // Use multiple requestAnimationFrame calls to ensure DOM is ready
    const rafId1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        forceInitialMeasurement()
      })
    })

    return () => {
      cancelAnimationFrame(rafId1)
    }
  }, [items, measureTab])

  // Measure tabs when they mount or change
  useEffect(() => {
    const measureAllTabs = () => {
      items.forEach(item => {
        const element = containerRef.current?.querySelector(`[data-tab="${item.value}"]`) as HTMLButtonElement
        if (element) {
          measureTab(item.value, element)
        }
      })
    }

    const measureActiveTab = () => {
      const activeElement = containerRef.current?.querySelector(`[data-tab="${activeTab}"]`) as HTMLButtonElement
      if (activeElement) {
        measureTab(activeTab, activeElement)
      }
    }

    // Measure immediately if elements are available
    const immediateTimeout = setTimeout(measureAllTabs, 0)
    
    // Measure active tab specifically after a short delay
    const activeTabTimeout = setTimeout(measureActiveTab, 50)
    
    // Additional measurement for active tab with longer delay
    const activeTabTimeout2 = setTimeout(measureActiveTab, 150)
    
    // Measure again after a delay to ensure proper rendering
    const delayedTimeout = setTimeout(measureAllTabs, MEASUREMENT_DELAY_MS)
    
    // Additional measurement after a longer delay as fallback
    const fallbackTimeout = setTimeout(measureAllTabs, 300)

    return () => {
      clearTimeout(immediateTimeout)
      clearTimeout(activeTabTimeout)
      clearTimeout(activeTabTimeout2)
      clearTimeout(delayedTimeout)
      clearTimeout(fallbackTimeout)
    }
  }, [items, measureTab, activeTab])

  // Additional effect to measure active tab when it changes
  useEffect(() => {
    const measureActiveTabImmediately = () => {
      const activeElement = containerRef.current?.querySelector(`[data-tab="${activeTab}"]`) as HTMLButtonElement
      if (activeElement) {
        // Force reflow and measure
        void activeElement.offsetHeight
        void activeElement.offsetWidth
        measureTab(activeTab, activeElement)
      }
    }

    // Measure immediately when active tab changes
    const immediateTimeout = setTimeout(measureActiveTabImmediately, 0)
    
    // Measure again after a short delay
    const delayedTimeout = setTimeout(measureActiveTabImmediately, 25)

    return () => {
      clearTimeout(immediateTimeout)
      clearTimeout(delayedTimeout)
    }
  }, [activeTab, measureTab])

  // Add ResizeObserver to detect size changes
  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver(() => {
      // Re-measure all tabs when container size changes
      items.forEach(item => {
        const element = containerRef.current?.querySelector(`[data-tab="${item.value}"]`) as HTMLButtonElement
        if (element) {
          measureTab(item.value, element)
        }
      })
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [items, measureTab])

  const containerClasses = cn(
    'relative inline-flex h-auto w-full sm:w-auto bg-white/70 dark:bg-neutral-800/70 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700/50 p-1.5 rounded-xl shadow-lg',
    variant === 'compact' && 'p-1',
    'min-w-0', // Allow container to shrink if needed
    className,
  )

  const triggerClasses = cn(
    'relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors data-[state=active]:text-white data-[state=inactive]:text-neutral-600 dark:data-[state=inactive]:text-neutral-400 hover:data-[state=inactive]:text-neutral-800 dark:hover:data-[state=inactive]:text-neutral-200',
    'data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent',
    variant === 'compact' && 'px-3 py-2 gap-1.5',
  )

  const iconClasses = cn(
    'ph text-lg',
    variant === 'compact' && 'text-base',
  )

  const labelClasses = cn(
    showLabels ? 'inline' : 'hidden sm:inline',
    variant === 'compact' && 'text-sm',
    'whitespace-nowrap', // Prevent text wrapping
  )

  return (
    <div 
      ref={containerRef}
      data-tour={dataTour}
      className={containerClasses}
    >
      {/* Animated indicator */}
      <animated.div
        style={indicatorStyle}
        className="absolute top-1.5 bottom-1.5 bg-green-600 rounded-lg shadow-lg shadow-green-500/20"
        aria-hidden="true"
      />
      
      <div className="bg-transparent p-0 h-auto w-full flex overflow-x-auto flex-nowrap">
        {items.map((item) => (
          <button
            key={item.value}
            data-tab={item.value}
            ref={(el) => {
              if (el) measureTab(item.value, el)
            }}
            onClick={() => onChange(item.value)}
            className={cn(
              triggerClasses,
              'flex-shrink-0', // Prevent shrinking to maintain label visibility
            )}
            aria-label={item['aria-label']}
            aria-current={activeTab === item.value ? 'page' : undefined}
            role="tab"
            aria-selected={activeTab === item.value}
          >
            <i className={cn(
              iconClasses,
              item.icon,
              activeTab === item.value ? 'ph-fill' : '',
            )} />
            <span className={labelClasses}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
