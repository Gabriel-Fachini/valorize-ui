/**
 * TransactionFeed Component
 * Refactored to use new components and follow SOLID principles
 */

import { animated } from '@react-spring/web'
import { TransactionList } from './TransactionList'
import { TransactionFilters } from './TransactionFilters'
import { LoadMoreButton } from '@/components/ui/LoadMoreButton'
import { FilterContainer } from '@/components/ui/FilterContainer'
import type { Transaction, TransactionUIFilters } from '@/types'

interface TransactionFeedProps {
  transactions: Transaction[]
  filters: TransactionUIFilters
  hasMore: boolean
  loading: boolean
  loadingMore: boolean
  filtersAnimation: Record<string, unknown>
  feedSectionAnimation: Record<string, unknown>
  onFiltersChange: (filters: TransactionUIFilters) => void
  onLoadMore: () => void
  className?: string
}

export const TransactionFeed = ({ 
  transactions,
  filters,
  hasMore,
  loading,
  loadingMore,
  filtersAnimation,
  feedSectionAnimation,
  onFiltersChange,
  onLoadMore,
  className = '',
}: TransactionFeedProps) => {
  return (
    <animated.div style={feedSectionAnimation} className={`space-y-6 ${className}`}>
      {/* Filters */}
      <animated.div style={filtersAnimation}>
        <FilterContainer title="Filtros de Busca">
          <TransactionFilters
            filters={filters}
            onFiltersChange={onFiltersChange}
            loading={loading}
          />
        </FilterContainer>
      </animated.div>

      {/* Transaction List */}
      <TransactionList
        transactions={transactions}
        loading={loading}
        emptyState={
          <div className="bg-white/40 dark:bg-[#262626]/40 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ph ph-chart-bar text-3xl sm:text-4xl text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Nenhuma transação encontrada
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Suas movimentações de moedas aparecerão aqui quando você enviar elogios ou resgatar prêmios.
              </p>
            </div>
          </div>
        }
      />

      {/* Load More Button */}
      <LoadMoreButton
        hasMore={hasMore}
        loading={loadingMore}
        onLoadMore={onLoadMore}
        buttonText="Carregar Mais Transações"
      />

      {/* Loading overlay for filter changes */}
      {loading && transactions.length > 0 && (
        <div className="fixed inset-0 z-50 bg-white/20 dark:bg-[#171717]/20 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-xl flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent" />
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              Carregando transações...
            </span>
          </div>
        </div>
      )}
    </animated.div>
  )
}