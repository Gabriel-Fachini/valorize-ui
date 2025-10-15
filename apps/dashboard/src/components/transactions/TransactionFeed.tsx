/**
 * TransactionFeed Component
 * Feed section with transaction list and load more functionality
 */

import { animated } from '@react-spring/web'
import { TransactionCard } from './TransactionCard'
import { SkeletonTransactionCard } from './SkeletonTransactionCard'
import { EmptyState } from './EmptyState'
import { TransactionFilters } from './TransactionFilters'
import type { Transaction, TransactionUIFilters } from '@/types'

interface TransactionFeedProps {
  transactions: Transaction[]
  filters: TransactionUIFilters
  hasMore: boolean
  loading: boolean
  loadingMore: boolean
  trail: Array<Record<string, unknown>>
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
  trail,
  filtersAnimation,
  feedSectionAnimation,
  onFiltersChange,
  onLoadMore,
  className = '',
}: TransactionFeedProps) => {
  return (
    <animated.div style={feedSectionAnimation} className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
          Histórico de Transações
        </h2>
      </div>

      {/* Filters */}
      <animated.div style={filtersAnimation}>
        <div className="
          bg-white/40 dark:bg-[#262626]/40 backdrop-blur-sm 
          border border-white/30 dark:border-gray-700/30 
          rounded-xl sm:rounded-2xl p-4 sm:p-6
        ">
          <TransactionFilters
            filters={filters}
            onFiltersChange={onFiltersChange}
            loading={loading}
          />
        </div>
      </animated.div>

      {/* Transaction Cards, Skeletons, or Empty State */}
      {loading && transactions.length === 0 ? (
        <div className="space-y-4 sm:space-y-6">
          {Array.from({ length: 5 }).map((_, index) => {
            // Apply trail animation in reverse order for cascading effect
            const reversedIndex = 4 - index
            const style = trail[reversedIndex] ?? {}
            
            return (
              <animated.div key={`skeleton-${index}`} style={style}>
                <SkeletonTransactionCard />
              </animated.div>
            )
          })}
        </div>
      ) : transactions.length > 0 ? (
        <>
          <div className="space-y-4 sm:space-y-6">
            {transactions.map((transaction, index) => {
              // Apply trail animation in reverse order for cascading effect
              const reversedIndex = transactions.length - 1 - index
              const style = trail[reversedIndex] ?? {}
              
              return (
                <animated.div key={transaction.id} style={style}>
                  <TransactionCard transaction={transaction} />
                </animated.div>
              )
            })}
          </div>

          {/* Load More Section */}
          {(hasMore || loadingMore) && (
            <div className="flex flex-col items-center space-y-4 pt-6">
              {loadingMore ? (
                <div className="space-y-4 w-full">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonTransactionCard key={`loading-${index}`} />
                  ))}
                </div>
              ) : hasMore ? (
                <button
                  onClick={onLoadMore}
                  className="
                    px-6 py-3 
                    bg-green-600 
                    hover:bg-green-700
                    text-white font-medium rounded-xl
                    transition-all duration-200 
                    hover:scale-105 hover:shadow-lg
                    focus:outline-none focus:ring-2 focus:ring-green-500/50
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  Carregar Mais Transações
                </button>
              ) : null}
            </div>
          )}
        </>
      ) : (
        <EmptyState
          message="Nenhuma transação encontrada"
          description="Suas movimentações de moedas aparecerão aqui quando você enviar elogios ou resgatar prêmios."
        />
      )}

      {/* Loading overlay for filter changes */}
      {loading && transactions.length > 0 && (
        <div className="
          fixed inset-0 z-50 
          bg-white/20 dark:bg-[#171717]/20 
          backdrop-blur-sm
          flex items-center justify-center
        ">
          <div className="
            bg-white dark:bg-[#262626] 
            rounded-xl p-6 shadow-xl
            flex items-center space-x-3
          ">
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