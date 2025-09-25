/**
 * PraiseFeed Component
 * Feed section with filters and praise cards
 */

import { animated } from '@react-spring/web'
import { PraiseCard } from './PraiseCard'
import { SkeletonPraiseCard } from './SkeletonPraiseCard'
import { EmptyState } from './EmptyState'
import type { PraiseData } from '@/hooks/usePraisesData'

interface PraiseFeedProps {
  praises: PraiseData[]
  currentFilter: 'all' | 'sent' | 'received'
  trail: Array<Record<string, unknown>>
  filterAnimation: Record<string, unknown>
  feedSectionAnimation: Record<string, unknown>
  onNewPraise?: () => void
  onLikePraise?: (praiseId: string) => void
  onFilterChange?: (filter: 'all' | 'sent' | 'received') => void
  loading?: boolean
}

export const PraiseFeed = ({ 
  praises, 
  currentFilter,
  trail, 
  filterAnimation, 
  feedSectionAnimation,
  onNewPraise,
  onLikePraise,
  onFilterChange,
  loading = false,
}: PraiseFeedProps) => {
  return (
    <animated.div style={feedSectionAnimation} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
          Feed de Reconhecimentos
        </h2>
        <animated.div style={filterAnimation} className="flex flex-wrap gap-2 sm:space-x-2">
          <button 
            onClick={() => onFilterChange?.('all')}
            className={`px-3 py-2 sm:px-4 sm:py-2 backdrop-blur-sm border rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:scale-105 ${
              currentFilter === 'all'
                ? 'bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300'
                : 'bg-white/60 dark:bg-gray-700/60 border-white/30 dark:border-gray-600/30 text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/80'
            }`}
          >
            Todos
          </button>
          <button 
            onClick={() => onFilterChange?.('received')}
            className={`px-3 py-2 sm:px-4 sm:py-2 backdrop-blur-sm border rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:scale-105 ${
              currentFilter === 'received'
                ? 'bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300'
                : 'bg-white/60 dark:bg-gray-700/60 border-white/30 dark:border-gray-600/30 text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/80'
            }`}
          >
            Recebidos
          </button>
          <button 
            onClick={() => onFilterChange?.('sent')}
            className={`px-3 py-2 sm:px-4 sm:py-2 backdrop-blur-sm border rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:scale-105 ${
              currentFilter === 'sent'
                ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                : 'bg-white/60 dark:bg-gray-700/60 border-white/30 dark:border-gray-600/30 text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/80'
            }`}
          >
            Enviados
          </button>
        </animated.div>
      </div>

      {/* Praise Cards, Skeletons, or Empty State */}
      {loading ? (
        <div className="space-y-4 sm:space-y-6">
          {Array.from({ length: 3 }).map((_, index) => {
            // Apply trail animation in reverse order for cascading effect
            const reversedIndex = 2 - index
            const style = trail[reversedIndex] || {}
            
            return (
              <animated.div key={`skeleton-${index}`} style={style}>
                <SkeletonPraiseCard />
              </animated.div>
            )
          })}
        </div>
      ) : praises.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          {praises.map((praise, index) => {
            // Apply trail animation in reverse order for cascading effect
            const reversedIndex = praises.length - 1 - index
            const style = trail[reversedIndex] || {}
            
            return (
              <animated.div key={praise.id} style={style}>
                <PraiseCard
                  praise={praise}
                  onLike={onLikePraise}
                />
              </animated.div>
            )
          })}
        </div>
      ) : (
        <EmptyState
          type="praises"
          onAction={onNewPraise}
        />
      )}
    </animated.div>
  )
}
