import { useState, useCallback, useMemo } from 'react'
import type { TabItem } from '@/components/ui/AnimatedTabsList'

export const useSettingsTabs = () => {
  const [activeTab, setActiveTab] = useState('profile')

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value)
  }, [])

  const tabItems: TabItem[] = useMemo(() => [
    {
      value: 'profile',
      label: 'Perfil',
      icon: 'ph-user',
      'aria-label': 'Aba de perfil',
    },
    {
      value: 'preferences',
      label: 'Preferências',
      icon: 'ph-sliders',
      'aria-label': 'Aba de preferências',
    },
    {
      value: 'addresses',
      label: 'Endereços',
      icon: 'ph-map-pin',
      'aria-label': 'Aba de endereços',
    },
  ], [])

  return {
    activeTab,
    tabItems,
    handleTabChange,
  }
}

export default useSettingsTabs
