import React from 'react'
import { cn } from '@/lib/utils'

interface ArrowProps {
  styles?: any
  inverted?: boolean
  disabled?: boolean
}

export const TourArrow: React.FC<ArrowProps> = ({
  styles,
  inverted = false,
  disabled = false,
}) => {
  return (
    <div
      className={cn(
        'w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white dark:border-b-gray-800',
        inverted && 'border-t-8 border-b-0 border-t-white dark:border-t-gray-800',
        disabled && 'opacity-50',
      )}
      style={styles}
    />
  )
}
