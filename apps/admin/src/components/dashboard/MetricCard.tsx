import type { FC, ReactNode } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: {
    value: number
    label: string
  }
  isLoading?: boolean
  tooltip?: string
}

export const MetricCard: FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  isLoading = false,
  tooltip,
}) => {
  if (isLoading) {
    return (
      <div className="min-h-[180px] rounded-lg border bg-card p-6 shadow-sm flex flex-col">
        <div className="flex items-start justify-between flex-1">
          <div className="space-y-3 flex-1">
            {/* Title skeleton */}
            <div className="h-3.5 w-28 bg-muted/70 animate-pulse rounded" />
            {/* Value skeleton */}
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            {/* Subtitle skeleton */}
            <div className="h-3 w-32 bg-muted/50 animate-pulse rounded" />
          </div>
          {/* Icon skeleton */}
          <div className="rounded-full bg-primary/5 p-3">
            <div className="h-6 w-6 bg-muted/50 animate-pulse rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[180px] rounded-3xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-start justify-between flex-1">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {tooltip && (
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center hover:text-foreground transition-colors"
                    >
                      <i className="ph ph-info text-xl text-muted-foreground/70 hover:text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" side="right" align="start">
                    <p className="text-sm">{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-xs font-medium ${
                  trend.value >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="size-12 rounded-full bg-primary/10 p-3 text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

export const MetricCardSkeleton: FC = () => {
  return <MetricCard title="" value="" isLoading />
}
