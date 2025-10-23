import React from 'react'
import { animated } from '@react-spring/web'
import { SkeletonBase } from '@/components/ui/Skeleton'

interface SkeletonPrizeCardProps {
  style?: React.CSSProperties
  className?: string
}

export const SkeletonPrizeCard: React.FC<SkeletonPrizeCardProps> = ({ 
  style = {},
  className = '',
}) => {
  return (
    <animated.div
      style={style}
      className={`h-full rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl ${className}`}
    >
      {/* Image Skeleton */}
      <div className="aspect-square bg-neutral-200 dark:bg-neutral-800/50 rounded-t-2xl" />
      
      <div className="p-5 space-y-3">
        {/* Category Badge Skeleton */}
        <div className="flex items-center justify-between">
          <SkeletonBase>
            <div className="h-6 w-20 bg-neutral-300 dark:bg-neutral-700/50 rounded-full" />
          </SkeletonBase>
          <SkeletonBase>
            <div className="h-5 w-16 bg-neutral-300 dark:bg-neutral-700/50 rounded-full" />
          </SkeletonBase>
        </div>
        
        {/* Title Skeleton */}
        <SkeletonBase>
          <div className="h-4 bg-neutral-300 dark:bg-neutral-700/50 rounded w-3/4" />
        </SkeletonBase>
        
        {/* Description Skeleton */}
        <SkeletonBase>
          <div className="h-3 bg-neutral-300 dark:bg-neutral-700/50 rounded w-full" />
        </SkeletonBase>
        <SkeletonBase>
          <div className="h-3 bg-neutral-300 dark:bg-neutral-700/50 rounded w-1/2" />
        </SkeletonBase>
        
        {/* Price Skeleton */}
        <div className="pt-3 border-t border-gray-100 dark:border-white/5">
          <SkeletonBase>
            <div className="h-8 bg-neutral-300 dark:bg-neutral-700/50 rounded w-24" />
          </SkeletonBase>
        </div>
      </div>
    </animated.div>
  )
}
