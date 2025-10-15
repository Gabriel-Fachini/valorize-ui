/**
 * SkeletonTransactionCard Component
 * Loading state for transaction cards
 */

import { animated } from '@react-spring/web'

interface SkeletonTransactionCardProps {
  style?: React.CSSProperties
  className?: string
}

export const SkeletonTransactionCard = ({ 
  style = {},
  className = '',
}: SkeletonTransactionCardProps) => {
  return (
    <animated.div 
      style={style}
      className={`
        bg-white/60 dark:bg-[#262626]/60 backdrop-blur-sm 
        border border-white/30 dark:border-gray-700/30 
        rounded-xl sm:rounded-2xl p-4 sm:p-6
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        {/* Left side - Transaction info skeleton */}
        <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
          {/* Icon skeleton */}
          <div className="
            w-10 h-10 sm:w-12 sm:h-12 
            bg-gray-300 dark:bg-gray-600
            rounded-xl sm:rounded-2xl
            animate-pulse
          " />
          
          {/* Transaction details skeleton */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              {/* Title skeleton */}
              <div className="h-4 sm:h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-32 sm:w-40" />
              {/* Amount skeleton */}
              <div className="h-4 sm:h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-16 sm:w-20" />
            </div>
            
            {/* Description skeleton */}
            <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24 sm:w-32 mb-2" />
            
            {/* Balance info skeleton */}
            <div className="flex items-center justify-between">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20 sm:w-28" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20 sm:w-28" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer skeleton */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16 sm:w-20" />
      </div>
    </animated.div>
  )
}