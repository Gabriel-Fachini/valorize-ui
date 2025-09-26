import React from 'react'

export const SkeletonRedemptionCard: React.FC = () => {
  return (
    <div className="group rounded-3xl border border-gray-200/50 dark:border-white/10 bg-gradient-to-br from-white/90 via-white/80 to-gray-50/80 dark:from-white/10 dark:via-white/5 dark:to-gray-500/5 p-6 backdrop-blur-2xl shadow-sm">
      <div className="flex gap-6">
        {/* Image Skeleton with enhanced shimmer */}
        <div className="relative shrink-0">
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent animate-pulse" />
          </div>
        </div>
        
        <div className="flex-1 space-y-4">
          {/* Title Skeleton */}
          <div className="space-y-2">
            <div className="h-6 w-3/4 rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse" />
            <div className="h-4 w-1/2 rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse" />
          </div>
          
          {/* Info Section Skeleton */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-24 rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse" />
              <div className="h-4 w-16 rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="h-8 w-32 rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse" />
              <div className="h-4 w-20 rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse" />
            </div>
          </div>
          
          {/* Action Buttons Skeleton */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="h-10 w-32 rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse" />
            <div className="h-10 w-36 rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
