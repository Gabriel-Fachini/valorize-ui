/**
 * TransactionFilters Component
 * Filter controls for transaction history
 */

import { useState, useCallback } from 'react'
import { animated } from '@react-spring/web'
import type { TransactionFilters as FiltersType, BalanceType, TransactionType } from '@/types'

interface TransactionFiltersProps {
  filters: FiltersType
  onFiltersChange: (filters: FiltersType) => void
  loading?: boolean
  className?: string
}

export const TransactionFilters = ({
  filters,
  onFiltersChange,
  loading = false,
  className = '',
}: TransactionFiltersProps) => {
  const [showDateFilters, setShowDateFilters] = useState(false)

  // Handle filter changes
  const handleBalanceTypeChange = useCallback((balanceType: BalanceType | undefined) => {
    onFiltersChange({ ...filters, balanceType })
  }, [filters, onFiltersChange])

  const handleTransactionTypeChange = useCallback((transactionType: TransactionType | undefined) => {
    onFiltersChange({ ...filters, transactionType })
  }, [filters, onFiltersChange])

  const handleDateChange = useCallback((field: 'fromDate' | 'toDate', value: string) => {
    onFiltersChange({ ...filters, [field]: value || undefined })
  }, [filters, onFiltersChange])

  const clearAllFilters = useCallback(() => {
    onFiltersChange({})
    setShowDateFilters(false)
  }, [onFiltersChange])

  const hasActiveFilters = !!(filters.balanceType ?? filters.transactionType ?? filters.fromDate ?? filters.toDate)

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Balance Type Filters */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Tipo de Moeda
        </h4>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleBalanceTypeChange(undefined)}
            disabled={loading}
            className={`px-3 py-2 backdrop-blur-sm border rounded-lg text-xs sm:text-sm font-medium transition-all hover:scale-105 ${
              !filters.balanceType
                ? 'bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300'
                : 'bg-white/60 dark:bg-gray-700/60 border-white/30 dark:border-gray-600/30 text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/80'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Todas
          </button>
          <button 
            onClick={() => handleBalanceTypeChange('COMPLIMENT')}
            disabled={loading}
            className={`px-3 py-2 backdrop-blur-sm border rounded-lg text-xs sm:text-sm font-medium transition-all hover:scale-105 ${
              filters.balanceType === 'COMPLIMENT'
                ? 'bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300'
                : 'bg-white/60 dark:bg-gray-700/60 border-white/30 dark:border-gray-600/30 text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/80'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Para Elogiar
          </button>
          <button 
            onClick={() => handleBalanceTypeChange('REDEEMABLE')}
            disabled={loading}
            className={`px-3 py-2 backdrop-blur-sm border rounded-lg text-xs sm:text-sm font-medium transition-all hover:scale-105 ${
              filters.balanceType === 'REDEEMABLE'
                ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                : 'bg-white/60 dark:bg-gray-700/60 border-white/30 dark:border-gray-600/30 text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/80'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Para Resgatar
          </button>
        </div>
      </div>

      {/* Transaction Type Filters */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Tipo de Transação
        </h4>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleTransactionTypeChange(undefined)}
            disabled={loading}
            className={`px-3 py-2 backdrop-blur-sm border rounded-lg text-xs sm:text-sm font-medium transition-all hover:scale-105 ${
              !filters.transactionType
                ? 'bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300'
                : 'bg-white/60 dark:bg-gray-700/60 border-white/30 dark:border-gray-600/30 text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/80'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Todas
          </button>
          <button 
            onClick={() => handleTransactionTypeChange('CREDIT')}
            disabled={loading}
            className={`px-3 py-2 backdrop-blur-sm border rounded-lg text-xs sm:text-sm font-medium transition-all hover:scale-105 ${
              filters.transactionType === 'CREDIT'
                ? 'bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300'
                : 'bg-white/60 dark:bg-gray-700/60 border-white/30 dark:border-gray-600/30 text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/80'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            ⬆️ Recebidas
          </button>
          <button 
            onClick={() => handleTransactionTypeChange('DEBIT')}
            disabled={loading}
            className={`px-3 py-2 backdrop-blur-sm border rounded-lg text-xs sm:text-sm font-medium transition-all hover:scale-105 ${
              filters.transactionType === 'DEBIT'
                ? 'bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300'
                : 'bg-white/60 dark:bg-gray-700/60 border-white/30 dark:border-gray-600/30 text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/80'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            ⬇️ Gastas
          </button>
          <button 
            onClick={() => handleTransactionTypeChange('RESET')}
            disabled={loading}
            className={`px-3 py-2 backdrop-blur-sm border rounded-lg text-xs sm:text-sm font-medium transition-all hover:scale-105 ${
              filters.transactionType === 'RESET'
                ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                : 'bg-white/60 dark:bg-gray-700/60 border-white/30 dark:border-gray-600/30 text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/80'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Date Filters Toggle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Período
          </h4>
          <button
            onClick={() => setShowDateFilters(!showDateFilters)}
            disabled={loading}
            className={`
              text-xs px-2 py-1 rounded-md 
              ${showDateFilters 
                ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-50 dark:hover:bg-purple-900/20'}
            `}
          >
            {showDateFilters ? 'Ocultar' : 'Filtrar por data'}
          </button>
        </div>

        {showDateFilters && (
          <animated.div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Data inicial
              </label>
              <input
                type="date"
                value={filters.fromDate ?? ''}
                onChange={(e) => handleDateChange('fromDate', e.target.value)}
                disabled={loading}
                className={`
                  w-full px-3 py-2 text-sm
                  bg-white/60 dark:bg-gray-800/60 
                  border border-white/30 dark:border-gray-700/30
                  rounded-lg backdrop-blur-sm
                  focus:outline-none focus:ring-2 focus:ring-purple-500/50
                  text-gray-900 dark:text-gray-100
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Data final
              </label>
              <input
                type="date"
                value={filters.toDate ?? ''}
                onChange={(e) => handleDateChange('toDate', e.target.value)}
                disabled={loading}
                className={`
                  w-full px-3 py-2 text-sm
                  bg-white/60 dark:bg-gray-800/60 
                  border border-white/30 dark:border-gray-700/30
                  rounded-lg backdrop-blur-sm
                  focus:outline-none focus:ring-2 focus:ring-purple-500/50
                  text-gray-900 dark:text-gray-100
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              />
            </div>
          </animated.div>
        )}
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
          <button
            onClick={clearAllFilters}
            disabled={loading}
            className={`
              text-sm px-3 py-2 
              bg-gray-100 dark:bg-gray-800/60 
              border border-gray-200 dark:border-gray-700/30
              rounded-lg
              text-gray-700 dark:text-gray-300
              transition-all
              ${loading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-200 dark:hover:bg-gray-700/60'
              }
            `}
          >
            Limpar Filtros
          </button>
        </div>
      )}
    </div>
  )
}