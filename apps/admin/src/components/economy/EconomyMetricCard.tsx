/**
 * Economy Metric Card Component
 * Generic card for displaying economy metrics
 */

import type { FC, ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from './StatusBadge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { EconomyStatus } from '@/types/economy'

interface EconomyMetricCardProps {
  title: string
  icon: ReactNode
  status: EconomyStatus
  children: ReactNode
  isLoading?: boolean
  className?: string
  tooltipText?: string
  tooltipExpandedText?: string
  metaText?: string
}

/**
 * EconomyMetricCard - Generic card for metric display
 *
 * Features:
 * - Header with title and icon
 * - Status badge with semantic colors
 * - Customizable content via children
 * - Loading skeleton state
 * - Responsive design
 */
export const EconomyMetricCard: FC<EconomyMetricCardProps> = ({
  title,
  icon,
  status,
  children,
  isLoading = false,
  className = '',
  tooltipText,
  tooltipExpandedText,
  metaText,
}) => {
  if (isLoading) {
    return (
      <Card className={`${className}`} role="region" aria-busy="true" aria-label="Carregando métrica">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <div className="h-5 w-32 bg-muted animate-pulse rounded" />
              <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            </div>
            <div className="text-2xl text-muted">{icon}</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted/60 animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-muted/60 animate-pulse rounded" />
          </div>
          <p className="text-xs text-muted-foreground mt-3 animate-pulse">Carregando dados...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${className}`} role="region" aria-labelledby={`card-title-${title}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-lg" id={`card-title-${title}`}>{title}</CardTitle>
              {tooltipText && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded p-1"
                        aria-label={`Informações sobre ${title}`}
                        type="button"
                      >
                        <i className="ph ph-info text-xl" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md">
                      <p className="text-base font-medium mb-2">{tooltipText}</p>
                      {tooltipExpandedText && (
                        <p className="text-sm text-muted-foreground whitespace-pre-line mt-2 pt-2 border-t">
                          {tooltipExpandedText}
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <StatusBadge status={status} />
            {metaText && (
              <Badge variant="outline" className="text-xs font-normal">
                {metaText}
              </Badge>
            )}
          </div>
          <div className="text-3xl text-primary/70 transition-transform hover:scale-110" aria-hidden="true">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}
