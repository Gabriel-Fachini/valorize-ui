import React from 'react'
import { Card } from '@/components/ui/card'

export const SkeletonRedemptionCard: React.FC = () => {
  return (
    <Card className="p-6 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
      <div className="flex gap-6">
        {/* Image Skeleton */}
        <div className="shrink-0">
          <div className="h-24 w-24 rounded-xl bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        </div>
        
        <div className="flex-1 space-y-4">
          {/* Title Skeleton */}
          <div className="space-y-2">
            <div className="h-6 w-3/4 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
            <div className="h-4 w-1/2 rounded-md bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
          </div>
          
          {/* Info Section Skeleton */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-24 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
              <div className="h-4 w-16 rounded-md bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="h-8 w-32 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
              <div className="h-4 w-20 rounded-md bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
            </div>
          </div>
          
          {/* Action Button Skeleton */}
          <div className="flex items-center justify-end pt-2">
            <div className="h-10 w-32 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
          </div>
        </div>
      </div>
    </Card>
  )
}
