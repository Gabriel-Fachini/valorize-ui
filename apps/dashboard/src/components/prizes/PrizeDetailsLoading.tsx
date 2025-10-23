import { type FC } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { SkeletonBase } from '@/components/ui/Skeleton'
import { usePageEntrance } from '@/hooks/useAnimations'
import { animated } from '@react-spring/web'

export const PrizeDetailsLoading: FC = () => {
  const fadeIn = usePageEntrance()

  return (
    <PageLayout maxWidth="6xl">
      <animated.div style={fadeIn} className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back button skeleton */}
        <SkeletonBase>
          <div className="mb-8 h-8 w-32 rounded bg-white/50 dark:bg-white/10" />
        </SkeletonBase>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left column skeleton */}
          <div>
            {/* Image carousel skeleton */}
            <SkeletonBase>
              <div className="aspect-[4/3] rounded-2xl bg-white/50 dark:bg-white/10" />
            </SkeletonBase>

            {/* Specifications skeleton */}
            <SkeletonBase>
              <div className="mt-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-4 h-6 w-32 rounded bg-white/50 dark:bg-white/10" />
                <div className="space-y-3">
                  <div className="h-4 w-full rounded bg-white/50 dark:bg-white/10" />
                  <div className="h-4 w-3/4 rounded bg-white/50 dark:bg-white/10" />
                  <div className="h-4 w-1/2 rounded bg-white/50 dark:bg-white/10" />
                </div>
              </div>
            </SkeletonBase>
          </div>

          {/* Right column skeleton */}
          <div className="space-y-6">
            {/* Header skeleton */}
            <div>
              <SkeletonBase>
                <div className="mb-3 h-8 w-3/4 rounded bg-white/50 dark:bg-white/10" />
              </SkeletonBase>
              <SkeletonBase>
                <div className="mb-4 h-4 w-1/2 rounded bg-white/50 dark:bg-white/10" />
              </SkeletonBase>
              <SkeletonBase>
                <div className="h-24 rounded bg-white/50 dark:bg-white/10" />
              </SkeletonBase>
            </div>

            {/* Variants skeleton */}
            <SkeletonBase>
              <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-4 h-6 w-24 rounded bg-white/50 dark:bg-white/10" />
                <div className="space-y-4">
                  <div className="h-4 w-32 rounded bg-white/50 dark:bg-white/10" />
                  <div className="flex gap-2">
                    <div className="h-8 w-16 rounded bg-white/50 dark:bg-white/10" />
                    <div className="h-8 w-20 rounded bg-white/50 dark:bg-white/10" />
                    <div className="h-8 w-14 rounded bg-white/50 dark:bg-white/10" />
                  </div>
                </div>
              </div>
            </SkeletonBase>

            {/* Pricing card skeleton */}
            <SkeletonBase>
              <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-6 flex items-center justify-between">
                  <div className="h-8 w-32 rounded bg-white/50 dark:bg-white/10" />
                  <div className="h-6 w-20 rounded bg-white/50 dark:bg-white/10" />
                </div>
                <div className="h-12 rounded bg-white/50 dark:bg-white/10" />
              </div>
            </SkeletonBase>
          </div>
        </div>
      </animated.div>
    </PageLayout>
  )
}
