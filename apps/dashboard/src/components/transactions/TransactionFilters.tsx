/**
 * TransactionFilters Component
 * Improved user-friendly filter controls for transaction history
 */

import { useState, useCallback } from 'react'
import { animated, useSpring } from '@react-spring/web'
import { Button } from '@/components/ui/button'
import { FilterButtonGroup } from '@/components/ui/FilterButtonGroup'
import type { 
  TransactionUIFilters, 
  ActivityFilter, 
  DirectionFilter, 
  TimePeriodFilter,
} from '@/types'

interface TransactionFiltersProps {
  filters: TransactionUIFilters
  onFiltersChange: (filters: TransactionUIFilters) => void
  loading?: boolean
  className?: string
}

// Filter options
const ACTIVITY_OPTIONS = [
  { label: 'Todas', value: 'all' as ActivityFilter, icon: 'ph-bold ph-stack' },
  { label: 'Elogios', value: 'praises' as ActivityFilter, icon: 'ph-bold ph-chat-circle-dots' },
  { label: 'Prêmios', value: 'prizes' as ActivityFilter, icon: 'ph-bold ph-gift' },
  { label: 'Sistema', value: 'system' as ActivityFilter, icon: 'ph-bold ph-gear' },
]

const DIRECTION_OPTIONS = [
  { label: 'Ambos', value: 'both' as DirectionFilter, icon: 'ph-bold ph-swap' },
  { label: 'Entrada', value: 'in' as DirectionFilter, icon: 'ph-bold ph-arrow-down-left' },
  { label: 'Saída', value: 'out' as DirectionFilter, icon: 'ph-bold ph-arrow-up-right' },
]

const PERIOD_OPTIONS = [
  { label: 'Hoje', value: 'today' as TimePeriodFilter, icon: 'ph-bold ph-calendar-blank' },
  { label: 'Esta Semana', value: 'week' as TimePeriodFilter, icon: 'ph-bold ph-calendar-check' },
  { label: 'Este Mês', value: 'month' as TimePeriodFilter, icon: 'ph-bold ph-calendar' },
  { label: 'Personalizado', value: 'custom' as TimePeriodFilter, icon: 'ph-bold ph-calendar-dots' },
]

export const TransactionFilters = ({
  filters,
  onFiltersChange,
  loading = false,
  className = '',
}: TransactionFiltersProps) => {
  const [showCustomDates, setShowCustomDates] = useState(filters.timePeriod === 'custom')

  // Animation for custom date fields
  const customDateAnimation = useSpring({
    opacity: showCustomDates ? 1 : 0,
    height: showCustomDates ? 'auto' : 0,
    config: { tension: 300, friction: 30 },
  })

  // Handle activity filter change
  const handleActivityChange = useCallback((activity: ActivityFilter) => {
    onFiltersChange({ ...filters, activity })
  }, [filters, onFiltersChange])

  // Handle direction filter change
  const handleDirectionChange = useCallback((direction: DirectionFilter) => {
    onFiltersChange({ ...filters, direction })
  }, [filters, onFiltersChange])

  // Handle time period change
  const handleTimePeriodChange = useCallback((timePeriod: TimePeriodFilter) => {
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
  }, [filters, onFiltersChange])

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
      {/* Activity Filter */}
      <FilterButtonGroup
        label="Tipo de Atividade"
        options={ACTIVITY_OPTIONS}
        value={filters.activity}
        onChange={handleActivityChange}
        disabled={loading}
      />

      {/* Direction Filter */}
      <FilterButtonGroup
        label="Direção do Fluxo"
        options={DIRECTION_OPTIONS}
        value={filters.direction}
        onChange={handleDirectionChange}
        disabled={loading}
      />

      {/* Period Filter */}
      <FilterButtonGroup
        label="Período"
        options={PERIOD_OPTIONS}
        value={filters.timePeriod}
        onChange={handleTimePeriodChange}
        disabled={loading}
      />

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
              className="w-full px-3 py-2 text-sm bg-white/60 dark:bg-[#262626]/60 border border-gray-200 dark:border-gray-700 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
              className="w-full px-3 py-2 text-sm bg-white/60 dark:bg-[#262626]/60 border border-gray-200 dark:border-gray-700 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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