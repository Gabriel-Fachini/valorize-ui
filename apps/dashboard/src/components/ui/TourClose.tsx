import React from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface CloseProps {
  styles?: any
  onClick?: () => void
  disabled?: boolean
}

export const TourClose: React.FC<CloseProps> = ({
  styles,
  onClick,
  disabled,
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
      style={styles}
    >
      <i className="ph ph-x text-base" />
    </Button>
  )
}
