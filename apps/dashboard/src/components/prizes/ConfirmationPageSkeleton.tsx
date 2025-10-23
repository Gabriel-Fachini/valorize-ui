import { memo } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { SkeletonBase } from '@/components/ui/Skeleton'
import { usePageEntrance } from '@/hooks/useAnimations'
import { animated } from '@react-spring/web'

export const ConfirmationPageSkeleton = memo(() => {
  const fadeIn = usePageEntrance()

  return (
    <PageLayout maxWidth="4xl">
      <animated.div style={fadeIn} className="space-y-6">
        {/* Back button skeleton */}
        <SkeletonBase>
          <div className="h-10 w-24 rounded-lg bg-gray-200 dark:bg-[#262626]" />
        </SkeletonBase>

        {/* Title skeleton */}
        <SkeletonBase>
          <div className="h-9 w-64 rounded-lg bg-gray-200 dark:bg-[#262626]" />
        </SkeletonBase>

        {/* Prize Summary skeleton */}
        <SkeletonBase>
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-4 h-7 w-48 rounded-lg bg-gray-200 dark:bg-[#262626]" />
            <div className="flex gap-4">
              <div className="h-24 w-24 rounded-lg bg-gray-200 dark:bg-[#262626]" />
              <div className="flex-1 space-y-3">
                <div className="h-6 w-3/4 rounded-lg bg-gray-200 dark:bg-[#262626]" />
                <div className="h-5 w-1/2 rounded-full bg-gray-200 dark:bg-[#262626]" />
                <div className="h-8 w-32 rounded-lg bg-gray-200 dark:bg-[#262626]" />
              </div>
            </div>
          </div>
        </SkeletonBase>

        {/* Address Selection skeleton */}
        <SkeletonBase>
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-7 w-56 rounded-lg bg-gray-200 dark:bg-[#262626]" />
              <div className="h-10 w-40 rounded-lg bg-gray-200 dark:bg-[#262626]" />
            </div>
            <div className="space-y-3">
              <div className="h-32 rounded-lg bg-gray-200 dark:bg-[#262626]" />
              <div className="h-32 rounded-lg bg-gray-200 dark:bg-[#262626]" />
            </div>
          </div>
        </SkeletonBase>

        {/* Confirmation Button skeleton */}
        <SkeletonBase>
          <div className="h-14 w-full rounded-xl bg-gray-200 dark:bg-[#262626]" />
        </SkeletonBase>
      </animated.div>
    </PageLayout>
  )
})

ConfirmationPageSkeleton.displayName = 'ConfirmationPageSkeleton'
