import React from 'react'
import { Badge } from '@/components/ui/badge'
import { getStatusInfo } from '@/lib/redemptionStatusConfig'
import { cn } from '@/lib/utils'

interface RedemptionStatusBadgeProps {
  status: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

const sizeConfig = {
  sm: {
    container: 'px-2 py-1 text-xs',
    icon: 'text-xs',
  },
  md: {
    container: 'px-3 py-1.5 text-sm',
    icon: 'text-sm',
  },
  lg: {
    container: 'px-4 py-2 text-base',
    icon: 'text-lg',
  },
}

export const RedemptionStatusBadge: React.FC<RedemptionStatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className,
}) => {
  const statusInfo = getStatusInfo(status)
  const sizeClasses = sizeConfig[size]

  return (
    <Badge
      className={cn(
        'flex items-center gap-1.5 font-bold border shrink-0',
        statusInfo.badge,
        sizeClasses.container,
        className,
      )}
      variant="outline"
    >
      {showIcon && (
        <i className={cn(statusInfo.icon, sizeClasses.icon)} />
      )}
      <span>{statusInfo.label}</span>
    </Badge>
  )
}
