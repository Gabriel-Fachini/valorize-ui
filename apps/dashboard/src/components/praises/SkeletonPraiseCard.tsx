/**
 * SkeletonPraiseCard Component
 * Loading skeleton for praise cards that works in light and dark themes
 */

import { animated } from '@react-spring/web'

interface SkeletonPraiseCardProps {
  style?: React.CSSProperties
}

export const SkeletonPraiseCard = ({ style = {} }: SkeletonPraiseCardProps) => {
  return (
    <animated.div
      style={style}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl"
    >
      <div className="flex items-start space-x-3 sm:space-x-4">
        {/* Avatar Skeleton */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 sm:gap-0">
            <div className="flex items-center space-x-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
          </div>

          {/* Message Skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
          </div>

          {/* Footer Skeleton */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20 animate-pulse"></div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-12 animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  )
}