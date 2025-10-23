/**
 * TransactionList Component
 * Renders list of transactions with smooth useTrail animations
 */

import { useTrail, animated, config } from '@react-spring/web'
import { TransactionCard } from './TransactionCard'
import { SkeletonTransactionCard } from './SkeletonTransactionCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'
import type { Transaction } from '@/types'

interface TransactionListProps {
  transactions: Transaction[]
  loading: boolean
  emptyState?: React.ReactNode
  className?: string
}

export const TransactionList = ({
  transactions,
  loading,
  emptyState,
  className,
}: TransactionListProps) => {
  // Trail animation for transactions
  const transactionTrail = useTrail(transactions.length, {
    from: { opacity: 0, scale: 0.7 },
    to: { opacity: 1, scale: 1 },
    config: config.gentle,
  })

  // Trail animation for skeletons (initial load)
  const skeletonTrail = useTrail(5, {
    from: { opacity: 0, scale: 0.7 },
    to: { opacity: 1, scale: 1 },
    config: config.gentle,
  })

  // Trail animation for loading skeletons (filter changes)
  const loadingSkeletonTrail = useTrail(3, {
    from: { opacity: 0, scale: 0.7 },
    to: { opacity: 1, scale: 1 },
    config: config.gentle,
  })

  // Show skeletons while loading (initial load or filter change)
  if (loading && transactions.length === 0) {
    return (
      <div className={cn('space-y-4 sm:space-y-6', className)}>
        {skeletonTrail.map((style, index) => (
          <animated.div key={`skeleton-${index}`} style={style}>
            <SkeletonTransactionCard />
          </animated.div>
        ))}
      </div>
    )
  }

  // Show skeletons for filter changes when there are existing transactions
  if (loading && transactions.length > 0) {
    return (
      <div className={className}>
        <div className="space-y-4 sm:space-y-6">
          {transactionTrail.map((style, index) => {
            const transaction = transactions[index]
            if (!transaction) return null
            
            return (
              <animated.div key={transaction.id} style={style}>
                <TransactionCard transaction={transaction} />
              </animated.div>
            )
          })}
        </div>
        <div className="mt-4 space-y-4 sm:space-y-6">
          {loadingSkeletonTrail.map((style, index) => (
            <animated.div key={`loading-${index}`} style={style}>
              <SkeletonTransactionCard />
            </animated.div>
          ))}
        </div>
      </div>
    )
  }

  // Show empty state if no transactions
  if (transactions.length === 0) {
    return (
      <div className={className}>
        {emptyState ?? (
          <EmptyState
            icon="ph-bold ph-chart-bar"
            title="Nenhuma transação encontrada"
            description="Suas movimentações de moedas aparecerão aqui quando você enviar elogios ou resgatar prêmios."
          />
        )}
      </div>
    )
  }

  // Show transactions with smooth trail animation
  return (
    <div className={cn('space-y-4 sm:space-y-6', className)}>
      {transactionTrail.map((style, index) => {
        const transaction = transactions[index]
        if (!transaction) return null
        
        return (
          <animated.div key={transaction.id} style={style}>
            <TransactionCard transaction={transaction} />
          </animated.div>
        )
      })}
    </div>
  )
}