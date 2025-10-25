/**
 * TransactionFilters Component
 * Improved user-friendly filter controls for transaction history
 */

import { useState, useCallback } from 'react'
import { animated, useSpring } from '@react-spring/web'
import { Button } from '@/components/ui/button'
import { GenericTabsNavigation, useGenericTabs } from '@/components/ui'
import type { 
  TransactionUIFilters, 
  ActivityFilter, 
  DirectionFilter, 
  TimePeriodFilter,
} from '@/types'
import type { TabItem } from '@/components/ui/GenericTabsNavigation'

interface TransactionFiltersProps {
  filters: TransactionUIFilters
  onFiltersChange: (filters: TransactionUIFilters) => void
  loading?: boolean
  className?: string
}

// Filter options (all converted to tabs)

export const TransactionFilters = ({
  filters,
  onFiltersChange,
  loading = false,
  className = '',
}: TransactionFiltersProps) => {
  const [showCustomDates, setShowCustomDates] = useState(filters.timePeriod === 'custom')

  // Configuração das abas de Tipo de Atividade
  const activityTabs: TabItem[] = [
    {
      value: 'all',
      label: 'Todas',
      icon: 'ph-stack',
      'aria-label': 'Ver todas as atividades',
    },
    {
      value: 'praises',
      label: 'Elogios',
      icon: 'ph-chat-circle-dots',
      'aria-label': 'Ver apenas elogios',
    },
    {
      value: 'prizes',
      label: 'Prêmios',
      icon: 'ph-gift',
      'aria-label': 'Ver apenas prêmios',
    },
    {
      value: 'system',
      label: 'Sistema',
      icon: 'ph-gear',
      'aria-label': 'Ver apenas sistema',
    },
  ]

  // Configuração das abas de Direção
  const directionTabs: TabItem[] = [
    {
      value: 'both',
      label: 'Ambos',
      icon: 'ph-swap',
      'aria-label': 'Ver entrada e saída',
    },
    {
      value: 'in',
      label: 'Entrada',
      icon: 'ph-arrow-down-left',
      'aria-label': 'Ver apenas entradas',
    },
    {
      value: 'out',
      label: 'Saída',
      icon: 'ph-arrow-up-right',
      'aria-label': 'Ver apenas saídas',
    },
  ]

  // Configuração das abas de Período
  const periodTabs: TabItem[] = [
    {
      value: 'today',
      label: 'Hoje',
      icon: 'ph-calendar-blank',
      'aria-label': 'Ver transações de hoje',
    },
    {
      value: 'week',
      label: 'Esta Semana',
      icon: 'ph-calendar-check',
      'aria-label': 'Ver transações desta semana',
    },
    {
      value: 'month',
      label: 'Este Mês',
      icon: 'ph-calendar',
      'aria-label': 'Ver transações deste mês',
    },
    {
      value: 'custom',
      label: 'Personalizado',
      icon: 'ph-calendar-dots',
      'aria-label': 'Definir período personalizado',
    },
  ]

  // Hooks para gerenciar as abas
  const { activeTab: activeActivityTab, tabItems: activityTabItems, handleTabChange: handleActivityTabChange } = useGenericTabs({
    tabs: activityTabs,
    defaultTab: filters.activity,
  })

  const { activeTab: activeDirectionTab, tabItems: directionTabItems, handleTabChange: handleDirectionTabChange } = useGenericTabs({
    tabs: directionTabs,
    defaultTab: filters.direction,
  })

  const { activeTab: activePeriodTab, tabItems: periodTabItems, handleTabChange: handlePeriodTabChange } = useGenericTabs({
    tabs: periodTabs,
    defaultTab: filters.timePeriod,
  })

  // Animation for custom date fields
  const customDateAnimation = useSpring({
    opacity: showCustomDates ? 1 : 0,
    height: showCustomDates ? 'auto' : 0,
    config: { tension: 300, friction: 30 },
  })


  // Handle activity tab change
  const handleActivityTabChangeWithCallback = useCallback((value: string) => {
    handleActivityTabChange(value)
    onFiltersChange({ ...filters, activity: value as ActivityFilter })
  }, [filters, onFiltersChange, handleActivityTabChange])

  // Handle direction tab change
  const handleDirectionTabChangeWithCallback = useCallback((value: string) => {
    handleDirectionTabChange(value)
    onFiltersChange({ ...filters, direction: value as DirectionFilter })
  }, [filters, onFiltersChange, handleDirectionTabChange])

  // Handle period tab change
  const handlePeriodTabChangeWithCallback = useCallback((value: string) => {
    handlePeriodTabChange(value)
    const timePeriod = value as TimePeriodFilter
    
    if (timePeriod === 'custom') {
      setShowCustomDates(true)
    } else {
      setShowCustomDates(false)
      onFiltersChange({ 
        ...filters, 
        timePeriod,
        customDateRange: undefined,
      })
    }
  }, [filters, onFiltersChange, handlePeriodTabChange])


  // Handle custom date range change
  const handleCustomDateChange = useCallback((field: 'from' | 'to', value: string) => {
    const currentRange = filters.customDateRange ?? { from: '', to: '' }
    const newRange = { ...currentRange, [field]: value }
    
    onFiltersChange({
      ...filters,
      timePeriod: 'custom',
      customDateRange: newRange,
    })
  }, [filters, onFiltersChange])

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setShowCustomDates(false)
    onFiltersChange({
      activity: 'all',
      direction: 'both',
      timePeriod: 'month',
      customDateRange: undefined,
    })
  }, [onFiltersChange])

  const hasActiveFilters = 
    filters.activity !== 'all' || 
    filters.direction !== 'both' || 
    filters.timePeriod !== 'month'

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Activity Filter Tabs */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tipo de Atividade
        </label>
        <GenericTabsNavigation
          items={activityTabItems}
          activeTab={activeActivityTab}
          onChange={handleActivityTabChangeWithCallback}
          variant="compact"
          data-tour="transaction-activity-tabs"
        />
      </div>

      {/* Direction Filter Tabs */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Direção do Fluxo
        </label>
        <GenericTabsNavigation
          items={directionTabItems}
          activeTab={activeDirectionTab}
          onChange={handleDirectionTabChangeWithCallback}
          variant="compact"
          data-tour="transaction-direction-tabs"
        />
      </div>

      {/* Period Filter Tabs */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Período
        </label>
        <GenericTabsNavigation
          items={periodTabItems}
          activeTab={activePeriodTab}
          onChange={handlePeriodTabChangeWithCallback}
          variant="compact"
          data-tour="transaction-period-tabs"
        />
      </div>

      {/* Custom Date Range */}
      {showCustomDates && (
        <animated.div style={customDateAnimation} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              Data inicial
            </label>
            <input
              type="date"
              value={filters.customDateRange?.from ?? ''}
              onChange={(e) => handleCustomDateChange('from', e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 text-sm bg-white/60 dark:bg-[#262626]/60 border border-gray-200 dark:border-gray-700 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed "
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              Data final
            </label>
            <input
              type="date"
              value={filters.customDateRange?.to ?? ''}
              onChange={(e) => handleCustomDateChange('to', e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 text-sm bg-white/60 dark:bg-[#262626]/60 border border-gray-200 dark:border-gray-700 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed "
            />
          </div>
        </animated.div>
      )}

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={clearAllFilters}
            disabled={loading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-neutral-600 hover:bg-gray-100 dark:hover:bg-neutral-700"
          >
            <i className="ph-bold ph-x-circle text-base" />
            Limpar Filtros
          </Button>
        </div>
      )}
    </div>
  )
}