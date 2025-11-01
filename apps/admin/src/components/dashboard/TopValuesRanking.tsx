import type { FC } from 'react'
import type { ValueRanking } from '../../types/dashboard'
import { animated, useSpring } from '@react-spring/web'

interface TopValuesRankingProps {
  values: ValueRanking[]
  isLoading?: boolean
}

const ValueRankingItem: FC<{
  value: ValueRanking
  rank: number
}> = ({ value, rank }) => {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 2:
        return 'bg-slate-100 text-slate-700 border-slate-300'
      case 3:
        return 'bg-orange-100 text-orange-700 border-orange-300'
      default:
        return 'bg-muted text-muted-foreground border-muted'
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return rank
    }
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold ${getRankColor(rank)}`}
      >
        {getRankIcon(rank)}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{value.valueName}</p>
        <p className="text-sm text-muted-foreground">
          {value.count} {value.count === 1 ? 'elogio' : 'elogios'}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-right">
          <p className="text-lg font-bold">{value.percentage.toFixed(1)}%</p>
        </div>
        <div className="w-24 bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${value.percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

const LoadingSkeleton: FC = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
        {/* Rank badge skeleton */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-muted bg-muted/30">
          <div className="w-5 h-5 bg-muted animate-pulse rounded" />
        </div>

        {/* Value info skeleton */}
        <div className="flex-1 space-y-2">
          <div className="h-4 w-36 bg-muted animate-pulse rounded" />
          <div className="h-3 w-24 bg-muted/60 animate-pulse rounded" />
        </div>

        {/* Percentage and progress bar skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-12 bg-muted animate-pulse rounded" />
          <div className="w-24 h-2 bg-muted/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-muted animate-pulse"
              style={{
                width: `${80 - i * 12}%`,
                animationDelay: `${i * 150}ms`,
              }}
            />
          </div>
        </div>
      </div>
    ))}
  </div>
)

export const TopValuesRanking: FC<TopValuesRankingProps> = ({ values, isLoading = false }) => {
  const rankingAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 500,
  })

  if (isLoading) {
    return (
      <animated.div
        style={rankingAnimation as any}
        className="rounded-3xl border bg-card p-6 shadow-sm"
      >
        <div className="mb-6">
          <div className="h-5 w-48 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        </div>
        <LoadingSkeleton />
      </animated.div>
    )
  }

  return (
    <animated.div
      style={rankingAnimation as any}
      className="rounded-3xl border bg-card p-6 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Top 5 Valores Mais Praticados</h3>
        <p className="text-sm text-muted-foreground">
          Últimos 30 dias
        </p>
      </div>

      {values.length === 0 ? (
        <div className="text-center py-8">
          <i className="ph ph-trophy text-4xl text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Nenhum valor praticado ainda
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {values.map((value, index) => (
            <ValueRankingItem key={value.valueId} value={value} rank={index + 1} />
          ))}
        </div>
      )}
    </animated.div>
  )
}
