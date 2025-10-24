import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  styles?: any
}

export const TourBadge: React.FC<BadgeProps> = ({
  styles,
}) => {
  return (
    <div
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold shadow-lg transition-all duration-200',
      )}
      style={styles}
    >
      1
    </div>
  )
}
