
import { SkeletonText } from '@/components/ui/Skeleton'

export const SettingsTabsSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Tabs Skeleton */}
      <div className="grid w-full grid-cols-3 gap-4 mb-8">
        <div className="h-12 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
        <div className="h-12 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
        <div className="h-12 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
      </div>

      {/* Tab Content Skeleton */}
      <div className="space-y-8">
        <div className="space-y-4">
          <SkeletonText width="lg" height="lg" />
          <SkeletonText width="full" height="sm" />
        </div>
        <div className="space-y-4">
          <SkeletonText width="lg" height="lg" />
          <SkeletonText width="full" height="sm" />
        </div>
        <div className="space-y-4">
          <SkeletonText width="lg" height="lg" />
          <SkeletonText width="full" height="sm" />
        </div>
      </div>
    </div>
  )
}
