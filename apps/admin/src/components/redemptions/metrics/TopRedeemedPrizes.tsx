import type { FC } from 'react'
import type { TopPrizeItem } from '@/types/redemptions'
import { animated, useSpring } from '@react-spring/web'

interface TopRedeemedPrizesProps {
  topPrizes?: TopPrizeItem[]
  isLoading?: boolean
}

const PrizeRankingItem: FC<{
  prize: TopPrizeItem
  rank: number
}> = ({ prize, rank }) => {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
      case 2:
        return 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800'
      case 3:
        return 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'
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
        <p className="font-medium truncate">{prize.prizeName}</p>
        <p className="text-sm text-muted-foreground">
          {prize.redemptionCount} {prize.redemptionCount === 1 ? 'resgate' : 'resgates'}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-semibold text-sm">R$ {prize.totalValueBRL}</p>
          <p className="text-xs text-muted-foreground">{prize.totalCoinsSpent} moedas</p>
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

        {/* Prize info skeleton */}
        <div className="flex-1 space-y-2">
          <div className="h-4 w-40 bg-muted animate-pulse rounded" />
          <div className="h-3 w-24 bg-muted/60 animate-pulse rounded" />
        </div>

        {/* Value info skeleton */}
        <div className="text-right space-y-2">
          <div className="h-5 w-20 bg-muted animate-pulse rounded ml-auto" />
          <div className="h-3 w-24 bg-muted/60 animate-pulse rounded ml-auto" />
        </div>
      </div>
    ))}
  </div>
)

export const TopRedeemedPrizes: FC<TopRedeemedPrizesProps> = ({
  topPrizes = [],
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
          <div className="h-5 w-48 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-56 bg-muted/60 animate-pulse rounded" />
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
        <h3 className="text-lg font-semibold">Top 5 Prêmios Mais Resgatados</h3>
        <p className="text-sm text-muted-foreground">
          Ranking por quantidade de resgates
        </p>
      </div>

      {topPrizes.length === 0 ? (
        <div className="text-center py-8">
          <i className="ph ph-gift text-4xl text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Nenhum prêmio resgatado ainda
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {topPrizes.map((prize, index) => (
            <PrizeRankingItem key={prize.prizeId} prize={prize} rank={index + 1} />
          ))}
        </div>
      )}
    </animated.div>
  )
}
