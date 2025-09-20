/**
 * PraiseFeed Component
 * Feed section with filters and praise cards
 */

import { animated } from '@react-spring/web'
import { PraiseCard } from './PraiseCard'
import { EmptyState } from './EmptyState'
import type { PraiseData } from '@/hooks/usePraisesData'

interface PraiseFeedProps {
  praises: PraiseData[]
  trail: Array<Record<string, unknown>>
  filterAnimation: Record<string, unknown>
  feedSectionAnimation: Record<string, unknown>
  onNewPraise?: () => void
  onLikePraise?: (praiseId: string) => void
}

export const PraiseFeed = ({ 
  praises, 
  trail, 
  filterAnimation, 
  feedSectionAnimation,
  onNewPraise,
  onLikePraise,
}: PraiseFeedProps) => {
  return (
    <animated.div style={feedSectionAnimation} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
          Feed de Reconhecimentos
        </h2>
        <animated.div style={filterAnimation} className="flex flex-wrap gap-2 sm:space-x-2">
          <button className="px-3 py-2 sm:px-4 sm:py-2 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/80 hover:scale-105 duration-200">
            Todos
          </button>
          <button className="px-3 py-2 sm:px-4 sm:py-2 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/80 hover:scale-105 duration-200">
            Recebidos
          </button>
          <button className="px-3 py-2 sm:px-4 sm:py-2 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/80 hover:scale-105 duration-200">
            Enviados
          </button>
        </animated.div>
      </div>

      {/* Praise Cards or Empty State */}
      {praises.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          {trail.map((style, index) => {
            const praise = praises[index]
            if (!praise) return null
            
            return (
              <PraiseCard
                key={praise.id}
                praise={praise}
                style={style}
                onLike={onLikePraise}
              />
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