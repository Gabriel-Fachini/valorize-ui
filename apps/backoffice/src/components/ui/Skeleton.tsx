import React from 'react'
import { animated, useSpring } from '@react-spring/web'

export const SkeletonBase: React.FC<{
  className?: string
  children?: React.ReactNode
}> = ({ className = '', children }) => {
  const pulseAnimation = useSpring({
    from: { opacity: 0.3 },
    to: { opacity: 0.7 },
    loop: { reverse: true },
    config: { duration: 1000 },
  })

  return (
    // @ts-expect-error - animated component typing issue with react-spring
    <animated.div style={pulseAnimation as any} className={className}>
      {children}
    </animated.div>
  )
}

export const SkeletonText: React.FC<{
  className?: string
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  height?: 'sm' | 'md' | 'lg'
}> = ({
  className = '',
  width = 'md',
  height = 'md',
}) => {
  const widthClasses = {
    sm: 'w-16',
    md: 'w-24',
    lg: 'w-32',
    xl: 'w-48',
    full: 'w-full',
  }

  const heightClasses = {
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-6',
  }

  return (
    <SkeletonBase>
      <div className={`bg-neutral-300 dark:bg-neutral-600 rounded ${widthClasses[width]} ${heightClasses[height]} ${className}`} />
    </SkeletonBase>
  )
}

export const SkeletonAvatar: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  }

  return (
    <SkeletonBase>
      <div className={`bg-neutral-300 dark:bg-neutral-600 rounded-full ${sizeClasses[size]} ${className}`} />
    </SkeletonBase>
  )
}

export const SkeletonCard: React.FC<{
  children: React.ReactNode
  gradient?: 'green' | 'emerald' | 'neutral'
  className?: string
}> = ({ children, gradient = 'neutral', className = '' }) => {
  const gradientClasses = {
    green: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    emerald: 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
    neutral: 'bg-neutral-50 dark:bg-neutral-800',
  }

  return (
    <div className={`rounded-lg p-4 ${gradientClasses[gradient]} ${className}`}>
      {children}
    </div>
  )
}

export const SkeletonUserProfile: React.FC = () => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <SkeletonAvatar size="xl" />
      <div className="flex-1 min-w-0 space-y-2">
        <SkeletonText width="lg" height="lg" />
        <SkeletonText width="md" height="sm" />
      </div>
    </div>
  )
}

export const SkeletonNavigation: React.FC<{ itemCount?: number }> = ({ itemCount = 3 }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: itemCount }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 rounded-lg px-4 py-3">
          <SkeletonBase>
            <div className="h-5 w-5 bg-neutral-300 dark:bg-neutral-600 rounded" />
          </SkeletonBase>
          <SkeletonText width="md" />
        </div>
      ))}
    </div>
  )
}

// Generic Skeleton component
export const Skeleton: React.FC<{
  className?: string
}> = ({ className = '' }) => {
  return (
    <SkeletonBase>
      <div className={`bg-neutral-300 dark:bg-neutral-600 rounded ${className}`} />
    </SkeletonBase>
  )
}
