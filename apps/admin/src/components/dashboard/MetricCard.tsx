import type { FC, ReactNode } from 'react'

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
}

export const MetricCard: FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between">
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
    <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
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
          <div className="rounded-full bg-primary/10 p-3 text-primary">
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
