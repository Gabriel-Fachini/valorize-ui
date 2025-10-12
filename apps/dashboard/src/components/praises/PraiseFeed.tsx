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
            className={`px-3 py-2 sm:px-4 sm:py-2 backdrop-blur-sm border rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:scale-105 transition-all duration-200 ${
              currentFilter === 'all'
                ? 'bg-primary-100 dark:bg-primary-900/40 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300'
                : 'bg-white/60 dark:bg-[#2a2a2a]/60 border-white/30 dark:border-neutral-600/30 text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-[#353535]/80'
            }`}
          >
            Todos
          </button>
          <button 
            onClick={() => onFilterChange?.('received')}
            className={`px-3 py-2 sm:px-4 sm:py-2 backdrop-blur-sm border rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:scale-105 transition-all duration-200 ${
              currentFilter === 'received'
                ? 'bg-primary-100 dark:bg-primary-900/40 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300'
                : 'bg-white/60 dark:bg-[#2a2a2a]/60 border-white/30 dark:border-neutral-600/30 text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-[#353535]/80'
            }`}
          >
            Recebidos
          </button>
          <button 
            onClick={() => onFilterChange?.('sent')}
            className={`px-3 py-2 sm:px-4 sm:py-2 backdrop-blur-sm border rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:scale-105 transition-all duration-200 ${
              currentFilter === 'sent'
                ? 'bg-primary-100 dark:bg-primary-900/40 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300'
                : 'bg-white/60 dark:bg-[#2a2a2a]/60 border-white/30 dark:border-neutral-600/30 text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-[#353535]/80'
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
