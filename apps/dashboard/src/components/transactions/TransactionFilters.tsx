/**
 * TransactionFilters Component
 * Improved user-friendly filter controls for transaction history
 */

import { useState, useCallback } from 'react'
import { animated, useSpring } from '@react-spring/web'
import { Button } from '@/components/ui/button'
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

export const TransactionFilters = ({
  filters,
  onFiltersChange,
  loading = false,
  className = '',
}: TransactionFiltersProps) => {
  const [showCustomDates, setShowCustomDates] = useState(false)

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
    <div className={`space-y-4 ${className}`}>
      {/* Table-style Filters */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                <div className="flex items-center gap-2">
                  <i className="ph ph-squares-four text-lg" aria-hidden="true" />
                  <span>Tipo de Atividade</span>
                </div>
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                <div className="flex items-center gap-2">
                  <i className="ph ph-arrows-left-right text-lg" aria-hidden="true" />
                  <span>Direção do Fluxo</span>
                </div>
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                <div className="flex items-center gap-2">
                  <i className="ph ph-calendar text-lg" aria-hidden="true" />
                  <span>Período</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Row 1 */}
            <tr>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleActivityChange('all')}
                  disabled={loading}
                  className={`
                    w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-300 ease-out
                    ${filters.activity === 'all'
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 scale-105 shadow-sm'
                      : 'bg-gray-100 dark:bg-[#404040] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#525252] hover:scale-102'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <div className="flex items-center gap-2">
                    <i className="ph ph-stack text-base" aria-hidden="true" />
                    <span>Todas</span>
                  </div>
                </button>
              </td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleDirectionChange('both')}
                  disabled={loading}
                  className={`
                    w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-300 ease-out
                    ${filters.direction === 'both'
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 scale-105 shadow-sm'
                      : 'bg-gray-100 dark:bg-[#404040] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#525252] hover:scale-102'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <div className="flex items-center gap-2">
                    <i className="ph ph-swap text-base" aria-hidden="true" />
                    <span>Ambos</span>
                  </div>
                </button>
              </td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleTimePeriodChange('today')}
                  disabled={loading}
                  className={`
                    w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-300 ease-out
                    ${filters.timePeriod === 'today'
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 scale-105 shadow-sm'
                      : 'bg-gray-100 dark:bg-[#404040] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#525252] hover:scale-102'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <div className="flex items-center gap-2">
                    <i className="ph ph-calendar-blank text-base" aria-hidden="true" />
                    <span>Hoje</span>
                  </div>
                </button>
              </td>
            </tr>

            {/* Row 2 */}
            <tr>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleActivityChange('praises')}
                  disabled={loading}
                  className={`
                    w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-300 ease-out
                    ${filters.activity === 'praises'
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 scale-105 shadow-sm'
                      : 'bg-gray-100 dark:bg-[#404040] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#525252] hover:scale-102'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <div className="flex items-center gap-2">
                    <i className="ph ph-chat-circle-dots text-base" aria-hidden="true" />
                    <span>Elogios</span>
                  </div>
                </button>
              </td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleDirectionChange('in')}
                  disabled={loading}
                  className={`
                    w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-300 ease-out
                    ${filters.direction === 'in'
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 scale-105 shadow-sm'
                      : 'bg-gray-100 dark:bg-[#404040] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#525252] hover:scale-102'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <div className="flex items-center gap-2">
                    <i className="ph ph-arrow-down-left text-base" aria-hidden="true" />
                    <span>Entrada</span>
                  </div>
                </button>
              </td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleTimePeriodChange('week')}
                  disabled={loading}
                  className={`
                    w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-300 ease-out
                    ${filters.timePeriod === 'week'
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 scale-105 shadow-sm'
                      : 'bg-gray-100 dark:bg-[#404040] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#525252] hover:scale-102'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <div className="flex items-center gap-2">
                    <i className="ph ph-calendar-check text-base" aria-hidden="true" />
                    <span>Esta Semana</span>
                  </div>
                </button>
              </td>
            </tr>

            {/* Row 3 */}
            <tr>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleActivityChange('prizes')}
                  disabled={loading}
                  className={`
                    w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-300 ease-out
                    ${filters.activity === 'prizes'
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 scale-105 shadow-sm'
                      : 'bg-gray-100 dark:bg-[#404040] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#525252] hover:scale-102'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <div className="flex items-center gap-2">
                    <i className="ph ph-gift text-base" aria-hidden="true" />
                    <span>Prêmios</span>
                  </div>
                </button>
              </td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleDirectionChange('out')}
                  disabled={loading}
                  className={`
                    w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-300 ease-out
                    ${filters.direction === 'out'
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 scale-105 shadow-sm'
                      : 'bg-gray-100 dark:bg-[#404040] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#525252] hover:scale-102'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <div className="flex items-center gap-2">
                    <i className="ph ph-arrow-up-right text-base" aria-hidden="true" />
                    <span>Saída</span>
                  </div>
                </button>
              </td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleTimePeriodChange('month')}
                  disabled={loading}
                  className={`
                    w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-300 ease-out
                    ${filters.timePeriod === 'month'
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 scale-105 shadow-sm'
                      : 'bg-gray-100 dark:bg-[#404040] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#525252] hover:scale-102'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <div className="flex items-center gap-2">
                    <i className="ph ph-calendar text-base" aria-hidden="true" />
                    <span>Este Mês</span>
                  </div>
                </button>
              </td>
            </tr>

            {/* Row 4 */}
            <tr>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleActivityChange('system')}
                  disabled={loading}
                  className={`
                    w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-300 ease-out
                    ${filters.activity === 'system'
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 scale-105 shadow-sm'
                      : 'bg-gray-100 dark:bg-[#404040] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#525252] hover:scale-102'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <div className="flex items-center gap-2">
                    <i className="ph ph-gear text-base" aria-hidden="true" />
                    <span>Sistema</span>
                  </div>
                </button>
              </td>
              <td className="py-2 px-4">
                {/* Empty cell */}
              </td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleTimePeriodChange('custom')}
                  disabled={loading}
                  className={`
                    w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-300 ease-out
                    ${filters.timePeriod === 'custom'
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 scale-105 shadow-sm'
                      : 'bg-gray-100 dark:bg-[#404040] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#525252] hover:scale-102'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <div className="flex items-center gap-2">
                    <i className="ph ph-calendar-dots text-base" aria-hidden="true" />
                    <span>Personalizado</span>
                  </div>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Custom Date Range */}
      {showCustomDates && (
        <animated.div style={customDateAnimation} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
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
        <div className="pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
          <Button
            onClick={clearAllFilters}
            disabled={loading}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto flex items-center gap-2 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300 hover:border-green-300 dark:hover:border-green-700 transition-all"
          >
            <i className="ph ph-x-circle text-base" aria-hidden="true" />
            <span>Limpar Filtros</span>
          </Button>
        </div>
      )}
    </div>
  )
}