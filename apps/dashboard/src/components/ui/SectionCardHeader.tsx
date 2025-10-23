import * as React from 'react'
import { cn } from '@/lib/utils'

interface SectionCardHeaderProps {
  icon: string
  title: string
  description: string
  className?: string
}

export const SectionCardHeader = React.forwardRef<
  HTMLDivElement,
  SectionCardHeaderProps
>(({ icon, title, description, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-3', className)}
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
        <i className={`ph ${icon} text-2xl text-green-600 dark:text-green-400`} />
      </div>
      <div>
        <h2 className="text-2xl text-gray-900 dark:text-white font-semibold leading-none tracking-tight">
          {title}
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
          {description}
        </p>
      </div>
    </div>
  )
})

SectionCardHeader.displayName = 'SectionCardHeader'
