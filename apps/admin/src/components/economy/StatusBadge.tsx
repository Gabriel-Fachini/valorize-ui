/**
 * Status Badge Component
 * Visual indicator for economy status with semantic colors
 */

import type { FC } from 'react'
import { Badge } from '@/components/ui/badge'
import type { EconomyStatus } from '@/types/economy'

interface StatusBadgeProps {
  status: EconomyStatus
  className?: string
}

/**
 * StatusBadge - Displays status with icon and semantic color
 *
 * Status mapping:
 * - healthy: ✓ Green with "Saudável"
 * - warning: ! Yellow with "Atenção"
 * - critical: ! Red with "Crítico"
 * - excess: ℹ Blue with "Excedente"
 */
export const StatusBadge: FC<StatusBadgeProps> = ({ status, className }) => {
  const statusConfig = {
    healthy: {
      icon: 'ph-check-circle',
      label: 'Saudável',
      variant: 'default' as const,
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
    warning: {
      icon: 'ph-warning',
      label: 'Atenção',
      variant: 'secondary' as const,
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    },
    critical: {
      icon: 'ph-warning-circle',
      label: 'Crítico',
      variant: 'destructive' as const,
      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    },
    excess: {
      icon: 'ph-info',
      label: 'Excedente',
      variant: 'outline' as const,
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={`${config.className} ${className ?? ''}`}>
      <i className={`ph ${config.icon} mr-1.5 inline-block`} />
      {config.label}
    </Badge>
  )
}
