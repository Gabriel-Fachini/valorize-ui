import type { FC } from 'react'
import type { TypeBreakdownItem } from '@/types/redemptions'
import { animated, useSpring } from '@react-spring/web'

interface RedemptionTypeBreakdownProps {
  typeBreakdown?: TypeBreakdownItem[]
  isLoading?: boolean
}

const TYPE_ICONS: Record<string, string> = {
  voucher: 'ph-ticket',
  product: 'ph-package',
  physical: 'ph-package',
}

const TYPE_LABELS: Record<string, string> = {
  voucher: 'Voucher',
  product: 'Produto Físico',
  physical: 'Produto Físico',
}

const TypeBreakdownItem: FC<{
  type: TypeBreakdownItem
}> = ({ type }) => {
  return (
    <div className="p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <i className={`ph ${TYPE_ICONS[type.type] || 'ph-package'} text-lg`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium">{TYPE_LABELS[type.type] || type.type}</p>
            <p className="text-sm text-muted-foreground">
              {type.count} {type.count === 1 ? 'resgate' : 'resgates'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">{type.percentage.toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground">R$ {type.totalValueBRL}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${type.percentage}%` }}
        />
      </div>

      {/* Status breakdown */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(type.statusBreakdown).map(([status, count]) => (
          <div
            key={status}
            className="text-xs px-2 py-1 rounded-md bg-muted/50 text-muted-foreground border border-muted"
          >
            <span className="capitalize">{status}:</span> <span className="font-semibold">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const LoadingSkeleton: FC = () => (
  <div className="space-y-3">
    {[1, 2, 3].map(i => (
      <div key={i} className="p-4 rounded-lg border bg-card">
        {/* Header skeleton */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-muted/30 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="h-3 w-24 bg-muted/60 animate-pulse rounded" />
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="h-6 w-12 bg-muted animate-pulse rounded" />
            <div className="h-3 w-16 bg-muted/60 animate-pulse rounded" />
          </div>
        </div>

        {/* Progress bar skeleton */}
        <div className="mb-3 h-2 bg-muted/30 rounded-full overflow-hidden">
          <div className="h-full bg-muted/50 animate-pulse rounded-full" style={{ width: '80%' }} />
        </div>

        {/* Status tags skeleton */}
        <div className="flex gap-2 flex-wrap">
          {[1, 2].map(j => (
            <div
              key={j}
              className="h-6 w-16 bg-muted/30 animate-pulse rounded"
              style={{ animationDelay: `${j * 100}ms` }}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
)

export const RedemptionTypeBreakdown: FC<RedemptionTypeBreakdownProps> = ({
  typeBreakdown = [],
  isLoading = false,
}) => {
  const animation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 500,
  })

  if (isLoading) {
    return (
      <animated.div
        style={animation as any}
        className="rounded-3xl border bg-card p-6 shadow-sm"
      >
        <div className="mb-6">
          <div className="h-5 w-40 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-48 bg-muted/60 animate-pulse rounded" />
        </div>
        <LoadingSkeleton />
      </animated.div>
    )
  }

  return (
    <animated.div
      style={animation as any}
      className="rounded-3xl border bg-card p-6 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Distribuição por Tipo</h3>
        <p className="text-sm text-muted-foreground">
          {typeBreakdown.reduce((sum, item) => sum + item.count, 0)} resgates total
        </p>
      </div>

      {typeBreakdown.length === 0 ? (
        <div className="text-center py-8">
          <i className="ph ph-package text-4xl text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Nenhum dado de tipo disponível
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {typeBreakdown.map(type => (
            <TypeBreakdownItem key={type.type} type={type} />
          ))}
        </div>
      )}
    </animated.div>
  )
}
