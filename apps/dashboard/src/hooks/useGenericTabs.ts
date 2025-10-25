import { useState, useCallback, useMemo } from 'react'
import type { TabItem } from '@/components/ui/GenericTabsNavigation'

interface UseGenericTabsProps {
  tabs: TabItem[]
  defaultTab?: string
}

export const useGenericTabs = ({ tabs, defaultTab }: UseGenericTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.value ?? '')

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value)
  }, [])

  const tabItems: TabItem[] = useMemo(() => tabs, [tabs])

  return {
    activeTab,
    tabItems,
    handleTabChange,
  }
}
