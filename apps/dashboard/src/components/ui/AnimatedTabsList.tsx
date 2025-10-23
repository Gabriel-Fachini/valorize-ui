import React, { useRef, useEffect, useState, useCallback } from 'react'
import { animated, useSpring } from '@react-spring/web'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export interface TabItem {
  value: string
  label: string
  icon: string
  'aria-label': string
}

// Delay for DOM to settle before measuring tab dimensions
const MEASUREMENT_DELAY_MS = 50

interface AnimatedTabsListProps {
  items: TabItem[]
  activeTab: string
  onChange: (value: string) => void
  className?: string
  'data-tour'?: string
}

export const AnimatedTabsList: React.FC<AnimatedTabsListProps> = ({
  items,
  activeTab,
  onChange,
  className,
  'data-tour': dataTour,
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
      width: rect.width,
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

  // Measure tabs when they mount or change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      items.forEach(item => {
        const element = containerRef.current?.querySelector(`[data-tab="${item.value}"]`) as HTMLButtonElement
        if (element) {
          measureTab(item.value, element)
        }
      })
    }, MEASUREMENT_DELAY_MS)

    return () => clearTimeout(timeoutId)
  }, [items, measureTab])

  return (
    <div 
      ref={containerRef}
      data-tour={dataTour}
      className={cn(
        'relative inline-flex h-auto w-full sm:w-auto bg-white/70 dark:bg-neutral-800/70 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700/50 p-1.5 rounded-xl shadow-lg',
        className,
      )}
    >
      {/* Animated indicator */}
      <animated.div
        style={indicatorStyle}
        className="absolute top-1.5 bottom-1.5 bg-green-600 rounded-lg shadow-lg shadow-green-500/20"
        aria-hidden="true"
      />
      
      <TabsList className="bg-transparent p-0 h-auto w-full">
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            data-tab={item.value}
            ref={(el) => {
              if (el) measureTab(item.value, el)
            }}
            onClick={() => onChange(item.value)}
            className={cn(
              'relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors data-[state=active]:text-white data-[state=inactive]:text-neutral-600 dark:data-[state=inactive]:text-neutral-400 hover:data-[state=inactive]:text-neutral-800 dark:hover:data-[state=inactive]:text-neutral-200',
              'data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent',
            )}
            aria-label={item['aria-label']}
            aria-current={activeTab === item.value ? 'page' : undefined}
          >
            <i className={cn(
              'ph text-lg',
              item.icon,
              activeTab === item.value ? 'ph-fill' : '',
            )} />
            <span className="hidden sm:inline">{item.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  )
}
