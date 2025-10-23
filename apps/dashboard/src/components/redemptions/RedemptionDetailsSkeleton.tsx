import React from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { Card } from '@/components/ui/card'

export const RedemptionDetailsSkeleton: React.FC = () => {
  return (
    <PageLayout maxWidth="5xl">
      <div className="relative z-10 space-y-8">
        {/* Back Button Skeleton */}
        <div className="h-12 w-48 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        
        {/* Hero Section Skeleton */}
        <Card className="p-8">
          <div className="flex items-start gap-8">
            <div className="h-32 w-32 rounded-xl bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
            <div className="flex-1 space-y-6">
              <div className="space-y-3">
                <div className="h-10 w-3/4 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                <div className="h-4 w-1/2 rounded-md bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-8 w-32 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                <div className="h-10 w-24 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
              </div>
            </div>
          </div>
        </Card>
        
        {/* Grid Skeleton */}
        <div className="grid gap-6 lg:gap-8 xl:grid-cols-3">
          <Card className="lg:col-span-2 p-8">
            <div className="h-8 w-64 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse mb-8" />
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-6">
                  <div className="h-12 w-12 rounded-xl bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 w-48 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                    <div className="h-4 w-32 rounded-md bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-8 space-y-6">
            <div className="h-8 w-40 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
            <div className="h-12 w-full rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
