import { animated } from '@react-spring/web'
import { useCardEntrance } from '@/hooks/useAnimations'
import { SkeletonBase, SkeletonText, SkeletonAvatar, SkeletonCard } from '@/components/ui/Skeleton'

export const NewPraiseSkeleton = () => {
  const cardAnimation = useCardEntrance()

  return (
    <animated.div style={cardAnimation} className="space-y-6">
      {/* Header Skeleton */}
      <div>
        <div className="mb-6 flex items-center space-x-2">
          <SkeletonBase>
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </SkeletonBase>
          <SkeletonText width="xl" height="md" />
        </div>
        
        <div className="mb-6">
          <SkeletonText width="lg" height="lg" className="mb-2" />
          <SkeletonText width="md" height="sm" />
        </div>

        {/* Progress Bar Skeleton */}
        <div className="flex space-x-2">
          {[...Array(5)].map((_, index) => (
            <SkeletonBase key={index}>
              <div className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </SkeletonBase>
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-6">
        <div>
          <SkeletonText width="full" height="lg" className="mb-2" />
          <SkeletonText width="lg" height="md" />
        </div>
        
        {/* Search Input Skeleton */}
        <SkeletonBase>
          <div className="w-full h-14 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
        </SkeletonBase>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} className="p-5 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-[#262626]">
              <div className="flex items-center space-x-4">
                <SkeletonAvatar size="lg" />
                <div className="flex-1 space-y-2">
                  <SkeletonText width="lg" height="md" />
                  <SkeletonText width="md" height="sm" />
                </div>
              </div>
            </SkeletonCard>
          ))}
        </div>
      </div>

      {/* Navigation Buttons Skeleton */}
      <div className="flex justify-between items-center pt-8 border-t border-gray-300 dark:border-gray-600">
        <SkeletonBase>
          <div className="w-32 h-14 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
        </SkeletonBase>
        <SkeletonBase>
          <div className="w-32 h-14 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
        </SkeletonBase>
      </div>
    </animated.div>
  )
}
